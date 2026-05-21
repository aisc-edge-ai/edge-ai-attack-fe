import type { AttackResult } from '@/types';

/**
 * TrapMI Model Inversion 결과 판별 — backend 가 result row 의 `modelType` 을
 * `'모델 역추출 공격'` 으로 발급한다 (TRAPMI_API.md §3.6).
 * web UI 의 `ResultAnalysisTab.tsx:isInversion` 와 동일 조건으로 web/pdf 단일 진실.
 */
export function isInversionResult(result: AttackResult): boolean {
  return result.modelType?.startsWith('모델 역추출') ?? false;
}
