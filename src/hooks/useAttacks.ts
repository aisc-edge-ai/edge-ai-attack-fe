import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attacksApi } from '@/api/attacks';
import { getErrorMessage } from '@/api/client';
import { AppToaster } from '@/lib/toaster';
import { Intent } from '@blueprintjs/core';
import type { AttackExecuteRequest } from '@/types';
import { findProviderByModelType } from '@/lib/mock-providers';

/**
 * modelType 별 공격 카테고리 조회.
 * - mock provider 매칭 시 (예: 'voice') → provider.category 즉시 반환 (네트워크 호출 X)
 * - 매칭 안 됨 → axios → backend /attack?modelType=
 */
export function useAttackTypes(modelType: string | null) {
  const provider = modelType ? findProviderByModelType(modelType) : null;
  return useQuery({
    queryKey: ['attacks', modelType, provider?.id ?? 'backend'],
    queryFn: async () => {
      if (provider) return [provider.category];
      return attacksApi.getAttackTypes(modelType!);
    },
    enabled: !!modelType,
  });
}

export function useExecuteAttack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: AttackExecuteRequest) => attacksApi.execute(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
    },
    onError: async (error) => {
      const toaster = await AppToaster;
      toaster.show({
        message: getErrorMessage(error, '공격 실행에 실패했습니다.'),
        intent: Intent.DANGER,
        icon: 'error',
      });
    },
  });
}

export function useCancelAttack() {
  return useMutation({
    mutationFn: (attackId: string) => attacksApi.cancel(attackId),
    onError: async (error) => {
      const toaster = await AppToaster;
      toaster.show({
        message: getErrorMessage(error, '공격 취소에 실패했습니다.'),
        intent: Intent.DANGER,
        icon: 'error',
      });
    },
  });
}
