import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resultsApi } from '@/api/results';

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
  });
}
