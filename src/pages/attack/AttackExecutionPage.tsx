import { Button, Intent } from '@blueprintjs/core';
import { useAttackWizardStore } from '@/stores/attackWizardStore';
import { useAttackJobStore, isJobRunning } from '@/stores/attackJobStore';
import { useExecuteAttack } from '@/hooks/useAttacks';
import { StepIndicator } from './components/StepIndicator';
import { StepModelSelect } from './components/StepModelSelect';
import { StepAttackSelect } from './components/StepAttackSelect';
import { StepDataSource } from './components/StepDataSource';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { AttackProgressPanel } from './components/AttackProgressPanel';
import { AppToaster } from '@/lib/toaster';

const STEP_TITLES: Record<1 | 2 | 3, string> = {
  1: '테스트할 AI 모델 선택',
  2: '수행할 공격 종류를 선택해주세요',
  3: '공격 데이터 설정',
};

export function AttackExecutionPage() {
  const {
    currentStep,
    nextStep,
    prevStep,
    canProceedFromStep,
    selectedModelId,
    selectedModelName,
    selectedModelType,
    selectedAttackIds,
    dataSource,
    selectedDatasetId,
  } = useAttackWizardStore();

  const activeJob = useAttackJobStore((s) => s.activeJob);
  const startJob = useAttackJobStore((s) => s.startJob);
  const executeAttack = useExecuteAttack();

  const canProceed = canProceedFromStep(currentStep);
  const showProgress = activeJob !== null;

  const handleExecute = async () => {
    if (!selectedModelType || !selectedModelName) return;

    if (activeJob && isJobRunning(activeJob.status)) {
      const toaster = await AppToaster;
      toaster.show({
        message: '이미 진행 중인 공격이 있습니다. 완료 후 다시 시도해주세요.',
        intent: Intent.WARNING,
        icon: 'warning-sign',
      });
      return;
    }

    try {
      const result = await executeAttack.mutateAsync({
        modelType: selectedModelType,
        attackTypeIds: selectedAttackIds,
        dataSource,
        datasetId: dataSource === 'load' ? selectedDatasetId ?? undefined : undefined,
      });
      startJob({
        attackId: result.attackId,
        modelId: selectedModelId,
        modelName: selectedModelName,
        modelType: selectedModelType,
        attackTypeIds: selectedAttackIds,
      });
      const toaster = await AppToaster;
      toaster.show({
        message: '모의 공격이 시작되었습니다.',
        intent: Intent.SUCCESS,
        icon: 'play',
      });
    } catch {
      const toaster = await AppToaster;
      toaster.show({ message: '공격 실행에 실패했습니다.', intent: Intent.DANGER, icon: 'error' });
    }
  };

  return (
    <div className="attack-page-layout">
      {/* 상단 스테이지 바 */}
      <StepIndicator currentStep={currentStep} />

      {/* 2-column: 좌측 위자드 또는 진행 패널 + 우측 캔버스 */}
      <div className="attack-page-content">
        {/* 좌측 패널: 진행 중이면 진행 패널, 아니면 위자드 */}
        <div className="config-panel">
          <div className="config-panel-body">
            {showProgress ? (
              <AttackProgressPanel variant="inline" />
            ) : (
              <>
                <div className="config-panel-header">
                  <h5 className="bp6-heading">{STEP_TITLES[currentStep]}</h5>
                  <div className="config-panel-nav">
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
                        icon="shield"
                        text={executeAttack.isPending ? '준비 중...' : '공격 시작'}
                        intent={Intent.PRIMARY}
                        onClick={handleExecute}
                        disabled={executeAttack.isPending}
                        loading={executeAttack.isPending}
                      />
                    )}
                  </div>
                </div>

                {currentStep === 1 && <StepModelSelect />}
                {currentStep === 2 && <StepAttackSelect />}
                {currentStep === 3 && <StepDataSource />}
              </>
            )}
          </div>
        </div>

        {/* 우측 패널: Workflow 캔버스 */}
        <WorkflowCanvas />
      </div>
    </div>
  );
}
