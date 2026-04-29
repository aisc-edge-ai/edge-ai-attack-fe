import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AttackProgress, ModelType } from '@/types';

export interface ActiveAttackJob {
  attackId: string;
  startedAt: number;
  modelId: string | null;
  modelName: string;
  modelType: ModelType;
  attackTypeIds: string[];
  progress: AttackProgress | null;
  status: AttackProgress['status'];
}

interface AttackJobState {
  activeJob: ActiveAttackJob | null;
  isDockMinimized: boolean;

  startJob: (
    job: Omit<ActiveAttackJob, 'progress' | 'status' | 'startedAt'>
  ) => void;
  setProgress: (p: AttackProgress) => void;
  clearJob: () => void;
  setDockMinimized: (minimized: boolean) => void;
}

export const useAttackJobStore = create<AttackJobState>()(
  persist(
    (set) => ({
      activeJob: null,
      isDockMinimized: false,

      startJob: (job) =>
        set({
          activeJob: {
            ...job,
            progress: null,
            status: 'preparing',
            startedAt: Date.now(),
          },
          isDockMinimized: false,
        }),

      setProgress: (p) =>
        set((state) =>
          state.activeJob && state.activeJob.attackId === p.attackId
            ? {
                activeJob: { ...state.activeJob, progress: p, status: p.status },
              }
            : {}
        ),

      clearJob: () => set({ activeJob: null, isDockMinimized: false }),

      setDockMinimized: (minimized) => set({ isDockMinimized: minimized }),
    }),
    {
      name: 'attack-job-storage',
      partialize: (state) => ({
        activeJob: state.activeJob,
        isDockMinimized: state.isDockMinimized,
      }),
    }
  )
);

export const isJobRunning = (status: AttackProgress['status'] | undefined) =>
  status === 'preparing' || status === 'running' || status === 'saving';
