import apiClient from './client';
import type { Dataset } from '@/types';

export const datasetsApi = {
  getDatasets: async (params?: {
    type?: string;
    sort?: string;
  }): Promise<Dataset[]> => {
    const response = await apiClient.get<Dataset[]>('/datasets', { params });
    return response.data;
  },

  upload: async (formData: FormData): Promise<Dataset> => {
    const response = await apiClient.post<Dataset>('/datasets', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  saveAttackData: async (attackId: string, name: string): Promise<Dataset> => {
    const response = await apiClient.post<Dataset>('/datasets/save', {
      attackId,
      name,
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/datasets/${id}`);
  },
};
