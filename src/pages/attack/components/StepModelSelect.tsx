import { useAttackWizardStore } from '@/stores/attackWizardStore';
import { useModels } from '@/hooks/useModels';
import { Icon, type IconName } from '@blueprintjs/core';
import type { ModelType } from '@/types';
import { cn } from '@/lib/utils';

const MODEL_ICONS: Record<string, string> = {
  cctv: 'camera',
  voice: 'headset',
  autonomous: 'drive-time',
};

export function StepModelSelect() {
  const { selectedModelType, setModelType } = useAttackWizardStore();
  const { data: models, isLoading, isError } = useModels();

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <h5 className="bp6-heading" style={{ marginBottom: 16 }}>테스트할 AI 모델 선택</h5>
        <div className="bp6-skeleton" style={{ height: 180 }} />
      </div>
    );
  }

  if (isError || !models) {
    return (
      <div className="animate-fade-in">
        <h5 className="bp6-heading" style={{ marginBottom: 16 }}>테스트할 AI 모델 선택</h5>
        <p className="bp6-text-muted">모델 목록을 불러오는데 실패했습니다.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h5 className="bp6-heading" style={{ marginBottom: 16 }}>테스트할 AI 모델 선택</h5>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {models.map((model) => {
          const isSelected = selectedModelType === model.modelType;
          const icon = MODEL_ICONS[model.modelType] || 'desktop';
          return (
            <div
              key={model.id}
              className={cn('config-select-item', isSelected && 'selected')}
              onClick={() => setModelType(model.modelType as ModelType)}
            >
              <Icon icon={icon as IconName} size={24} color={isSelected ? '#2D72D2' : '#5F6B7C'} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{model.name}</div>
                <div style={{ fontSize: 13, color: 'var(--bp-text-secondary)' }}>{model.type}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
