import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Elevation, Button, Icon } from '@blueprintjs/core';
import { useAttackJobStore, isJobRunning } from '@/stores/attackJobStore';
import { AttackProgressPanel } from '@/pages/attack/components/AttackProgressPanel';

export function AttackProgressDock() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeJob = useAttackJobStore((s) => s.activeJob);
  const minimized = useAttackJobStore((s) => s.isDockMinimized);
  const setMinimized = useAttackJobStore((s) => s.setDockMinimized);

  // 모의 공격 페이지에서는 인라인 패널과 중복되므로 dock 숨김
  if (!activeJob) return null;
  if (location.pathname === '/attack') return null;

  const { progress, status, modelName } = activeJob;
  const running = isJobRunning(status);
  const progressPercent = progress
    ? Math.round((progress.progress / progress.total) * 100)
    : 0;

  if (minimized) {
    const ringColor = running
      ? 'var(--bp-primary)'
      : status === 'completed'
        ? 'var(--bp-success)'
        : status === 'cancelled'
          ? 'var(--bp-warning)'
          : 'var(--bp-danger)';
    return (
      <button
        type="button"
        className="attack-progress-dock-mini"
        style={
          {
            '--dock-ring-deg': `${progressPercent * 3.6}deg`,
            '--dock-ring-color': ringColor,
          } as React.CSSProperties
        }
        onClick={() => setMinimized(false)}
        aria-label="공격 진행 패널 펼치기"
      >
        <span className="attack-progress-dock-mini-ring" />
        <Icon
          icon={
            status === 'completed'
              ? 'tick-circle'
              : status === 'cancelled'
                ? 'disable'
                : status === 'failed'
                  ? 'error'
                  : 'shield'
          }
          size={20}
        />
        <span className="attack-progress-dock-mini-pct">{progressPercent}%</span>
      </button>
    );
  }

  return (
    <Card elevation={Elevation.FOUR} className="attack-progress-dock">
      <div className="attack-progress-dock-toolbar">
        <span className="bp6-text-muted attack-progress-dock-hint">
          {running ? '진행 중인 공격' : '공격 결과'} · {modelName}
        </span>
        <div className="attack-progress-dock-toolbar-actions">
          {running && (
            <Button
              minimal
              small
              icon="arrow-right"
              text="공격 페이지"
              onClick={() => navigate('/attack')}
            />
          )}
          <Button
            minimal
            small
            icon="minimize"
            onClick={() => setMinimized(true)}
            aria-label="최소화"
          />
        </div>
      </div>
      <AttackProgressPanel variant="dock" />
    </Card>
  );
}
