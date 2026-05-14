import { useQuery } from '@tanstack/react-query';
import { modelsApi } from '@/api/models';
import { getAllMockModels } from '@/lib/mock-providers';

/**
 * 모델 목록 조회 — 백엔드 응답에 mock provider 의 모델을 append.
 * 백엔드 실패(401, 5xx 등) 시 mock 만 반환하여 frontend-only degradation 보장.
 */
export function useModels() {
  return useQuery({
    queryKey: ['models'],
    queryFn: async () => {
      try {
        const backend = await modelsApi.getModels();
        return [...backend, ...getAllMockModels()];
      } catch {
        return getAllMockModels();
      }
    },
  });
}
