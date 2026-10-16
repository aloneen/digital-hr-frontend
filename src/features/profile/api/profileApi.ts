import apiClient from '../../../shared/api/client';
import type { ApiResponse } from '../../../shared/types/api';
import type { EmployeeProfile } from '../../../shared/types/profile';

export const profileApi = {
  getProfile: async () => {
    const { data } = await apiClient.get<ApiResponse<EmployeeProfile>>('/profile');
    return data.data;
  },
};
