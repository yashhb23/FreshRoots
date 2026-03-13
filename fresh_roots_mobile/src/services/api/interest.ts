import apiClient from './client';
import {ApiResponse, InterestExpression} from '../../types';

export interface ExpressInterestRequest {
  listing_id: string;
  message?: string;
}

export const interestService = {
  // Express interest in a listing
  expressInterest: async (data: ExpressInterestRequest) => {
    const response = await apiClient.post<ApiResponse<InterestExpression>>(
      '/interest',
      data,
    );
    return response.data;
  },

  // Get my interest expressions
  getMyInterests: async (page: number = 1, limit: number = 20) => {
    const response = await apiClient.get<ApiResponse<InterestExpression[]>>(
      '/interest/my-interests',
      {
        params: {page, limit},
      },
    );
    return response.data;
  },
};
