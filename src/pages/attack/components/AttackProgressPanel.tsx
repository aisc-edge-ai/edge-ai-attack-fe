import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  ProgressBar,
  InputGroup,
  Intent,
  Icon,
  Tag,
} from '@blueprintjs/core';
import { useAttackJobStore, isJobRunning } from '@/stores/attackJobStore';
import { useSaveAttackData } from '@/hooks/useDatasets';
import { useCancelAttack } from '@/hooks/useAttacks';
import { useAttackWizardStore } from '@/stores/attackWizardStore';
import { AppToaster } from '@/lib/toaster';

interface AttackProgressPanelProps {
  variant?: 'inline' | 'dock';
  onRequestClose?: () => void;
}

function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const hh = Math.floor(totalSec / 3600);
  const mm = Math.floor((totalSec % 3600) / 60);
  const ss = totalSec % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return hh > 0 ? `${hh}:${pad(mm)}:${pad(ss)}` : `${pad(mm)}:${pad(ss)}`;
}

export function AttackProgressPanel({
  variant = 'inline',
  onRequestClose,
}: AttackProgressPanelProps) {
  const navigate = useNavigate();
  const activeJob = useAttackJobStore((s) => s.activeJob);
  const clearJob = useAttackJobStore((s) => s.clearJob);
  const resetWizard = useAttackWizardStore((s) => s.reset);
  const saveAttackData = useSaveAttackData();
  const cancelAttack = useCancelAttack();
  const [datasetName, setDatasetName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const running = activeJob ? isJobRunning(activeJob.status) : false;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [running]);

  if (!activeJob) return null;

  const { attackId, progress, status, modelName, attackTypeIds, startedAt } = activeJob;
  const isCompleted = status === 'completed';
  const isFailed = status === 'failed';
  const isCancelled = status === 'cancelled';
  const isTerminal = isCompleted || isFailed || isCancelled;
  const progressValue = progress ? progress.progress / progress.total : 0;
  const progressPercent = Math.round(progressValue * 100);
  const cancelInFlight = cancelAttack.isPending;
  const elapsedText = formatElapsed(Math.max(0, now - startedAt));

  const handleSave = async () => {
    if (!datasetName.trim()) return;
    try {
      await saveAttackData.mutateAsync({ attackId, name: datasetName.trim() });
      const toaster = await AppToaster;
      toaster.show({
        message: '공격 데이터가 저장되었습니다.',
        intent: Intent.SUCCESS,
        icon: 'tick',
      });
      setShowSaveForm(false);
      setDatasetName('');
    } catch {
      const toaster = await AppToaster;
      toaster.show({
        message: '데이터 저장에 실패했습니다.',
        intent: Intent.DANGER,
        icon: 'error',
      });
    }
  };

  const handleViewResults = () => {
    clearJob();
    onRequestClose?.();
    navigate(`/results/${attackId}`);
  };

  const handleNewAttack = () => {
    resetWizard();
    clearJob();
    onRequestClose?.();
  };

  const handleCancelConfirm = async () => {
    setShowCancelConfirm(false);
    try {
      await cancelAttack.mutateAsync(attackId);
    } catch {
      // useCancelAttack onError가 토스트 표시
    }
  };

  const headerIcon = isCompleted
    ? 'tick-circle'
    : isCancelled
      ? 'disable'
      : isFailed
        ? 'error'
        : 'shield';
  const headerIntent: Intent = isCompleted
    ? Intent.SUCCESS
    : isCancelled
      ? Intent.WARNING
      : isFailed
        ? Intent.DANGER
        : Intent.PRIMARY;
  const headerText = isCompleted
    ? '모의 공격 완료'
    : isCancelled
      ? '모의 공격 취소됨'
      : isFailed
        ? '공격 실행 실패'
        : '모의 공격 진행 중...';

  return (
    <div className={`attack-progress-panel attack-progress-panel--${variant}`}>
      <div className={`attack-progress-panel-header intent-${headerIntent}`}>
        <Icon icon={headerIcon} intent={headerIntent} />
        <span className="attack-progress-panel-title">{headerText}</span>
        {variant === 'dock' && isTerminal && (
          <Button
            minimal
            small
            icon="cross"
            onClick={() => {
              clearJob();
              onRequestClose?.();
            }}
            aria-label="닫기"
          />
        )}
      </div>

      <div className="attack-progress-panel-meta">
        <Tag minimal icon="cube">
          {modelName}
        </Tag>
        <Tag minimal icon="shield">
          공격 {attackTypeIds.length}건
        </Tag>
      </div>

      <div className="attack-progress-panel-body">
        <div className="attack-progress-panel-row">
          <span className="bp6-text-muted" aria-live="polite">
            {cancelInFlight && running
              ? '취소 요청 중...'
              : progress?.currentStep || '준비 중...'}
          </span>
          <strong>{progressPercent}%</strong>
        </div>
        <ProgressBar
          value={progressValue}
          intent={headerIntent}
          stripes={running}
          animate={running}
        />

        {running && (
          <div className="attack-progress-panel-row attack-progress-panel-sub">
            <span>공격 진행 시간: {elapsedText}</span>
            {progress?.eta !== undefined && progress.eta > 0 && (
              <span>예상 잔여: {progress.eta}초</span>
            )}
          </div>
        )}
      </div>

      {running && (
        <div className="attack-progress-panel-footer">
          <Button
            icon="disable"
            text="공격 취소"
            intent={Intent.DANGER}
            minimal
            onClick={() => setShowCancelConfirm(true)}
            disabled={cancelInFlight}
            loading={cancelInFlight}
            small={variant === 'dock'}
          />
        </div>
      )}

      {isTerminal && (
        <div className="attack-progress-panel-footer">
          {isCompleted ? (
            <>
              {!showSaveForm ? (
                <Button
                  icon="floppy-disk"
                  text="공격 데이터 저장"
                  onClick={() => setShowSaveForm(true)}
                  small={variant === 'dock'}
                />
              ) : (
                <div className="attack-progress-panel-save-form">
                  <InputGroup
                    placeholder="데이터셋 이름"
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                    small
                  />
                  <Button
                    text="저장"
                    intent={Intent.PRIMARY}
                    small
                    onClick={handleSave}
                    disabled={!datasetName.trim() || saveAttackData.isPending}
                    loading={saveAttackData.isPending}
                  />
                </div>
              )}
              <Button
                icon="arrow-right"
                text="결과 분석 보기"
                intent={Intent.PRIMARY}
                onClick={handleViewResults}
                small={variant === 'dock'}
              />
              <Button
                icon="refresh"
                text="새 공격 시작"
                minimal
                onClick={handleNewAttack}
                small={variant === 'dock'}
              />
            </>
          ) : (
            <Button
              icon="refresh"
              text="다시 시도"
              onClick={handleNewAttack}
              small={variant === 'dock'}
            />
          )}
        </div>
      )}

      <Alert
        isOpen={showCancelConfirm}
        intent={Intent.DANGER}
        icon="disable"
        confirmButtonText="공격 취소"
        cancelButtonText="계속 진행"
        onCancel={() => setShowCancelConfirm(false)}
        onConfirm={handleCancelConfirm}
      >
        <p>
          진행 중인 공격을 취소하면 ML 프로세스가 즉시 종료되고 결과가 저장되지
          않습니다. 정말 취소하시겠습니까?
        </p>
      </Alert>
    </div>
  );
}
