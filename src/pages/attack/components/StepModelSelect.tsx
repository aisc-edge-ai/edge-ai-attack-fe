import { Camera, Mic, CarFront } from 'lucide-react';
import { useAttackWizardStore } from '@/stores/attackWizardStore';
import { ModelCard } from './ModelCard';
import type { ModelType } from '@/types';

const modelOptions: { type: ModelType; icon: React.ReactNode; title: string; subtitle: string }[] = [
  { type: 'cctv', icon: <Camera size={40} />, title: 'CCTV', subtitle: '(객체 탐지 모델)' },
  { type: 'voice', icon: <Mic size={40} />, title: 'AI 비서', subtitle: '(음성 인식 모델)' },
  { type: 'autonomous', icon: <CarFront size={40} />, title: '자율주행', subtitle: '(이미지 분류 모델)' },
];

export function StepModelSelect() {
  const { selectedModelType, setModelType } = useAttackWizardStore();

  return (
    <div className="animate-[fadeIn_0.3s_ease-out_forwards]">
      <h3 className="text-2xl font-bold mb-8 text-center text-foreground">
        테스트할 AI 모델을 선택해주세요
      </h3>
      <div className="flex justify-center space-x-6">
        {modelOptions.map((option) => (
          <ModelCard
            key={option.type}
            icon={option.icon}
            title={option.title}
            subtitle={option.subtitle}
            selected={selectedModelType === option.type}
            onClick={() => setModelType(option.type)}
          />
        ))}
      </div>
    </div>
  );
}
