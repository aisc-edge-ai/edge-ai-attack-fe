import type { AttackResult } from '@/types';
import { isMtcResult } from './isMtcResult';

export type MetadataRow = readonly [string, string];

/**
 * 모델 정보 메타데이터 row 빌더 — modelType 별 row 셋 결정.
 *
 * 새 modelType 추가 시 분기 한 줄만 더 붙이면 됨. ReportPdfDocument 손대지 않음.
 */
export function buildMetadataRows(result: AttackResult): MetadataRow[] {
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
