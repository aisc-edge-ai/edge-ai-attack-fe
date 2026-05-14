import apiClient from './client';
import type { AttackCategory, AttackExecuteRequest } from '@/types';

export const attacksApi = {
  /**
   * 공격 기법 트리 조회 — `GET /attack?modelType=`.
   * @param modelType - 'cctv' | 'voice' | 'autonomous' 등. 'voice' 면 hook 단에서 mock provider 가 응답함.
   * @returns 카테고리 + 자식 attack 들의 트리
   * @throws 401 시 refresh 인터셉터 자동 처리
   */
  getAttackTypes: async (modelType: string): Promise<AttackCategory[]> => {
    const response = await apiClient.get<AttackCategory[]>('/attack', {
      params: { modelType },
    });
    return response.data;
  },

  /**
   * 공격 실행 — `POST /attack/execute`.
   * 응답의 `attackId` 로 WebSocket `/ws/attack/{id}/progress` 구독.
   */
  execute: async (request: AttackExecuteRequest): Promise<{ attackId: string }> => {
    const response = await apiClient.post<{ attackId: string }>(
      '/attack/execute',
      request
    );
    return response.data;
  },

  /** 실행 중 공격 취소 — `POST /attack/{id}/cancel`. */
  cancel: async (attackId: string): Promise<void> => {
    await apiClient.post(`/attack/${encodeURIComponent(attackId)}/cancel`);
  },
};
