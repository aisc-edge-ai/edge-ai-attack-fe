import { create } from 'zustand';
import type { Model, ModelType } from '@/types';
import { isAttackTypeSupported, isModelTypeSupported } from '@/lib/constants';

type WizardStep = 1 | 2 | 3 | 4;

interface AttackWizardState {
  currentStep: WizardStep;
  selectedModelId: string | null;
  selectedModelName: string | null;
  selectedModelType: ModelType | null;
  selectedAttackIds: string[];
  dataSource: 'generate' | 'load';
  datasetSubOption: 'latest' | 'fixed' | null;
  selectedDatasetIds: string[];
  // Transient hover state — 우측 그래픽 캔버스 preview 용. 영구화 X.
  hoveredModelType: ModelType | null;
  hoveredAttackId: string | null;
  hoveredDatasetId: string | null;

  // Actions
  setStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setModelType: (modelType: ModelType) => void;
  setModel: (model: Model) => void;
  toggleAttack: (id: string) => void;
  toggleCategory: (childIds: string[]) => void;
  setDataSource: (source: 'generate' | 'load') => void;
  setDatasetSubOption: (opt: 'latest' | 'fixed' | null) => void;
  setDatasetIds: (ids: string[]) => void;
  toggleDatasetId: (id: string) => void;
  selectAllDatasets: (ids: string[]) => void;
  clearDatasets: () => void;
  setHoveredModelType: (modelType: ModelType | null) => void;
  setHoveredAttackId: (id: string | null) => void;
  setHoveredDatasetId: (id: string | null) => void;
  reset: () => void;
  canProceedFromStep: (step: number) => boolean;
}

const initialState = {
  currentStep: 1 as const,
  selectedModelId: null,
  selectedModelName: null,
  selectedModelType: null,
  selectedAttackIds: [] as string[],
  dataSource: 'generate' as const,
  datasetSubOption: null,
  selectedDatasetIds: [] as string[],
  hoveredModelType: null,
  hoveredAttackId: null,
  hoveredDatasetId: null,
};

export const useAttackWizardStore = create<AttackWizardState>()((set, get) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 4) as WizardStep,
    })),
  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1) as WizardStep,
    })),

  setModelType: (modelType) => {
    if (!isModelTypeSupported(modelType)) return;
    set((state) => {
      const changed = state.selectedModelType !== modelType;
      return {
        selectedModelType: modelType,
        // modelType 변경 시 세부 모델/공격/데이터셋 모두 비움 — 잔여로 인한 backend validation 실패 방지
        selectedModelId: changed ? null : state.selectedModelId,
        selectedModelName: changed ? null : state.selectedModelName,
        selectedAttackIds: changed ? [] : state.selectedAttackIds,
        selectedDatasetIds: changed ? [] : state.selectedDatasetIds,
        datasetSubOption: changed ? null : state.datasetSubOption,
        hoveredAttackId: null,
        hoveredDatasetId: null,
      };
    });
  },

  setModel: (model) => {
    if (!isModelTypeSupported(model.modelType)) return;
    set({
      selectedModelId: model.id,
      selectedModelName: model.name,
      selectedModelType: model.modelType,
    });
  },

  toggleAttack: (id) => {
    if (!isAttackTypeSupported(id)) return;
    set((state) => ({
      selectedAttackIds: state.selectedAttackIds.includes(id)
        ? state.selectedAttackIds.filter((a) => a !== id)
        : [...state.selectedAttackIds, id],
    }));
  },

  toggleCategory: (childIds) =>
    set((state) => {
      const supportedChildIds = childIds.filter(isAttackTypeSupported);
      if (supportedChildIds.length === 0) return {};

      const allSelected = supportedChildIds.every((id) =>
        state.selectedAttackIds.includes(id)
      );
      if (allSelected) {
        return {
          selectedAttackIds: state.selectedAttackIds.filter(
            (id) => !supportedChildIds.includes(id)
          ),
        };
      }
      return {
        selectedAttackIds: [
          ...new Set([...state.selectedAttackIds, ...supportedChildIds]),
        ],
      };
    }),

  setDataSource: (source) =>
    set({ dataSource: source, datasetSubOption: null, selectedDatasetIds: [] }),
  setDatasetSubOption: (opt) =>
    set({ datasetSubOption: opt, selectedDatasetIds: [] }),
  setDatasetIds: (ids) => set({ selectedDatasetIds: ids }),
  toggleDatasetId: (id) =>
    set((state) => ({
      selectedDatasetIds: state.selectedDatasetIds.includes(id)
        ? state.selectedDatasetIds.filter((d) => d !== id)
        : [...state.selectedDatasetIds, id],
    })),
  selectAllDatasets: (ids) => set({ selectedDatasetIds: ids }),
  clearDatasets: () => set({ selectedDatasetIds: [] }),

  setHoveredModelType: (modelType) => set({ hoveredModelType: modelType }),
  setHoveredAttackId: (id) => set({ hoveredAttackId: id }),
  setHoveredDatasetId: (id) => set({ hoveredDatasetId: id }),

  reset: () => set(initialState),

  canProceedFromStep: (step) => {
    const state = get();
    switch (step) {
      case 1:
        return state.selectedModelType !== null;
      case 2:
        return state.selectedModelId !== null;
      case 3:
        return state.selectedAttackIds.length > 0;
      case 4:
        if (state.dataSource === 'load') {
          return state.selectedDatasetIds.length > 0;
        }
        return true;
      default:
        return false;
    }
  },
}));
