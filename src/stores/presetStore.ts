import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Preset, PresetFormValues } from '@/types/preset';
import { MOCK_PRESETS } from '@/lib/mock-data';

interface PresetState {
  presets: Preset[];
  _seeded: boolean;
  addPreset: (values: PresetFormValues) => Preset;
  updatePreset: (id: string, values: PresetFormValues) => void;
  deletePreset: (id: string) => void;
}

export const usePresetStore = create<PresetState>()(
  persist(
    (set) => ({
      presets: [],
      _seeded: false,

      addPreset: (values) => {
        const now = new Date().toISOString();
        const newPreset: Preset = {
          ...values,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ presets: [newPreset, ...state.presets] }));
        return newPreset;
      },

      updatePreset: (id, values) =>
        set((state) => ({
          presets: state.presets.map((p) =>
            p.id === id
              ? { ...p, ...values, updatedAt: new Date().toISOString() }
              : p
          ),
        })),

      deletePreset: (id) =>
        set((state) => ({
          presets: state.presets.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'preset-storage',
      onRehydrateStorage: () => (state) => {
        if (state && !state._seeded) {
          state.presets = MOCK_PRESETS;
          state._seeded = true;
        }
      },
    }
  )
);
