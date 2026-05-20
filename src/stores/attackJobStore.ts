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

/** terminal 상태(failed/completed/cancelled) activeJob 이 이 시간 이상 지나면 자동 폐기. */
const ACTIVE_JOB_MAX_AGE_MS = 60 * 60 * 1000; // 1시간

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
      // version bump 시 옛 localStorage 자동 폐기. migrate 가 빈 state 반환 → 잔여 activeJob 제거.
      version: 2,
      partialize: (state) => ({
        activeJob: state.activeJob,
        isDockMinimized: state.isDockMinimized,
      }),
      migrate: (persistedState, fromVersion) => {
        // v1 (schema fix / verifier 미반영 시점) → v2: 잔여 activeJob 무조건 초기화.
        // v2 이상은 그대로 hydrate.
        if (fromVersion < 2) {
          return { activeJob: null, isDockMinimized: false };
        }
        return persistedState as { activeJob: ActiveAttackJob | null; isDockMinimized: boolean };
      },
      onRehydrateStorage: () => (state) => {
        // hydration 직후 안전망: terminal status(failed/completed/cancelled) 이고 1시간 이상
        // 지난 activeJob 은 자동 clear. running 상태는 보존.
        if (!state?.activeJob) return;
        const { status, startedAt } = state.activeJob;
        const isTerminal =
          status === 'failed' || status === 'completed' || status === 'cancelled';
        const isStale = Date.now() - startedAt > ACTIVE_JOB_MAX_AGE_MS;
        if (isTerminal && isStale) {
          state.activeJob = null;
          state.isDockMinimized = false;
        }
      },
    }
  )
);

export const isJobRunning = (status: AttackProgress['status'] | undefined) =>
  status === 'preparing' || status === 'running' || status === 'saving';
