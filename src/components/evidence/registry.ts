import type { ComponentType } from 'react';
import type { AttackResult } from '@/types';
import { ImageEvidence } from './ImageEvidence';
import { AudioEvidence } from './AudioEvidence';
import { MTCEvidence } from './MTCEvidence';

type VisualEvidence = NonNullable<AttackResult['detail']>['visualEvidence'];

export type EvidenceKind = 'image' | 'audio' | 'mtc';

interface EvidenceProps {
  evidence: VisualEvidence;
}

/**
 * Evidence renderer registry.
 *
 * 새 evidence 타입 추가 절차:
 *   1. `<Kind>Evidence.tsx` 컴포넌트 추가 (props: `{ evidence: VisualEvidence }`)
 *   2. 이 registry 에 한 줄 추가
 *   3. `inferEvidenceKind()` 분기 보강 (백엔드가 type 필드 주면 거기로 분기)
 * ResultAnalysisTab 코드 변경 없이 확장 가능.
 */
export const EVIDENCE_RENDERERS: Record<EvidenceKind, ComponentType<EvidenceProps>> = {
  image: ImageEvidence,
  audio: AudioEvidence,
  mtc: MTCEvidence,
};

export function inferEvidenceKind(evidence: VisualEvidence | undefined): EvidenceKind {
  if (evidence?.confusionMatrixCombined) return 'mtc';
  if ((evidence?.audioSamples?.length ?? 0) > 0) return 'audio';
  return 'image';
}
