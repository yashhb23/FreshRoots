import axios, {AxiosError, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {config} from '../../utils/config';
import {getTokens, setTokens, clearTokens} from '../../utils/storage';
import {ApiResponse} from '../../types';

/**
 * Error types for categorizing API failures
 */
export type ApiErrorType = 'network' | 'server' | 'timeout' | 'offline' | 'auth' | 'validation';

export interface ApiError {
  type: ApiErrorType;
  message: string;
  statusCode?: number;
  originalError?: any;
}

/**
 * Parse Axios errors into user-friendly ApiError objects
 */
export const parseApiError = (error: any): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{message?: string; error?: string}>;

    // No response = network error or timeout
    if (!axiosError.response) {
      if (axiosError.code === 'ECONNABORTED' || axiosError.message.includes('timeout')) {
        return {
          type: 'timeout',
          message: 'Request timed out. Please try again.',
          originalError: error,
        };
      }
      if (axiosError.message === 'Network Error') {
        return {
          type: 'offline',
          message: 'No internet connection. Please check your network.',
          originalError: error,
        };
      }
      return {
        type: 'network',
        message: 'Unable to connect to server. Please try again.',
        originalError: error,
      };
    }

    const status = axiosError.response.status;
    const serverMessage =
      axiosError.response.data?.message ||
      axiosError.response.data?.error;

    // Redirects (3xx) - server misconfiguration or proxy issue
    if (status >= 300 && status < 400) {
      return {
        type: 'network',
        message: 'Could not reach the server. Please check your connection and try again.',
        statusCode: status,
        originalError: error,
      };
    }

    // Validation errors (400, 422)
    if (status === 400 || status === 422) {
      return {
        type: 'validation',
        message: serverMessage || 'Invalid request. Please check your input.',
        statusCode: status,
        originalError: error,
      };
    }

    // Auth errors (401, 403)
    if (status === 401 || status === 403) {
      return {
        type: 'auth',
        message: serverMessage || 'Authentication failed. Please log in again.',
        statusCode: status,
        originalError: error,
      };
    }

    // Not found (404)
    if (status === 404) {
      return {
        type: 'network',
        message: 'Service temporarily unavailable. Please try again later.',
        statusCode: status,
        originalError: error,
      };
    }

    // Rate limiting (429)
    if (status === 429) {
      return {
        type: 'server',
        message: 'Too many requests. Please wait a moment and try again.',
        statusCode: status,
        originalError: error,
      };
    }

    // Server errors (5xx)
    if (status >= 500) {
      return {
        type: 'server',
        message: 'Server is busy. Please try again in a moment.',
        statusCode: status,
        originalError: error,
      };
    }

    // Other client errors
    return {
      type: 'network',
      message: serverMessage || 'Something went wrong. Please try again.',
      statusCode: status,
      originalError: error,
    };
  }

  // Non-Axios errors
  return {
    type: 'network',
    message: error?.message || 'An unexpected error occurred.',
    originalError: error,
  };
};

/**
 * Check if device is online (basic check)
 */
export const isOnline = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    await fetch(`${config.API_BASE_URL}/health`, {
      method: 'HEAD',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return true;
  } catch {
    return false;
  }
};

// Create axios instance
const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  async (requestConfig: InternalAxiosRequestConfig) => {
    const tokens = await getTokens();
    if (tokens?.accessToken && requestConfig.headers) {
      requestConfig.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return requestConfig;
  },
  error => Promise.reject(error),
);

// Response interceptor - Handle token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({resolve, reject});
        })
          .then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const tokens = await getTokens();
      if (!tokens?.refreshToken) {
        // No refresh token, logout
        await clearTokens();
        processQueue(error, null);
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        // Try to refresh token
        const response = await axios.post<ApiResponse<{
          accessToken: string;
          refreshToken: string;
        }>>(
          `${config.API_BASE_URL}/auth/refresh`,
          {
            refreshToken: tokens.refreshToken,
          },
        );

        if (response.data.success && response.data.data) {
          const {accessToken, refreshToken} = response.data.data;
          await setTokens({accessToken, refreshToken});

          // Update authorization header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          processQueue(null, accessToken);
          isRefreshing = false;

          // Retry original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout
        processQueue(refreshError, null);
        await clearTokens();
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
