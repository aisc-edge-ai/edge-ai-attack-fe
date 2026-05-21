import { useQuery } from '@tanstack/react-query';
import { presetsApi } from '@/api/presets';
import { useMutationWithToast } from './use-mutation-with-toast';
import { MESSAGES } from '@/lib/messages';
import type { PresetFormValues } from '@/types';

export function usePresets() {
  return useQuery({
    queryKey: ['presets'],
    queryFn: presetsApi.getPresets,
  });
}

export function useCreatePreset() {
  return useMutationWithToast(
    (values: PresetFormValues) => presetsApi.createPreset(values),
    { successMessage: MESSAGES.PRESET_CREATED, errorFallback: MESSAGES.PRESET_CREATE_FAIL, invalidateKeys: [['presets']] },
  );
}

export function useUpdatePreset() {
  return useMutationWithToast(
    ({ id, values }: { id: string; values: PresetFormValues }) => presetsApi.updatePreset(id, values),
    { successMessage: MESSAGES.PRESET_UPDATED, errorFallback: MESSAGES.PRESET_UPDATE_FAIL, invalidateKeys: [['presets']] },
  );
}

export function useDeletePreset() {
  return useMutationWithToast(
    (id: string) => presetsApi.deletePreset(id),
    { successMessage: MESSAGES.PRESET_DELETED, errorFallback: MESSAGES.PRESET_DELETE_FAIL, invalidateKeys: [['presets']] },
  );
}
