import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resultsApi } from '@/api/results';
import { getErrorMessage } from '@/api/client';
import { AppToaster } from '@/lib/toaster';
import { Intent } from '@blueprintjs/core';
import { getAllMockResults, mergeWithMocks } from '@/lib/mock-providers';
import type { AttackResult, PaginatedResponse } from '@/types';

/**
 * 결과 목록 조회 — 백엔드 응답에 mock provider 의 결과를 append.
 * Paginated 응답 형태 (`{ data, total }`) 유지.
 */
export function useResults(params?: {
  model?: string;
  attack?: string;
  search?: string;
  page?: number;
  size?: number;
}) {
  return useQuery({
    queryKey: ['results', params],
    queryFn: async () => {
      const mocks = getAllMockResults();
      try {
        const backend = await resultsApi.getResults(params);
        return mergeWithMocks(backend, mocks) as PaginatedResponse<AttackResult>;
      } catch {
        // 백엔드 실패 시 mock 만으로 degradation
        return { data: mocks, total: mocks.length };
      }
    },
  });
}

/**
 * 결과 상세 조회 — id 가 mock provider 의 results 에 있으면 mock 즉시 반환,
 * 아니면 백엔드 axios 호출.
 */
export function useResultById(id: string | null) {
  return useQuery({
    queryKey: ['results', id],
    queryFn: async () => {
      const mock = getAllMockResults().find((r) => r.id === id);
      if (mock) return mock;
      return resultsApi.getResultById(id!);
    },
    enabled: !!id,
  });
}

export function useResultSummary() {
  return useQuery({
    queryKey: ['results', 'summary'],
    queryFn: () => resultsApi.getSummary(),
  });
}

export function useDeleteResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resultsApi.deleteResult(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
    },
    onError: async (error) => {
      const toaster = await AppToaster;
      toaster.show({
        message: getErrorMessage(error, '결과 삭제에 실패했습니다.'),
        intent: Intent.DANGER,
        icon: 'error',
      });
    },
  });
}
