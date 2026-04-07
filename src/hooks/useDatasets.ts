import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { datasetsApi } from '@/api/datasets';

export function useDatasets(params?: { type?: string; sort?: string }) {
  return useQuery({
    queryKey: ['datasets', params],
    queryFn: () => datasetsApi.getDatasets(params),
  });
}

export function useSaveAttackData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ attackId, name }: { attackId: string; name: string }) =>
      datasetsApi.saveAttackData(attackId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
    },
  });
}
