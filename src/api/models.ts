import apiClient from './client';
import type { Model } from '@/types';

export const modelsApi = {
  getModels: async (): Promise<Model[]> => {
    const response = await apiClient.get<Model[]>('/models');
    return response.data;
  },
};
