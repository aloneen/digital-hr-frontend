import apiClient from '../../../shared/api/client';
import type { ApiResponse } from '../../../shared/types/api';
import type {
  Course,
  CourseAssignRequest,
  CourseAssignment,
  CourseProgressUpdateRequest,
} from '../../../shared/types/learning';

export const learningApi = {
  getAllCourses: async () => {
    const { data } = await apiClient.get<ApiResponse<Course[]>>('/learning/courses');
    return data.data;
  },

  getCourseById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<Course>>(`/learning/courses/${id}`);
    return data.data;
  },

  getMyCourses: async () => {
    const { data } = await apiClient.get<ApiResponse<CourseAssignment[]>>('/learning/my-courses');
    return data.data;
  },

  updateProgress: async (id: number, payload: CourseProgressUpdateRequest) => {
    const { data } = await apiClient.patch<ApiResponse<CourseAssignment>>(
      `/learning/assignments/${id}/progress`,
      payload,
    );
    return data.data;
  },

  assignCourse: async (payload: CourseAssignRequest) => {
    const { data } = await apiClient.post<ApiResponse<CourseAssignment>>(
      '/learning/assignments',
      payload,
    );
    return data.data;
  },
};
