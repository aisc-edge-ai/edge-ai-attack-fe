import type { AttackResult } from '@/types';

/**
 * MTC (Model Type Classification) 결과 판별.
 * web UI 의 `ResultAnalysisTab.tsx:isMtc` 와 동일 조건으로, web/pdf 단일 진실.
 */
export function isMtcResult(result: AttackResult): boolean {
  return !!result.inferenceAccuracy;
}
