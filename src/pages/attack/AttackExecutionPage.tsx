import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAttackWizardStore } from '@/stores/attackWizardStore';
import { useExecuteAttack } from '@/hooks/useAttacks';
import { StepIndicator } from './components/StepIndicator';
import { StepModelSelect } from './components/StepModelSelect';
import { StepAttackSelect } from './components/StepAttackSelect';
import { StepDataSource } from './components/StepDataSource';
import { AttackProgressModal } from './components/AttackProgressModal';
import { toast } from 'sonner';

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
      toast.error('공격 실행에 실패했습니다.');
    }
  };

  const handleCloseProgress = () => {
    setShowProgress(false);
    setAttackId(null);
  };

  return (
    <div className="h-full flex flex-col">
      <StepIndicator currentStep={currentStep} />

      <div className="flex-1 flex flex-col items-center pt-8 overflow-y-auto w-full">
        <div className="w-full max-w-4xl">
          {currentStep === 1 && <StepModelSelect />}
          {currentStep === 2 && <StepAttackSelect />}
          {currentStep === 3 && <StepDataSource />}
        </div>
      </div>

      <div className="mt-auto border-t border-border pt-6 pb-2 w-full">
        <div className="max-w-4xl mx-auto flex justify-between items-center px-4">
          <div>
            {currentStep > 1 ? (
              <Button variant="outline" onClick={prevStep} size="lg">
                이전 단계
              </Button>
            ) : (
              <div className="w-24" />
            )}
          </div>

          <div>
            {currentStep < 3 ? (
              <Button onClick={nextStep} disabled={!canProceed} size="lg">
                다음 단계
              </Button>
            ) : (
              <Button
                onClick={handleExecute}
                disabled={executeAttack.isPending}
                size="lg"
              >
                <ShieldAlert size={20} className="mr-2" />
                {executeAttack.isPending
                  ? '실행 준비 중...'
                  : '모의 공격 수행 시작'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <AttackProgressModal
        open={showProgress}
        onClose={handleCloseProgress}
        attackId={attackId}
      />
    </div>
  );
}
