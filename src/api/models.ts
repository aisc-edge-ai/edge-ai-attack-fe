import apiClient from './client';
import type { Model } from '@/types';

export const modelsApi = {
  /**
   * 모델 목록 조회 — `GET /models`.
   * hook 단(`useModels`) 에서 mock provider 의 모델을 append 하여 사용.
   * 백엔드 실패 시 polite degradation (mock 만 반환).
   */
  getModels: async (): Promise<Model[]> => {
    const response = await apiClient.get<Model[]>('/models');
    return response.data;
  },
};
