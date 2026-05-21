import { useQuery } from '@tanstack/react-query';
import { datasetsApi, type VisualizationDatasetKind } from '@/api/datasets';
import type { ModelType } from '@/types';
import { findDatasetMockProvider } from '@/lib/mock-providers';
import { useMutationWithToast } from './use-mutation-with-toast';
import { MESSAGES } from '@/lib/messages';

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
  return useMutationWithToast(
    ({ attackId, name }: { attackId: string; name: string }) => datasetsApi.saveAttackData(attackId, name),
    { errorFallback: MESSAGES.DATA_SAVE_FAIL, invalidateKeys: [['datasets']] },
  );
}
