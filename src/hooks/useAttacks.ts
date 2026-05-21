import { useQuery } from '@tanstack/react-query';
import { attacksApi } from '@/api/attacks';
import type { AttackExecuteRequest } from '@/types';
import { findProviderByModelType } from '@/lib/mock-providers';
import { useMutationWithToast } from './use-mutation-with-toast';
import { MESSAGES } from '@/lib/messages';

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
  return useMutationWithToast(
    (request: AttackExecuteRequest) => attacksApi.execute(request),
    { errorFallback: MESSAGES.ATTACK_EXECUTE_FAIL, invalidateKeys: [['results']] },
  );
}

export function useCancelAttack() {
  return useMutationWithToast(
    (attackId: string) => attacksApi.cancel(attackId),
    { errorFallback: MESSAGES.ATTACK_CANCEL_FAIL },
  );
}
