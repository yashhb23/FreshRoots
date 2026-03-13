import apiClient from './client';
import {ApiResponse, Listing, PaginatedListings, Category} from '../../types';

export interface ListingsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: 'price' | 'created_at' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export const listingsService = {
  // Get all listings with filters
  getListings: async (params: ListingsQueryParams = {}) => {
    const response = await apiClient.get<
      ApiResponse<PaginatedListings> & {
        meta?: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
          hasMore?: boolean;
        };
      }
    >(
      '/listings',
      {params},
    );
    const payload: any = response.data;

    // Backend (NestJS) returns: { success: true, data: Listing[], meta: {...} }
    // Mobile previously expected: { success: true, data: { listings: Listing[], pagination: {...} } }
    if (payload?.success && Array.isArray(payload.data) && payload.meta) {
      return {
        ...payload,
        data: {
          listings: payload.data,
          pagination: {
            total: payload.meta.total,
            page: payload.meta.page,
            limit: payload.meta.limit,
            totalPages: payload.meta.totalPages,
          },
        },
      } as ApiResponse<PaginatedListings>;
    }

    return payload as ApiResponse<PaginatedListings>;
  },

  // Get single listing by ID
  getListing: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Listing>>(
      `/listings/${id}`,
    );
    return response.data;
  },

  // Get all categories
  getCategories: async () => {
    const response = await apiClient.get<ApiResponse<Category[]>>(
      '/categories',
    );
    return response.data;
  },
};
