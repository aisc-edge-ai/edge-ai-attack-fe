import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Intent } from '@blueprintjs/core';
import { presetsApi } from '@/api/presets';
import { getErrorMessage } from '@/api/client';
import { AppToaster } from '@/lib/toaster';
import type { PresetFormValues } from '@/types';

export function usePresets() {
  return useQuery({
    queryKey: ['presets'],
    queryFn: presetsApi.getPresets,
  });
}

export function useCreatePreset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: PresetFormValues) => presetsApi.createPreset(values),
    onSuccess: async () => {
      qc.invalidateQueries({ queryKey: ['presets'] });
      (await AppToaster).show({
        message: '프리셋이 생성되었습니다.',
        intent: Intent.SUCCESS,
        icon: 'tick',
      });
    },
    onError: async (error) => {
      (await AppToaster).show({
        message: getErrorMessage(error, '프리셋 생성에 실패했습니다.'),
        intent: Intent.DANGER,
        icon: 'error',
      });
    },
  });
}

export function useUpdatePreset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: PresetFormValues }) =>
      presetsApi.updatePreset(id, values),
    onSuccess: async () => {
      qc.invalidateQueries({ queryKey: ['presets'] });
      (await AppToaster).show({
        message: '프리셋이 수정되었습니다.',
        intent: Intent.SUCCESS,
        icon: 'tick',
      });
    },
    onError: async (error) => {
      (await AppToaster).show({
        message: getErrorMessage(error, '프리셋 수정에 실패했습니다.'),
        intent: Intent.DANGER,
        icon: 'error',
      });
    },
  });
}

export function useDeletePreset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => presetsApi.deletePreset(id),
    onSuccess: async () => {
      qc.invalidateQueries({ queryKey: ['presets'] });
      (await AppToaster).show({
        message: '프리셋이 삭제되었습니다.',
        intent: Intent.SUCCESS,
        icon: 'tick',
      });
    },
    onError: async (error) => {
      (await AppToaster).show({
        message: getErrorMessage(error, '프리셋 삭제에 실패했습니다.'),
        intent: Intent.DANGER,
        icon: 'error',
      });
    },
  });
}
