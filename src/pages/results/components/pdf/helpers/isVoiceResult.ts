import type { AttackResult } from '@/types';

/**
 * DeepVoice 결과 판별.
 * web UI 의 `ResultAnalysisTab.tsx:isVoice` 와 동일 조건으로 web/pdf 단일 진실.
 */
export function isVoiceResult(result: AttackResult): boolean {
  return !!result.verifier;
}
