import apiClient from './client';
import {
  ApiResponse,
  PaymentInitiateRequest,
  PaymentInitiateResponse,
  PaymentStatusResponse,
} from '../../types';

export const paymentsService = {
  // Initiate payment (Juice)
  initiatePayment: async (data: PaymentInitiateRequest) => {
    const response = await apiClient.post<
      ApiResponse<PaymentInitiateResponse>
    >('/payments/initiate', data);
    return response.data;
  },

  // Get payment status
  getPaymentStatus: async (transactionId: string) => {
    const response = await apiClient.get<ApiResponse<PaymentStatusResponse>>(
      `/payments/status/${transactionId}`,
    );
    return response.data;
  },
};
