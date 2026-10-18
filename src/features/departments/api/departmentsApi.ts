import apiClient from '../../../shared/api/client';
import type { ApiResponse } from '../../../shared/types/api';
import type {
  Department,
  DepartmentCreateRequest,
  DepartmentTree,
  DepartmentUpdateRequest,
} from '../../../shared/types/department';

export const departmentsApi = {
  getAll: async () => {
    const { data } = await apiClient.get<ApiResponse<Department[]>>('/departments');
    return data.data;
  },

  getTree: async () => {
    const { data } = await apiClient.get<ApiResponse<DepartmentTree[]>>('/departments/tree');
    return data.data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<Department>>(`/departments/${id}`);
    return data.data;
  },

  create: async (payload: DepartmentCreateRequest) => {
    const { data } = await apiClient.post<ApiResponse<Department>>('/departments', payload);
    return data.data;
  },

  update: async (id: number, payload: DepartmentUpdateRequest) => {
    const { data } = await apiClient.put<ApiResponse<Department>>(`/departments/${id}`, payload);
    return data.data;
  },

  delete: async (id: number) => {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/departments/${id}`);
    return data.data;
  },
};
