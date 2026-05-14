import apiClient from './client';
import type { AttackResult, ResultSummary, PaginatedResponse } from '@/types';

export const resultsApi = {
  /**
   * 공격 결과 목록 조회 — `GET /results`.
   * @param params - 모델/공격명/검색어/페이징 필터 (모두 optional)
   * @returns `{ data, total }` 페이지네이션 형태
   */
  getResults: async (params?: {
    model?: string;
    attack?: string;
    search?: string;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<AttackResult>> => {
    const response = await apiClient.get('/results', { params });
    return response.data;
  },

  /**
   * 단일 결과 상세 — `GET /results/{id}`.
   * `detail` 필드 (metrics, visualEvidence) 가 채워진 형태로 반환.
   */
  getResultById: async (id: string): Promise<AttackResult> => {
    const response = await apiClient.get<AttackResult>(`/results/${id}`);
    return response.data;
  },

  /**
   * 결과 요약 KPI — `GET /results/summary`.
   * 대시보드 / 결과 페이지 상단의 prominent 수치 카드용.
   */
  getSummary: async (): Promise<ResultSummary> => {
    const response = await apiClient.get<ResultSummary>('/results/summary');
    return response.data;
  },

  /** 결과 1건 삭제 — `DELETE /results/{id}`. */
  deleteResult: async (id: string): Promise<void> => {
    await apiClient.delete(`/results/${id}`);
  },
};
