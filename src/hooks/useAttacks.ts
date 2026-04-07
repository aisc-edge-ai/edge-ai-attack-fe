import { useQuery, useMutation } from '@tanstack/react-query';
import { attacksApi } from '@/api/attacks';
import type { AttackExecuteRequest } from '@/types';

export function useAttackTypes(modelType: string | null) {
  return useQuery({
    queryKey: ['attacks', modelType],
    queryFn: () => attacksApi.getAttackTypes(modelType!),
    enabled: !!modelType,
  });
}

export function useExecuteAttack() {
  return useMutation({
    mutationFn: (request: AttackExecuteRequest) => attacksApi.execute(request),
  });
}
