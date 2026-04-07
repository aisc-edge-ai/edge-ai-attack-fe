import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  ProgressBar,
  InputGroup,
  Intent,
} from '@blueprintjs/core';
import { useAttackProgress } from '@/hooks/useAttackProgress';
import { useSaveAttackData } from '@/hooks/useDatasets';
import { useAttackWizardStore } from '@/stores/attackWizardStore';
import { AppToaster } from '@/lib/toaster';

interface AttackProgressModalProps {
  open: boolean;
  onClose: () => void;
  attackId: string | null;
}

export function AttackProgressModal({ open, onClose, attackId }: AttackProgressModalProps) {
  const navigate = useNavigate();
  const reset = useAttackWizardStore((s) => s.reset);
  const { progress } = useAttackProgress(open ? attackId : null);
  const saveAttackData = useSaveAttackData();
  const [datasetName, setDatasetName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  const isCompleted = progress?.status === 'completed';
  const isFailed = progress?.status === 'failed';
  const progressValue = progress ? progress.progress / progress.total : 0;
  const progressPercent = Math.round(progressValue * 100);

  const handleSave = async () => {
    if (!attackId || !datasetName.trim()) return;
    try {
      await saveAttackData.mutateAsync({ attackId, name: datasetName.trim() });
      const toaster = await AppToaster;
      toaster.show({ message: '공격 데이터가 저장되었습니다.', intent: Intent.SUCCESS, icon: 'tick' });
      setShowSaveForm(false);
    } catch {
      const toaster = await AppToaster;
      toaster.show({ message: '데이터 저장에 실패했습니다.', intent: Intent.DANGER, icon: 'error' });
    }
  };

  const handleViewResults = () => {
    onClose();
    if (attackId) navigate(`/results/${attackId}`);
  };

  const handleNewAttack = () => {
    reset();
    onClose();
  };

  const titleIcon = isCompleted ? 'tick-circle' : isFailed ? 'error' : 'shield';
  const titleText = isCompleted ? '모의 공격 완료' : isFailed ? '공격 실행 실패' : '모의 공격 진행 중...';

  return (
    <Dialog
      isOpen={open}
      onClose={() => {}}
      title={titleText}
      icon={titleIcon}
      canEscapeKeyClose={isCompleted || isFailed}
      canOutsideClickClose={false}
      style={{ width: 480 }}
    >
      <DialogBody>
        {/* 진행률 */}
        <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span className="bp6-text-muted">{progress?.currentStep || '준비 중...'}</span>
          <strong>{progressPercent}%</strong>
        </div>
        <ProgressBar
          value={progressValue}
          intent={isCompleted ? Intent.SUCCESS : isFailed ? Intent.DANGER : Intent.PRIMARY}
          stripes={!isCompleted && !isFailed}
          animate={!isCompleted && !isFailed}
        />

        {/* 부가 정보 */}
        {progress && !isCompleted && !isFailed && (
          <div className="bp6-text-muted" style={{ fontSize: 12, marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
            <span>진행률: {progress.progress}/{progress.total}</span>
            {progress.eta !== undefined && progress.eta > 0 && <span>예상 잔여: {progress.eta}초</span>}
          </div>
        )}
      </DialogBody>

      {(isCompleted || isFailed) && (
        <DialogFooter
          actions={
            isCompleted ? (
              <>
                {!showSaveForm ? (
                  <Button icon="floppy-disk" text="공격 데이터 저장" onClick={() => setShowSaveForm(true)} />
                ) : (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
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
                    />
                  </div>
                )}
                <Button icon="arrow-right" text="결과 분석 보기" intent={Intent.PRIMARY} onClick={handleViewResults} />
                <Button icon="refresh" text="새 공격 시작" minimal onClick={handleNewAttack} />
              </>
            ) : (
              <Button icon="refresh" text="다시 시도" onClick={handleNewAttack} />
            )
          }
        />
      )}
    </Dialog>
  );
}
