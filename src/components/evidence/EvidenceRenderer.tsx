import type { AttackResult } from '@/types';
import { ImageEvidence } from './ImageEvidence';
import { EVIDENCE_RENDERERS, inferEvidenceKind, type EvidenceKind } from './registry';

type VisualEvidence = NonNullable<AttackResult['detail']>['visualEvidence'];

interface EvidenceRendererProps {
  evidence: VisualEvidence | undefined;
  kind?: EvidenceKind;
}

/**
 * Evidence 컴포넌트의 단일 진입점. 백엔드가 `evidence.type` 같은 필드를 주기 전까지는
 * `inferEvidenceKind()` 가 형태(audioSamples 유무)로 자동 분기.
 */
export function EvidenceRenderer({ evidence, kind }: EvidenceRendererProps) {
  if (!evidence) return null;
  const resolvedKind = kind ?? inferEvidenceKind(evidence);
  const Renderer = EVIDENCE_RENDERERS[resolvedKind] ?? ImageEvidence;
  return <Renderer evidence={evidence} />;
}
