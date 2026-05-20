import apiClient from './client';
import type { Preset, PresetFormValues } from '@/types';
import { usePresetStore } from '@/stores/presetStore';

async function withMockFallback<T>(
  fetcher: () => Promise<T>,
  mockFn: () => T,
  endpointName: string,
): Promise<T> {
  try {
    return await fetcher();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn(`[presets] ${endpointName} → mock fallback`, error);
    }
    return mockFn();
  }
}

export const presetsApi = {
  getPresets: (): Promise<Preset[]> =>
    withMockFallback(
      async () => (await apiClient.get<Preset[]>('/presets')).data,
      () => usePresetStore.getState().presets,
      'GET /presets',
    ),

  createPreset: (values: PresetFormValues): Promise<Preset> =>
    withMockFallback(
      async () => (await apiClient.post<Preset>('/presets', values)).data,
      () => usePresetStore.getState().addPreset(values),
      'POST /presets',
    ),

  updatePreset: (id: string, values: PresetFormValues): Promise<Preset> =>
    withMockFallback(
      async () => (await apiClient.put<Preset>(`/presets/${id}`, values)).data,
      () => {
        usePresetStore.getState().updatePreset(id, values);
        return { ...values, id, createdAt: '', updatedAt: new Date().toISOString() } as Preset;
      },
      `PUT /presets/${id}`,
    ),

  deletePreset: (id: string): Promise<void> =>
    withMockFallback(
      async () => {
        await apiClient.delete(`/presets/${id}`);
      },
      () => {
        usePresetStore.getState().deletePreset(id);
      },
      `DELETE /presets/${id}`,
    ),
};
