import apiClient from '../../../shared/api/client';
import type { ApiResponse } from '../../../shared/types/api';
import type { AppNotification } from '../../../shared/types/notification';

export const notificationsApi = {
  getMyNotifications: async () => {
    const { data } = await apiClient.get<ApiResponse<AppNotification[]>>('/notifications');
    return data.data;
  },

  getUnreadCount: async () => {
    const { data } = await apiClient.get<ApiResponse<number>>('/notifications/unread-count');
    return data.data;
  },

  markAsRead: async (id: number) => {
    const { data } = await apiClient.patch<ApiResponse<AppNotification>>(`/notifications/${id}/read`);
    return data.data;
  },

  markAllAsRead: async () => {
    const { data } = await apiClient.post<ApiResponse<void>>('/notifications/read-all');
    return data.data;
  },

  sendNotification: async (payload: { employeeId?: number; userId?: number; title: string; message: string }) => {
    const { data } = await apiClient.post<ApiResponse<void>>('/notifications/send', payload);
    return data.data;
  },
};
