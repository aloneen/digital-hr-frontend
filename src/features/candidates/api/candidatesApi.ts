import apiClient from '../../../shared/api/client';
import type { ApiResponse } from '../../../shared/types/api';
import type { Candidate } from '../../../shared/types/candidate';

export const candidatesApi = {
  getByVacancy: async (vacancyId: number) => {
    const { data } = await apiClient.get<ApiResponse<Candidate[]>>(`/vacancies/${vacancyId}/candidates`);
    return data.data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<Candidate>>(`/candidates/${id}`);
    return data.data;
  },
};
