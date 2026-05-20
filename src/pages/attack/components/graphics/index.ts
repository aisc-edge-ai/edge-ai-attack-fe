import type { ComponentType } from 'react';
import type { ModelType } from '@/types';
import { DefaultGraphic } from './DefaultGraphic';
import { CctvGraphic } from './CctvGraphic';
import { CctvSceneGraphic } from './CctvSceneGraphic';
import { CctvMotionLoopGraphic } from './CctvMotionLoopGraphic';
import { VoiceGraphic } from './VoiceGraphic';
import { ClassificationGraphic } from './ClassificationGraphic';
import type { AttackGraphicProps } from './types';

export type { AttackGraphicProps, AttackGraphicState } from './types';
export {
  DefaultGraphic,
  CctvGraphic,
  CctvSceneGraphic,
  CctvMotionLoopGraphic,
  VoiceGraphic,
  ClassificationGraphic,
};

const REGISTRY: Record<ModelType, ComponentType<AttackGraphicProps>> = {
  cctv: CctvMotionLoopGraphic,
  voice: VoiceGraphic,
  classification: ClassificationGraphic,
  autonomous: DefaultGraphic,
  imagenet: ClassificationGraphic,
};

/**
 * (modelType, attackId) 조합에 맞는 그래픽 컴포넌트 선택.
 * modelType 미지정 → DefaultGraphic (placeholder).
 * 새 modelType 추가 시 REGISTRY 에 한 줄 추가.
 *
 * 주의: AttackGraphicCanvas 는 자체 switch 를 사용하므로 이 함수는 외부 호출 전용.
 * REGISTRY 와 switch 가 동시에 존재하지만 양쪽 모두 CctvMotionLoopGraphic 을 가리키도록 유지.
 */
export function pickGraphic(modelType: ModelType | null): ComponentType<AttackGraphicProps> {
  if (!modelType) return DefaultGraphic;
  return REGISTRY[modelType] ?? DefaultGraphic;
}
