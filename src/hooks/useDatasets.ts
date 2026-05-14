import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { datasetsApi, type VisualizationDatasetKind } from '@/api/datasets';
import { getErrorMessage } from '@/api/client';
import { AppToaster } from '@/lib/toaster';
import { Intent } from '@blueprintjs/core';
import type { ModelType } from '@/types';
import { findDatasetMockProvider } from '@/lib/mock-providers';

export function useDatasets(params?: { type?: string; sort?: string }) {
  return useQuery({
    queryKey: ['datasets', params],
    queryFn: () => datasetsApi.getDatasets(params),
  });
}

/**
 * Step 3 의 데이터셋 후보 조회.
 *   - modelType + attackTypeIds 가 MOCK_PROVIDERS 의 어느 entry 와 매칭되면 → 해당 provider 의 mock datasets 반환 (네트워크 호출 X)
 *   - 매칭되지 않으면 → 기존대로 axios → backend /datasets/visualization
 */
export function useVisualizationDatasets(params: {
  modelType: ModelType | null;
  attackTypeIds: string[];
  kind: VisualizationDatasetKind;
  enabled?: boolean;
}) {
  const provider = findDatasetMockProvider(params.modelType, params.attackTypeIds);
  const sortedIds = [...params.attackTypeIds].sort();

  return useQuery({
    queryKey: [
      'datasets',
      'visualization',
      params.kind,
      sortedIds,
      provider?.id ?? 'backend',
    ],
    queryFn: async () => {
      if (provider) {
        const list = [...provider.datasets];
        if (params.kind === 'latest') {
          list.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
        }
        return list;
      }
      return datasetsApi.getVisualizationDatasets({
        attackTypeIds: params.attackTypeIds,
        kind: params.kind,
      });
    },
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
