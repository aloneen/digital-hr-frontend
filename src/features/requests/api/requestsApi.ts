import apiClient from '../../../shared/api/client';
import type { ApiResponse } from '../../../shared/types/api';
import type {
  HrRequest,
  HrRequestCreateRequest,
  HrRequestReviewRequest,
} from '../../../shared/types/request';

export const requestsApi = {
  getMyRequests: async () => {
    const { data } = await apiClient.get<ApiResponse<HrRequest[]>>('/requests/my');
    return data.data;
  },

  getAllRequests: async () => {
    const { data } = await apiClient.get<ApiResponse<HrRequest[]>>('/requests');
    return data.data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<HrRequest>>(`/requests/${id}`);
    return data.data;
  },

  create: async (payload: HrRequestCreateRequest) => {
    const { data } = await apiClient.post<ApiResponse<HrRequest>>('/requests', payload);
    return data.data;
  },

  review: async (id: number, payload: HrRequestReviewRequest) => {
    const { data } = await apiClient.patch<ApiResponse<HrRequest>>(`/requests/${id}/review`, payload);
    return data.data;
  },
};
