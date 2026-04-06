import { ChevronRight } from 'lucide-react';
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
    <div className="border border-border rounded-lg p-3 mb-6 flex space-x-6 text-sm font-medium bg-muted">
      {steps.map((step, index) => (
        <span
          key={step.number}
          className={cn(
            'flex items-center',
            currentStep >= step.number
              ? 'text-primary font-bold'
              : 'text-muted-foreground'
          )}
        >
          {step.number}. {step.label}
          {index < steps.length - 1 && (
            <ChevronRight size={16} className="ml-2" />
          )}
        </span>
      ))}
    </div>
  );
}
