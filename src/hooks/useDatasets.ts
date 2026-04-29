import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { datasetsApi, type VisualizationDatasetKind } from '@/api/datasets';
import { getErrorMessage } from '@/api/client';
import { AppToaster } from '@/lib/toaster';
import { Intent } from '@blueprintjs/core';

export function useDatasets(params?: { type?: string; sort?: string }) {
  return useQuery({
    queryKey: ['datasets', params],
    queryFn: () => datasetsApi.getDatasets(params),
  });
}

export function useVisualizationDatasets(params: {
  attackTypeIds: string[];
  kind: VisualizationDatasetKind;
  enabled?: boolean;
}) {
  const sortedIds = [...params.attackTypeIds].sort();
  return useQuery({
    queryKey: ['datasets', 'visualization', params.kind, sortedIds],
    queryFn: () =>
      datasetsApi.getVisualizationDatasets({
        attackTypeIds: params.attackTypeIds,
        kind: params.kind,
      }),
    enabled: (params.enabled ?? true) && params.attackTypeIds.length > 0,
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
    onError: async (error) => {
      const toaster = await AppToaster;
      toaster.show({
        message: getErrorMessage(error, '데이터 저장에 실패했습니다.'),
        intent: Intent.DANGER,
        icon: 'error',
      });
    },
  });
}
