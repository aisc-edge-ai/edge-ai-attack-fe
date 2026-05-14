import { useAttackWizardStore } from '@/stores/attackWizardStore';
import { useAttackJobStore, isJobRunning } from '@/stores/attackJobStore';
import {
  CctvGraphic,
  ClassificationGraphic,
  DefaultGraphic,
  VoiceGraphic,
  type AttackGraphicProps,
  type AttackGraphicState,
} from './graphics';
import type { ModelType } from '@/types';

/**
 * 모의 공격 페이지 우측 캔버스 — 향후 영상 생성형 AI 결과로 교체 예정.
 *
 * 표시 우선순위:
 *  - 공격 진행 중 → running 상태 (강한 pulse)
 *  - hover (modelType / attackId) → preview 상태
 *  - selected (selectedModelType / selectedAttackIds[0]) → selected 상태
 *  - 그 외 → idle (DefaultGraphic placeholder)
 */
export function AttackGraphicCanvas() {
  const selectedModelType = useAttackWizardStore((s) => s.selectedModelType);
  const selectedAttackIds = useAttackWizardStore((s) => s.selectedAttackIds);
  const hoveredModelType = useAttackWizardStore((s) => s.hoveredModelType);
  const hoveredAttackId = useAttackWizardStore((s) => s.hoveredAttackId);
  const isRunning = useAttackJobStore((s) => isJobRunning(s.activeJob?.status));

  const effectiveModelType = hoveredModelType ?? selectedModelType;
  const effectiveAttackId = hoveredAttackId ?? selectedAttackIds[0] ?? null;

  let state: AttackGraphicState;
  if (isRunning) {
    state = 'running';
  } else if (hoveredModelType || hoveredAttackId) {
    state = 'preview';
  } else if (selectedModelType) {
    state = 'selected';
  } else {
    state = 'idle';
  }

  return (
    <div className="attack-graphic-canvas">
      {renderGraphic(effectiveModelType, { state, attackId: effectiveAttackId })}
    </div>
  );
}

function renderGraphic(
  modelType: ModelType | null,
  props: AttackGraphicProps,
) {
  switch (modelType) {
    case 'cctv':
      return <CctvGraphic {...props} />;
    case 'voice':
      return <VoiceGraphic {...props} />;
    case 'classification':
      return <ClassificationGraphic {...props} />;
    default:
      return <DefaultGraphic {...props} />;
  }
}
