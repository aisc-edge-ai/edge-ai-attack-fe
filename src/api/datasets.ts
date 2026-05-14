import apiClient from './client';
import type { Dataset } from '@/types';

export type VisualizationDatasetKind = 'latest' | 'fixed';

export const datasetsApi = {
  /**
   * 데이터셋 목록 — `GET /datasets`.
   * @param params.type - 'all' | 'image' | 'audio' 등 종류 필터
   * @param params.sort - 'recent' | 'name-asc' 등 정렬 키
   */
  getDatasets: async (params?: {
    type?: string;
    sort?: string;
  }): Promise<Dataset[]> => {
    const response = await apiClient.get<Dataset[]>('/datasets', { params });
    return response.data;
  },

  /**
   * 공격용 시각화 데이터셋 — `GET /datasets/visualization`.
   * 공격 위자드 마지막 step 에서 미리보기용으로 사용.
   * @param params.attackTypeIds - 선택된 공격 ID 들 (서버에 CSV 로 전달)
   * @param params.kind - 'latest' = 최신, 'fixed' = 고정 샘플
   */
  getVisualizationDatasets: async (params: {
    attackTypeIds: string[];
    kind: VisualizationDatasetKind;
  }): Promise<Dataset[]> => {
    const response = await apiClient.get<Dataset[]>('/datasets/visualization', {
      params: {
        attackTypeIds: params.attackTypeIds.join(','),
        kind: params.kind,
      },
    });
    return response.data;
  },

  /**
   * 데이터셋 업로드 — `POST /datasets` (multipart).
   * 파일은 `FormData` 로 직접 구성.
   */
  upload: async (formData: FormData): Promise<Dataset> => {
    const response = await apiClient.post<Dataset>('/datasets', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * 공격 실행 결과 데이터를 새 데이터셋으로 저장 — `POST /datasets/save`.
   * 공격 완료 후 "데이터 저장" 버튼에서 호출.
   */
  saveAttackData: async (attackId: string, name: string): Promise<Dataset> => {
    const response = await apiClient.post<Dataset>('/datasets/save', {
      attackId,
      name,
    });
    return response.data;
  },

  /** 데이터셋 삭제 — `DELETE /datasets/{id}`. */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/datasets/${id}`);
  },
};
