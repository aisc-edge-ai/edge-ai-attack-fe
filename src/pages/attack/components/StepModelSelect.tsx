import { useAttackWizardStore } from '@/stores/attackWizardStore';
import { Icon, type IconName } from '@blueprintjs/core';
import type { ModelType } from '@/types';
import { cn } from '@/lib/utils';

const modelOptions: { type: ModelType; icon: string; title: string; subtitle: string }[] = [
  { type: 'cctv', icon: 'camera', title: 'CCTV', subtitle: '객체 탐지 모델' },
  { type: 'voice', icon: 'headset', title: 'AI 비서', subtitle: '음성 인식 모델' },
  { type: 'autonomous', icon: 'drive-time', title: '자율주행', subtitle: '이미지 분류 모델' },
];

export function StepModelSelect() {
  const { selectedModelType, setModelType } = useAttackWizardStore();

  return (
    <div className="animate-fade-in">
      <h5 className="bp6-heading" style={{ marginBottom: 16 }}>테스트할 AI 모델 선택</h5>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {modelOptions.map((opt) => {
          const isSelected = selectedModelType === opt.type;
          return (
            <div
              key={opt.type}
              className={cn('config-select-item', isSelected && 'selected')}
              onClick={() => setModelType(opt.type)}
            >
              <Icon icon={opt.icon as IconName} size={24} color={isSelected ? '#2D72D2' : '#5F6B7C'} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{opt.title}</div>
                <div style={{ fontSize: 13, color: 'var(--bp-text-secondary)' }}>{opt.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
