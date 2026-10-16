import apiClient from '../../../shared/api/client';
import type { ApiResponse } from '../../../shared/types/api';
import type {
  DashboardSummary,
  HeadcountItem,
  HiringStatsItem,
  TurnoverItem,
  VacancyStatsItem,
} from '../../../shared/types/analytics';

export const analyticsApi = {
  getDashboard: async () => {
    const { data } = await apiClient.get<ApiResponse<DashboardSummary>>('/analytics/dashboard');
    return data.data;
  },

  getHeadcount: async () => {
    const { data } = await apiClient.get<ApiResponse<HeadcountItem[]>>('/analytics/headcount');
    return data.data;
  },

  getVacancyStats: async () => {
    const { data } = await apiClient.get<ApiResponse<VacancyStatsItem[]>>('/analytics/vacancies');
    return data.data;
  },

  getTurnover: async () => {
    const { data } = await apiClient.get<ApiResponse<TurnoverItem[]>>('/analytics/turnover');
    return data.data;
  },

  getHiring: async () => {
    const { data } = await apiClient.get<ApiResponse<HiringStatsItem[]>>('/analytics/hiring');
    return data.data;
  },
};
