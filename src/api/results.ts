import apiClient from './client';
import type { AttackResult, ResultSummary } from '@/types';

export const resultsApi = {
  getResults: async (params?: {
    model?: string;
    attack?: string;
    search?: string;
    page?: number;
    size?: number;
  }): Promise<{ data: AttackResult[]; total: number }> => {
    const response = await apiClient.get('/results', { params });
    return response.data;
  },

  getResultById: async (id: string): Promise<AttackResult> => {
    const response = await apiClient.get<AttackResult>(`/results/${id}`);
    return response.data;
  },

  getSummary: async (): Promise<ResultSummary> => {
    const response = await apiClient.get<ResultSummary>('/results/summary');
    return response.data;
  },

  deleteResult: async (id: string): Promise<void> => {
    await apiClient.delete(`/results/${id}`);
  },
};
