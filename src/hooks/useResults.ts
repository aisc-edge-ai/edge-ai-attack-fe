import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resultsApi } from '@/api/results';
import { getErrorMessage } from '@/api/client';
import { AppToaster } from '@/lib/toaster';
import { Intent } from '@blueprintjs/core';

export function useResults(params?: {
  model?: string;
  attack?: string;
  search?: string;
  page?: number;
  size?: number;
}) {
  return useQuery({
    queryKey: ['results', params],
    queryFn: () => resultsApi.getResults(params),
  });
}

export function useResultById(id: string | null) {
  return useQuery({
    queryKey: ['results', id],
    queryFn: () => resultsApi.getResultById(id!),
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
