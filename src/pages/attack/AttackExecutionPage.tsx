import { useState } from 'react';
import { Button, Intent, Icon } from '@blueprintjs/core';
import { useAttackWizardStore } from '@/stores/attackWizardStore';
import { useExecuteAttack } from '@/hooks/useAttacks';
import { StepIndicator } from './components/StepIndicator';
import { StepModelSelect } from './components/StepModelSelect';
import { StepAttackSelect } from './components/StepAttackSelect';
import { StepDataSource } from './components/StepDataSource';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { AttackProgressModal } from './components/AttackProgressModal';
import { AppToaster } from '@/lib/toaster';

export function AttackExecutionPage() {
  const {
    currentStep,
    nextStep,
    prevStep,
    canProceedFromStep,
    selectedModelType,
    selectedAttackIds,
    dataSource,
    selectedDatasetId,
  } = useAttackWizardStore();

  const executeAttack = useExecuteAttack();
  const [attackId, setAttackId] = useState<string | null>(null);
  const [showProgress, setShowProgress] = useState(false);

  const canProceed = canProceedFromStep(currentStep);

  const handleExecute = async () => {
    if (!selectedModelType) return;

    try {
      const result = await executeAttack.mutateAsync({
        modelType: selectedModelType,
        attackTypeIds: selectedAttackIds,
        dataSource,
        datasetId: dataSource === 'load' ? selectedDatasetId ?? undefined : undefined,
      });
      setAttackId(result.attackId);
      setShowProgress(true);
    } catch {
      const toaster = await AppToaster;
      toaster.show({ message: '공격 실행에 실패했습니다.', intent: Intent.DANGER, icon: 'error' });
    }
  };

  return (
    <div className="attack-page-layout">
      {/* 상단 스테이지 바 */}
      <StepIndicator currentStep={currentStep} />

      {/* 2-column: 좌측 위자드 + 우측 캔버스 */}
      <div className="attack-page-content">
        {/* 좌측 패널: 3단계 순차 선택 */}
        <div className="config-panel">
          <div className="config-panel-body">
            {currentStep === 1 && <StepModelSelect />}
            {currentStep === 2 && <StepAttackSelect />}
            {currentStep === 3 && <StepDataSource />}
          </div>

          {/* 하단 네비게이션 */}
          <div className="config-panel-footer">
            {currentStep > 1 ? (
              <Button text="이전" icon="chevron-left" onClick={prevStep} />
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <Button
                text="다음"
                rightIcon="chevron-right"
                intent={Intent.PRIMARY}
                onClick={nextStep}
                disabled={!canProceed}
              />
            ) : (
              <Button
                intent={Intent.PRIMARY}
                onClick={handleExecute}
                disabled={executeAttack.isPending}
              >
                <Icon icon="shield" />
                {executeAttack.isPending ? '준비 중...' : '공격 시작'}
              </Button>
            )}
          </div>
        </div>

        {/* 우측 패널: Workflow 캔버스 */}
        <WorkflowCanvas />
      </div>

      <AttackProgressModal
        open={showProgress}
        onClose={() => { setShowProgress(false); setAttackId(null); }}
        attackId={attackId}
      />
    </div>
  );
}
