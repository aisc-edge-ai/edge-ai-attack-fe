import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { QueryKey, MutationFunction } from '@tanstack/react-query';
import { Intent } from '@blueprintjs/core';
import { getErrorMessage } from '@/api/client';
import { AppToaster } from '@/lib/toaster';

interface MutationToastConfig<TData> {
  successMessage?: string;
  errorFallback: string;
  invalidateKeys?: QueryKey[];
  onSuccessExtra?: (data: TData) => void;
}

export function useMutationWithToast<TData, TVariables>(
  mutationFn: MutationFunction<TData, TVariables>,
  config: MutationToastConfig<TData>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: async (data) => {
      if (config.invalidateKeys) {
        for (const key of config.invalidateKeys) {
          queryClient.invalidateQueries({ queryKey: key });
        }
      }
      if (config.successMessage) {
        (await AppToaster).show({
          message: config.successMessage,
          intent: Intent.SUCCESS,
          icon: 'tick',
        });
      }
      config.onSuccessExtra?.(data);
    },
    onError: async (error) => {
      (await AppToaster).show({
        message: getErrorMessage(error, config.errorFallback),
        intent: Intent.DANGER,
        icon: 'error',
      });
    },
  });
}
