import type { ComponentType } from 'react';
import type { ModelType } from '@/types';
import { DefaultGraphic } from './DefaultGraphic';
import { CctvGraphic } from './CctvGraphic';
import { VoiceGraphic } from './VoiceGraphic';
import { ClassificationGraphic } from './ClassificationGraphic';
import type { AttackGraphicProps } from './types';

export type { AttackGraphicProps, AttackGraphicState } from './types';
export { DefaultGraphic, CctvGraphic, VoiceGraphic, ClassificationGraphic };

const REGISTRY: Record<ModelType, ComponentType<AttackGraphicProps>> = {
  cctv: CctvGraphic,
  voice: VoiceGraphic,
  classification: ClassificationGraphic,
  autonomous: DefaultGraphic,
};

/**
 * (modelType, attackId) 조합에 맞는 그래픽 컴포넌트 선택.
 * modelType 미지정 → DefaultGraphic (placeholder).
 * 새 modelType 추가 시 REGISTRY 에 한 줄 추가.
 */
export function pickGraphic(modelType: ModelType | null): ComponentType<AttackGraphicProps> {
  if (!modelType) return DefaultGraphic;
  return REGISTRY[modelType] ?? DefaultGraphic;
}
