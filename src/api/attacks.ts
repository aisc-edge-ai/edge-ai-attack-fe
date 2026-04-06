import apiClient from './client';
import type { AttackCategory, AttackExecuteRequest } from '@/types';

export const attacksApi = {
  getAttackTypes: async (modelType: string): Promise<AttackCategory[]> => {
    const response = await apiClient.get<AttackCategory[]>('/attacks', {
      params: { modelType },
    });
    return response.data;
  },

  execute: async (request: AttackExecuteRequest): Promise<{ attackId: string }> => {
    const response = await apiClient.post<{ attackId: string }>(
      '/attack/execute',
      request
    );
    return response.data;
  },
};
