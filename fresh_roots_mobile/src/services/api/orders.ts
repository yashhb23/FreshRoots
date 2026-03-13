import apiClient from './client';
import {ApiResponse, Order} from '../../types';

export interface CreateOrderRequest {
  items: Array<{
    listing_id: string;
    quantity: number;
  }>;
  payment_method: 'juice' | 'myt_money' | 'card' | 'cash_on_delivery';
}

export const ordersService = {
  // Create a new order
  createOrder: async (data: CreateOrderRequest) => {
    const response = await apiClient.post<ApiResponse<Order>>(
      '/orders',
      data,
    );
    return response.data;
  },

  // Get my orders
  getMyOrders: async (page: number = 1, limit: number = 20) => {
    const response = await apiClient.get<ApiResponse<Order[]>>(
      '/orders/my-orders',
      {
        params: {page, limit},
      },
    );
    return response.data;
  },

  // Get single order by ID
  getOrder: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Order>>(
      `/orders/${id}`,
    );
    return response.data;
  },
};
