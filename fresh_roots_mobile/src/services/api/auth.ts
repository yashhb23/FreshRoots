import apiClient from './client';
import {ApiResponse, AuthResponse} from '../../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'buyer' | 'seller';
}

export interface GoogleAuthRequest {
  email: string;
  name: string;
  googleId?: string;
  photoUrl?: string;
}

export const authService = {
  register: async (data: RegisterRequest) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      data,
    );
    return response.data;
  },

  login: async (data: LoginRequest) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      data,
    );
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get<ApiResponse<any>>('/auth/me');
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post<
      ApiResponse<{accessToken: string; refreshToken: string}>
    >('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },

  /**
   * Authenticate with Google via Firebase.
   * Creates new user if they don't exist, otherwise logs them in.
   */
  googleAuth: async (data: GoogleAuthRequest) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/google',
      data,
    );
    return response.data;
  },
};
