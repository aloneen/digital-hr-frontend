import apiClient from '../../../shared/api/client';
import type { ApiResponse } from '../../../shared/types/api';
import type { AiAnswerResponse, AiQuestionRequest } from '../../../shared/types/ai';

export const aiApi = {
  ask: async (payload: AiQuestionRequest) => {
    const { data } = await apiClient.post<ApiResponse<AiAnswerResponse>>('/ai/ask', payload);
    return data.data;
  },
};
