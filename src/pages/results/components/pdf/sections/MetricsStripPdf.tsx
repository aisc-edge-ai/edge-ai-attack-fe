import type { AttackResult } from '@/types';
import { DetectionMetricsPdf } from './DetectionMetricsPdf';
import { ImageNetMetricsPdf } from './ImageNetMetricsPdf';
import { MtcAccuracyCardsPdf } from './MtcAccuracyCardsPdf';
import { VoiceMetricsPdf } from './VoiceMetricsPdf';
import { isImagenetResult } from '../helpers/isImagenetResult';
import { isVoiceResult } from '../helpers/isVoiceResult';

interface MetricsStripPdfProps {
  result: AttackResult;
}

/**
 * Metric strip router — modelType 별 분기.
 *
 * 새 modelType 의 metric 세트 추가 시:
 *   1. `<NewModel>MetricsPdf.tsx` 컴포넌트 추가
 *   2. 이 router 의 if 분기 한 줄 추가
 *   3. 끝 — ReportPdfDocument 본체 손대지 않음
 */
export function MetricsStripPdf({ result }: MetricsStripPdfProps) {
  if (isVoiceResult(result)) {
    return <VoiceMetricsPdf result={result} />;
  }
  if (result.inferenceAccuracy) {
    return <MtcAccuracyCardsPdf inference={result.inferenceAccuracy} />;
  }
  if (isImagenetResult(result)) {
    return <ImageNetMetricsPdf result={result} />;
  }
  return <DetectionMetricsPdf result={result} />;
}
