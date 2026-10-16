import apiClient from '../../../shared/api/client';
import type { ApiResponse } from '../../../shared/types/api';
import type { OnboardingChecklist, OnboardingTemplate } from '../../../shared/types/onboarding';

export const onboardingApi = {
  getTemplates: async () => {
    const { data } = await apiClient.get<ApiResponse<OnboardingTemplate[]>>('/onboarding/templates');
    return data.data;
  },

  getEmployeeChecklist: async (employeeId: number) => {
    const { data } = await apiClient.get<ApiResponse<OnboardingChecklist>>(`/onboarding/employees/${employeeId}`);
    return data.data;
  },
};
