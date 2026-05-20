import { useMemo } from 'react';
import { Icon, Tag, type IconName } from '@blueprintjs/core';
import { useAttackWizardStore } from '@/stores/attackWizardStore';
import { useModels } from '@/hooks/useModels';
import { cn } from '@/lib/utils';
import { isModelTypeSupported } from '@/lib/constants';
import type { ModelType } from '@/types';

/**
 * Stage 1 — 모델 종류(modelType) 카드.
 * 백엔드 `/models` 응답에 존재하는 modelType 만 노출. supported = false 면
 * "준비 중" 태그 + 클릭 비활성. modelType 별 한국어 라벨/아이콘/부제는
 * MODEL_TYPE_META 한 곳에서 관리.
 */
const MODEL_TYPE_META: Record<
  ModelType,
  { label: string; sub: string; icon: IconName }
> = {
  cctv: { label: '객체 탐지', sub: 'CCTV / 영상 객체 인식', icon: 'camera' },
  classification: {
    label: '이미지 분류',
    sub: 'CIFAR-10 / ImageNet 기반 분류 모델',
    icon: 'predictive-analysis',
  },
  voice: { label: '음성 인식', sub: '화자 인증 모델', icon: 'headset' },
  autonomous: { label: '자율주행', sub: '자율주행 객체 인식', icon: 'drive-time' },
  imagenet: {
    label: 'ImageNet 분류',
    sub: '적대적 공격 (Inception-ResNet-v2)',
    icon: 'predictive-analysis',
  },
};

const TYPE_ORDER: ModelType[] = ['cctv', 'classification', 'voice', 'autonomous'];

export function StepModelTypeSelect() {
  const { selectedModelType, setModelType, setHoveredModelType } = useAttackWizardStore();
  const { data: models, isLoading, isError } = useModels();

  // 백엔드 응답에 존재하는 modelType 만 카드로 노출. TYPE_ORDER 로 정렬.
  // imagenet 모델이 있으면 classification 카드로 통합 노출 (Step 2 에서 세부 모델 선택).
  const availableTypes = useMemo(() => {
    const set = new Set<ModelType>((models ?? []).map((m) => m.modelType));
    if (set.has('imagenet')) set.add('classification');
    return TYPE_ORDER.filter((t) => set.has(t));
  }, [models]);

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="bp6-skeleton" style={{ height: 180 }} />
      </div>
    );
  }

  if (isError || availableTypes.length === 0) {
    return (
      <div className="animate-fade-in">
        <p className="bp6-text-muted">사용 가능한 모델 종류가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {availableTypes.map((mt) => {
          const meta = MODEL_TYPE_META[mt];
          const supported = isModelTypeSupported(mt);
          const selected =
            mt === 'classification'
              ? selectedModelType === 'classification' || selectedModelType === 'imagenet'
              : selectedModelType === mt;
          return (
            <div
              key={mt}
              className={cn(
                'config-select-item',
                selected && 'selected',
                !supported && 'disabled',
              )}
              onClick={() => {
                if (!supported) return;
                setModelType(mt);
              }}
              onMouseEnter={() => supported && setHoveredModelType(mt)}
              onMouseLeave={() => setHoveredModelType(null)}
              style={!supported ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
              aria-disabled={!supported}
            >
              <Icon icon={meta.icon} size={28} color={selected ? '#2D72D2' : '#5F6B7C'} />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 15,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {meta.label}
                  {!supported && (
                    <Tag intent="warning" minimal>
                      준비 중
                    </Tag>
                  )}
                </div>
                <div style={{ fontSize: 13, color: 'var(--bp-text-secondary)' }}>
                  {meta.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
