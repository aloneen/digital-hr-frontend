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

  updateStage: async (id: number, stage: Candidate['stage']) => {
    const { data } = await apiClient.patch<ApiResponse<Candidate>>(`/candidates/${id}/stage`, { stage });
    return data.data;
  },

  create: async (payload: {
    firstName: string;
    lastName: string;
    vacancyId: number;
    email?: string;
    phone?: string;
    notes?: string;
    resumeUrl?: string;
  }) => {
    const { data } = await apiClient.post<ApiResponse<Candidate>>('/candidates', payload);
    return data.data;
  },
};
