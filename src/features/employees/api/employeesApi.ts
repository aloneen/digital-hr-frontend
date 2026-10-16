import apiClient from '../../../shared/api/client';
import type { ApiResponse } from '../../../shared/types/api';
import type { Employee, EmployeeCreateRequest, EmployeesPageResponse } from '../../../shared/types/employee';

export const employeesApi = {
  getAll: async (params?: Record<string, string | number | undefined>) => {
    const { data } = await apiClient.get<ApiResponse<EmployeesPageResponse>>('/employees', { params });
    return data.data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<Employee>>(`/employees/${id}`);
    return data.data;
  },

  create: async (payload: EmployeeCreateRequest) => {
    const { data } = await apiClient.post<ApiResponse<Employee>>('/employees', payload);
    return data.data;
  },
};
