import type { AttackResult } from '@/types';

interface ProminentMetricsProps {
  result: AttackResult;
}

/**
 * 결과 상세 페이지의 Prominent 영역 metric strip.
 *
 * - MTC (`inferenceAccuracy` 존재) → Baseline / Blackbox / Graybox 정확도 3카드
 * - 그 외 (기존 객체 탐지) → Before/After AP, Before/After AR, AP Drop, Attack Success 6칸
 *
 * 새 metric 세트 추가 시 이 컴포넌트 안에서 분기 추가. ResultAnalysisTab 손 안 댐.
 */
export function ProminentMetrics({ result }: ProminentMetricsProps) {
  if (result.inferenceAccuracy) {
    return <MtcAccuracyCards inference={result.inferenceAccuracy} />;
  }
  return <DetectionMetricStrip result={result} />;
}

interface MtcAccuracyCardsProps {
  inference: NonNullable<AttackResult['inferenceAccuracy']>;
}

function MtcAccuracyCards({ inference }: MtcAccuracyCardsProps) {
  return (
    <div className="analysis-prominent-metrics analysis-prominent-metrics--mtc">
      <div className="prominent-item">
        <div className="prominent-label">모델 확률 기반 추론 정확도 (Baseline)</div>
        <div className="prominent-value">{inference.baseline}%</div>
      </div>
      <div className="prominent-item">
        <div className="prominent-label">Black box 기반 추론 정확도 (+Feature1)</div>
        <div className="prominent-value warning">{inference.blackbox}%</div>
      </div>
      <div className="prominent-item">
        <div className="prominent-label">Gray box 기반 추론 정확도 (+Feature1+Feature2)</div>
        <div className="prominent-value danger">{inference.graybox}%</div>
      </div>
    </div>
  );
}

function DetectionMetricStrip({ result }: { result: AttackResult }) {
  const beforeAcc = parseFloat(result.beforeAccuracy);
  const afterAcc = parseFloat(result.afterAccuracy);
  const drop = (beforeAcc - afterAcc).toFixed(1);

  return (
    <div className="analysis-prominent-metrics">
      <div className="prominent-item">
        <div className="prominent-label">Before AP</div>
        <div className="prominent-value">{result.beforeAP ?? '-'}</div>
      </div>
      <div className="prominent-item">
        <div className="prominent-label">After AP</div>
        <div className="prominent-value danger">{result.afterAP ?? '-'}</div>
      </div>
      <div className="prominent-item">
        <div className="prominent-label">Before AR</div>
        <div className="prominent-value">{result.beforeAR ?? '-'}</div>
      </div>
      <div className="prominent-item">
        <div className="prominent-label">After AR</div>
        <div className="prominent-value danger">{result.afterAR ?? '-'}</div>
      </div>
      <div className="prominent-item">
        <div className="prominent-label">AP Drop</div>
        <div className="prominent-value danger">
          {result.beforeAP && result.afterAP
            ? `-${(parseFloat(result.beforeAP) - parseFloat(result.afterAP)).toFixed(3)}`
            : `-${drop}%p`}
        </div>
      </div>
      <div className="prominent-item">
        <div className="prominent-label">Attack Success</div>
        <div className="prominent-value danger">{result.attackSuccessRate ?? result.successRate}</div>
      </div>
    </div>
  );
}
