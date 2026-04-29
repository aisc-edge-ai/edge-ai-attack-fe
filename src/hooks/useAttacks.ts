import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attacksApi } from '@/api/attacks';
import { getErrorMessage } from '@/api/client';
import { AppToaster } from '@/lib/toaster';
import { Intent } from '@blueprintjs/core';
import type { AttackExecuteRequest } from '@/types';

export function useAttackTypes(modelType: string | null) {
  return useQuery({
    queryKey: ['attacks', modelType],
    queryFn: () => attacksApi.getAttackTypes(modelType!),
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
