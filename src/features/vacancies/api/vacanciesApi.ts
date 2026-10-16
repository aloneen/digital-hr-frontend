import apiClient from '../../../shared/api/client';
import type { ApiResponse } from '../../../shared/types/api';
import type { Vacancy } from '../../../shared/types/vacancy';

export const vacanciesApi = {
  getAll: async (params?: Record<string, string | number | undefined>) => {
    const { data } = await apiClient.get<ApiResponse<{ content: Vacancy[]; totalElements: number }>>('/vacancies', {
      params,
    });
    return data.data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<Vacancy>>(`/vacancies/${id}`);
    return data.data;
  },
};
