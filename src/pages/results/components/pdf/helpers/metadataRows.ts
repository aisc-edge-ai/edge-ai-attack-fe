import type { AttackResult } from '@/types';
import { isImagenetResult } from './isImagenetResult';
import { isMtcResult } from './isMtcResult';
import { isVoiceResult } from './isVoiceResult';

export type MetadataRow = readonly [string, string];

/**
 * 모델 정보 메타데이터 row 빌더 — modelType 별 row 셋 결정.
 *
 * 새 modelType 추가 시 분기 한 줄만 더 붙이면 됨. ReportPdfDocument 손대지 않음.
 */
export function buildMetadataRows(result: AttackResult): MetadataRow[] {
  if (isVoiceResult(result)) {
    // README v2: per-run CSV path. rawResultsUrl 에서 runId 추출, 없으면 placeholder.
    const runId = result.rawResultsUrl?.match(/results_raw\/([^/]+)/)?.[1] ?? '<runId>';
    return [
      ['타겟 모델', result.model],
      ['모델 유형', result.modelType],
      ['합성 엔진', result.attack],
      ['데이터셋', result.dataset ?? '-'],
      ['검증 임계값', result.confThreshold?.toString() ?? '-'],
      [
        '데이터 출처',
        `results_raw/${runId}/${result.verifier}/summary_results_${result.attack}.csv`,
      ],
    ];
  }

  if (isMtcResult(result)) {
    return [
      ['타겟 모델', result.model],
      ['모델 유형', result.modelType],
      ['공격 기법', result.attack],
      ['데이터셋', result.dataset ?? '-'],
      ['후보 모델', 'CNN / ResNet / VGG / AlexNet'],
      ['데이터 출처', 'results_raw/comparison/summary_comparison.csv'],
    ];
  }

  if (isImagenetResult(result)) {
    const patched = result.detail?.metrics?.patched ?? {};
    return [
      ['타겟 모델', result.model],
      ['모델 유형', result.modelType],
      ['공격 기법', result.attack],
      ['데이터셋', result.dataset ?? 'ImageNet subset (100 classes × 10)'],
      ['Epsilon (ε)', String(patched.Linf ?? 0.03)],
      ['샘플 수', String(patched.n ?? 1000)],
      ['데이터 출처', 'results_raw/summary.csv'],
    ];
  }

  // 객체 탐지 기본
  return [
    ['타겟 모델', result.model],
    ['모델 유형', result.modelType],
    ['공격 기법', result.attack],
    ['Conf Threshold', result.confThreshold?.toString() ?? '-'],
    ['Average CIoU', result.averageCIoU?.toString() ?? '-'],
    ['데이터 출처', 'clean_map_stats / patch_map_stats'],
  ];
}
