import type { AttackResult } from '@/types';
import { DetectionMetricsPdf } from './DetectionMetricsPdf';
import { MtcAccuracyCardsPdf } from './MtcAccuracyCardsPdf';

interface MetricsStripPdfProps {
  result: AttackResult;
}

/**
 * Metric strip router — `result.inferenceAccuracy` 유무로 분기.
 *
 * 새 modelType 의 metric 세트 추가 시:
 *   1. `<NewModel>MetricsPdf.tsx` 컴포넌트 추가
 *   2. 이 router 의 if 분기 한 줄 추가
 *   3. 끝 — ReportPdfDocument 본체 손대지 않음
 */
export function MetricsStripPdf({ result }: MetricsStripPdfProps) {
  if (result.inferenceAccuracy) {
    return <MtcAccuracyCardsPdf inference={result.inferenceAccuracy} />;
  }
  return <DetectionMetricsPdf result={result} />;
}
