import { useMemo } from 'react';
import { useAttackWizardStore } from '@/stores/attackWizardStore';
import { useModels } from '@/hooks/useModels';
import { Icon, Tag, type IconName } from '@blueprintjs/core';
import { cn } from '@/lib/utils';
import { isModelTypeSupported } from '@/lib/constants';

const MODEL_ICONS: Record<string, string> = {
  cctv: 'camera',
  voice: 'headset',
  autonomous: 'drive-time',
  classification: 'predictive-analysis',
};

/**
 * Stage 2 — 선택된 modelType 안의 세부 모델 카드.
 * `selectedModelType` 으로 `useModels()` 응답을 필터링하여 표시.
 * 모델 수가 1개여도 단일 카드 그대로 표시 (사용자 명시 클릭).
 */
export function StepModelSelect() {
  const { selectedModelType, selectedModelId, setModel, setHoveredModelType } =
    useAttackWizardStore();
  const { data: allModels, isLoading, isError } = useModels();

  const models = useMemo(
    () =>
      (allModels ?? []).filter((m) => m.modelType === selectedModelType),
    [allModels, selectedModelType],
  );

  if (!selectedModelType) {
    return (
      <div className="animate-fade-in">
        <p className="bp6-text-muted">먼저 모델 종류를 선택해주세요.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="bp6-skeleton" style={{ height: 180 }} />
      </div>
    );
  }

  if (isError || !allModels) {
    return (
      <div className="animate-fade-in">
        <p className="bp6-text-muted">모델 목록을 불러오는데 실패했습니다.</p>
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="animate-fade-in">
        <p className="bp6-text-muted">선택된 종류에 사용 가능한 모델이 없습니다.</p>
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
              onMouseEnter={() => isSupported && setHoveredModelType(model.modelType)}
              onMouseLeave={() => setHoveredModelType(null)}
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
