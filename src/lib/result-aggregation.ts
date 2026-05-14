import type { AttackResult } from '@/types';

export interface AccuracyDropDatum {
  model: string;
  before: number;
  after: number;
}

export interface SuccessRateDatum {
  name: string;
  rate: number;
}

/**
 * "95.2%", "76.47%", "100" 등의 문자열을 number 로 파싱.
 * 비어있거나 파싱 실패 시 null.
 */
function parsePercent(raw: string | undefined | null): number | null {
  if (!raw) return null;
  const cleaned = String(raw).replace('%', '').trim();
  const v = Number(cleaned);
  return Number.isFinite(v) ? v : null;
}

/**
 * Accuracy drop 차트용 집계: 모델별로 before/after 정확도 평균.
 *
 * @param results - 백엔드 + mock 병합된 결과 배열
 * @returns 모델별 평균. 빈 배열 또는 정상 데이터 없으면 빈 배열.
 */
export function aggregateForAccuracyDrop(results: AttackResult[]): AccuracyDropDatum[] {
  const byModel = new Map<string, { before: number[]; after: number[] }>();
  for (const r of results) {
    const before = parsePercent(r.beforeAccuracy);
    const after = parsePercent(r.afterAccuracy);
    if (before === null || after === null) continue;
    const entry = byModel.get(r.model) ?? { before: [], after: [] };
    entry.before.push(before);
    entry.after.push(after);
    byModel.set(r.model, entry);
  }

  return Array.from(byModel.entries()).map(([model, { before, after }]) => ({
    model,
    before: Math.round(avg(before)),
    after: Math.round(avg(after)),
  }));
}

/**
 * Success rate 차트용 집계: 공격 기법 그룹별 평균 공격 성공률.
 *
 * 공격명을 `groupAttack()` 로 정규화 (예: "Patch-Hiding, Patch-Altering" → "적대적 패치").
 *
 * @returns 그룹별 평균. successRate 가 모두 없으면 빈 배열.
 */
export function aggregateForSuccessRate(results: AttackResult[]): SuccessRateDatum[] {
  const byGroup = new Map<string, number[]>();
  for (const r of results) {
    const rate = parsePercent(r.attackSuccessRate ?? r.successRate);
    if (rate === null) continue;
    const group = groupAttack(r.attack);
    const arr = byGroup.get(group) ?? [];
    arr.push(rate);
    byGroup.set(group, arr);
  }

  return Array.from(byGroup.entries())
    .map(([name, rates]) => ({ name, rate: Math.round(avg(rates) * 10) / 10 }))
    .sort((a, b) => b.rate - a.rate);
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((s, n) => s + n, 0) / nums.length;
}

/** 공격명을 사람이 읽을 그룹명으로 정규화. */
function groupAttack(attack: string): string {
  const normalized = attack.toLowerCase();
  if (normalized.includes('patch-')) return '적대적 패치';
  if (/(fgsm|bim|pgd)/i.test(attack)) return 'FGSM / BIM / PGD';
  if (attack.includes('딥보이스') || normalized.includes('voice')) return '음성 우회';
  return attack;
}
