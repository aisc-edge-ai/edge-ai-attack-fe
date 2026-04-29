import { useEffect, useRef } from 'react';
import { Intent } from '@blueprintjs/core';
import { useAttackJobStore } from '@/stores/attackJobStore';
import { useAttackProgress } from '@/hooks/useAttackProgress';
import { AppToaster } from '@/lib/toaster';

export function AttackProgressWatcher() {
  const attackId = useAttackJobStore((s) => s.activeJob?.attackId ?? null);
  const setProgress = useAttackJobStore((s) => s.setProgress);
  const { progress } = useAttackProgress(attackId);
  const completionToastedRef = useRef<string | null>(null);

  useEffect(() => {
    if (progress) setProgress(progress);
  }, [progress, setProgress]);

  useEffect(() => {
    if (!progress || !attackId) return;
    if (
      progress.status !== 'completed' &&
      progress.status !== 'failed' &&
      progress.status !== 'cancelled'
    )
      return;
    if (completionToastedRef.current === attackId) return;
    completionToastedRef.current = attackId;

    void (async () => {
      const toaster = await AppToaster;
      if (progress.status === 'completed') {
        toaster.show({
          message: '모의 공격이 완료되었습니다.',
          intent: Intent.SUCCESS,
          icon: 'tick-circle',
        });
      } else if (progress.status === 'cancelled') {
        toaster.show({
          message: '모의 공격이 취소되었습니다.',
          intent: Intent.WARNING,
          icon: 'disable',
        });
      } else {
        toaster.show({
          message: '모의 공격이 실패했습니다.',
          intent: Intent.DANGER,
          icon: 'error',
        });
      }
    })();
  }, [progress, attackId]);

  useEffect(() => {
    if (!attackId) completionToastedRef.current = null;
  }, [attackId]);

  return null;
}
