import { useAttackWizardStore } from '@/stores/attackWizardStore';
import { useModels } from '@/hooks/useModels';
import { Icon, Tag, type IconName } from '@blueprintjs/core';
import { cn } from '@/lib/utils';
import { isModelTypeSupported } from '@/lib/constants';

const MODEL_ICONS: Record<string, string> = {
  cctv: 'camera',
  voice: 'headset',
  autonomous: 'drive-time',
};

export function StepModelSelect() {
  const { selectedModelId, setModel } = useAttackWizardStore();
  const { data: models, isLoading, isError } = useModels();

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="bp6-skeleton" style={{ height: 180 }} />
      </div>
    );
  }

  if (isError || !models) {
    return (
      <div className="animate-fade-in">
        <p className="bp6-text-muted">모델 목록을 불러오는데 실패했습니다.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {models.map((model) => {
          const isSelected = selectedModelId === model.id;
          const icon = MODEL_ICONS[model.modelType] || 'desktop';
          const isSupported = isModelTypeSupported(model.modelType);
          return (
            <div
              key={model.id}
              className={cn('config-select-item', isSelected && 'selected', !isSupported && 'disabled')}
              onClick={() => {
                if (!isSupported) return;
                setModel(model);
              }}
              style={!isSupported ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
              aria-disabled={!isSupported}
            >
              <Icon icon={icon as IconName} size={24} color={isSelected ? '#2D72D2' : '#5F6B7C'} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {model.name}
                  {!isSupported && (
                    <Tag intent="warning" minimal>준비 중</Tag>
                  )}
                </div>
                <div style={{ fontSize: 13, color: 'var(--bp-text-secondary)' }}>{model.type}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
