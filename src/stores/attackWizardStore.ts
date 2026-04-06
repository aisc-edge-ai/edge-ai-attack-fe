import { create } from 'zustand';
import type { ModelType } from '@/types';

interface AttackWizardState {
  currentStep: 1 | 2 | 3;
  selectedModelType: ModelType | null;
  selectedAttackIds: string[];
  dataSource: 'generate' | 'load';
  datasetSubOption: 'latest' | 'fixed' | null;
  selectedDatasetId: string | null;

  // Actions
  setStep: (step: 1 | 2 | 3) => void;
  nextStep: () => void;
  prevStep: () => void;
  setModelType: (type: ModelType) => void;
  toggleAttack: (id: string) => void;
  toggleCategory: (childIds: string[]) => void;
  setDataSource: (source: 'generate' | 'load') => void;
  setDatasetSubOption: (opt: 'latest' | 'fixed' | null) => void;
  setDatasetId: (id: string | null) => void;
  reset: () => void;
  canProceedFromStep: (step: number) => boolean;
}

const initialState = {
  currentStep: 1 as const,
  selectedModelType: null,
  selectedAttackIds: [] as string[],
  dataSource: 'generate' as const,
  datasetSubOption: null,
  selectedDatasetId: null,
};

export const useAttackWizardStore = create<AttackWizardState>()((set, get) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 3) as 1 | 2 | 3,
    })),
  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1) as 1 | 2 | 3,
    })),

  setModelType: (type) => set({ selectedModelType: type }),

  toggleAttack: (id) =>
    set((state) => ({
      selectedAttackIds: state.selectedAttackIds.includes(id)
        ? state.selectedAttackIds.filter((a) => a !== id)
        : [...state.selectedAttackIds, id],
    })),

  toggleCategory: (childIds) =>
    set((state) => {
      const allSelected = childIds.every((id) =>
        state.selectedAttackIds.includes(id)
      );
      if (allSelected) {
        return {
          selectedAttackIds: state.selectedAttackIds.filter(
            (id) => !childIds.includes(id)
          ),
        };
      }
      return {
        selectedAttackIds: [
          ...new Set([...state.selectedAttackIds, ...childIds]),
        ],
      };
    }),

  setDataSource: (source) =>
    set({ dataSource: source, datasetSubOption: null, selectedDatasetId: null }),
  setDatasetSubOption: (opt) => set({ datasetSubOption: opt }),
  setDatasetId: (id) => set({ selectedDatasetId: id }),

  reset: () => set(initialState),

  canProceedFromStep: (step) => {
    const state = get();
    switch (step) {
      case 1:
        return state.selectedModelType !== null;
      case 2:
        return state.selectedAttackIds.length > 0;
      case 3:
        if (state.dataSource === 'load') {
          return state.selectedDatasetId !== null;
        }
        return true;
      default:
        return false;
    }
  },
}));
