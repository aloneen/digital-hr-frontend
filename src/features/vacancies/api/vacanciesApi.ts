import apiClient from '../../../shared/api/client';
import type { ApiResponse } from '../../../shared/types/api';
import type { Vacancy, VacancyCreateRequest, VacancyUpdateRequest } from '../../../shared/types/vacancy';

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

  create: async (payload: VacancyCreateRequest) => {
    const { data } = await apiClient.post<ApiResponse<Vacancy>>('/vacancies', payload);
    return data.data;
  },

  update: async (id: number, payload: VacancyUpdateRequest) => {
    const { data } = await apiClient.put<ApiResponse<Vacancy>>(`/vacancies/${id}`, payload);
    return data.data;
  },

  delete: async (id: number) => {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/vacancies/${id}`);
    return data.data;
  },
};
