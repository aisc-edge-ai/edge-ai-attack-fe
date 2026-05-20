import {
  useAttackWizardStore,
  useCctvPreviewState,
} from '@/stores/attackWizardStore';
import { useAttackJobStore, isJobRunning } from '@/stores/attackJobStore';
import { useVisualizationDatasets } from '@/hooks/useDatasets';
import {
  CctvMotionLoopGraphic,
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
 *  - hover (modelType / attackId / datasetId) → preview 상태
 *  - selected (selectedModelType / selectedAttackIds[0]) → selected 상태
 *  - 그 외 → idle (DefaultGraphic placeholder)
 *
 * CCTV 는 Sora 로 만든 정적 영상 루프 + React/SVG 오버레이를 사용한다.
 * 다른 modelType 은 기존 컴포넌트 그대로.
 */
export function AttackGraphicCanvas() {
  const isRunning = useAttackJobStore((s) => isJobRunning(s.activeJob?.status));
  const hoveredModelType = useAttackWizardStore((s) => s.hoveredModelType);
  const hoveredAttackId = useAttackWizardStore((s) => s.hoveredAttackId);
  const hoveredDatasetId = useAttackWizardStore((s) => s.hoveredDatasetId);
  const selectedModelType = useAttackWizardStore((s) => s.selectedModelType);
  const dataSource = useAttackWizardStore((s) => s.dataSource);
  const datasetSubOption = useAttackWizardStore((s) => s.datasetSubOption);
  const selectedAttackIds = useAttackWizardStore((s) => s.selectedAttackIds);

  const {
    effectiveModelType,
    effectiveAttackId,
    modelDisplayLabel,
    datasetIdForLabel,
  } = useCctvPreviewState();

  // dataset 메타 lookup — Step 4 에서 사용되는 동일 캐시 공유 (queryKey 매칭).
  // generate 모드 / sub-option 미선택 / datasetId 미선택 시 fetch 차단.
  const shouldLookupDataset =
    dataSource === 'load' &&
    datasetSubOption !== null &&
    datasetIdForLabel !== null &&
    selectedAttackIds.length > 0;
  const datasetsQuery = useVisualizationDatasets({
    modelType: effectiveModelType,
    attackTypeIds: selectedAttackIds,
    kind: datasetSubOption ?? 'latest',
    enabled: shouldLookupDataset,
  });

  const matchedDataset = shouldLookupDataset
    ? datasetsQuery.data?.find((d) => d.id === datasetIdForLabel)
    : undefined;
  const datasetLabel = matchedDataset
    ? `${matchedDataset.name} · ${matchedDataset.size}`
    : undefined;

  let state: AttackGraphicState;
  if (isRunning) {
    state = 'running';
  } else if (hoveredModelType || hoveredAttackId || hoveredDatasetId) {
    state = 'preview';
  } else if (selectedModelType) {
    state = 'selected';
  } else {
    state = 'idle';
  }

  const sharedProps: AttackGraphicProps = {
    state,
    attackId: effectiveAttackId,
    modelDisplayLabel,
    datasetLabel,
  };

  return (
    <div className="attack-graphic-canvas">
      {renderGraphic(effectiveModelType, sharedProps)}
    </div>
  );
}

function renderGraphic(modelType: ModelType | null, props: AttackGraphicProps) {
  switch (modelType) {
    case 'cctv':
      return <CctvMotionLoopGraphic {...props} />;
    case 'voice':
      return <VoiceGraphic {...props} />;
    case 'classification':
    case 'imagenet':
      return <ClassificationGraphic {...props} />;
    default:
      return <DefaultGraphic {...props} />;
  }
}
