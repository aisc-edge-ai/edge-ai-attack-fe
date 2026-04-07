import { Icon } from '@blueprintjs/core';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: '모델 종류 선택' },
  { number: 2, label: '공격 종류 선택' },
  { number: 3, label: '데이터 소스 및 실행' },
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="step-indicator-bar" role="navigation" aria-label="공격 수행 단계">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.number;
        const isActive = currentStep === step.number;

        return (
          <div key={step.number} style={{ display: 'contents' }}>
            <div className={cn('step-item', isActive && 'active')} aria-current={isActive ? 'step' : undefined}>
              <span className={cn('step-number', isCompleted ? 'completed' : isActive ? 'active' : '')}>
                {isCompleted ? <Icon icon="saved" size={12} /> : `STAGE 0${step.number}`}
              </span>
              <span className="step-label">
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <Icon icon="chevron-right" className="step-line" size={12} />
            )}
          </div>
        );
      })}
    </div>
  );
}
