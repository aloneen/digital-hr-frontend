import apiClient from '../../../shared/api/client';
import type { ApiResponse } from '../../../shared/types/api';
import type { Department, DepartmentTree } from '../../../shared/types/department';

export const departmentsApi = {
  getTree: async () => {
    const { data } = await apiClient.get<ApiResponse<DepartmentTree[]>>('/departments/tree');
    return data.data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<Department>>(`/departments/${id}`);
    return data.data;
  },
};
