import type { AttackResult } from '@/types';
import { isImagenetResult } from './pdf/helpers/isImagenetResult';
import { isInversionResult } from './pdf/helpers/isInversionResult';

interface ProminentMetricsProps {
  result: AttackResult;
}

/**
 * 결과 상세 페이지의 Prominent 영역 metric strip.
 *
 * - DeepVoice (`verifier` 존재) → 원본 인식률 / 공격 인식률 / 공격 성공 개수 3카드
 * - MTC (`inferenceAccuracy` 존재) → Baseline / Blackbox / Graybox 정확도 3카드
 * - ImageNet (Contour) → ASR / L0 / L2 / SSIM / n 5카드
 * - TrapMI Inversion (modelType `'모델 역추출 공격'`) → 정상 분류 정확도 / 복원 SSIM / 복원 MSE / 오분류 CE 4카드
 * - 그 외 (기존 객체 탐지) → Before/After AP, Before/After AR, AP Drop, Attack Success 6칸
 *
 * 새 metric 세트 추가 시 이 컴포넌트 안에서 분기 추가. ResultAnalysisTab 손 안 댐.
 */
export function ProminentMetrics({ result }: ProminentMetricsProps) {
  if (result.verifier) {
    return <VoiceMetricCards result={result} />;
  }
  if (result.inferenceAccuracy) {
    return <MtcAccuracyCards inference={result.inferenceAccuracy} />;
  }
  if (isImagenetResult(result)) {
    return <ImageNetMetricCards result={result} />;
  }
  if (isInversionResult(result)) {
    return <InversionMetricCards result={result} />;
  }
  return <DetectionMetricStrip result={result} />;
}

function VoiceMetricCards({ result }: { result: AttackResult }) {
  // 백엔드 deepvoice parser 가 detail.metrics 에 채움.
  // clean.accuracy = summary_results_raw.csv 의 ASR% / 100 (정상 화자 통과율)
  // patched.ASR = summary_results_<synth>.csv 의 ASR% / 100 (합성 음성 통과율)
  // patched.total_accept / total_trials = 동 CSV 의 Total Accept / Total Trials
  const patched = result.detail?.metrics?.patched ?? {};
  const clean = result.detail?.metrics?.clean ?? {};

  const cleanAccPct =
    typeof clean.accuracy === 'number' ? `${(clean.accuracy * 100).toFixed(2)}%` : '-';
  const asrPct =
    typeof patched.ASR === 'number'
      ? `${(patched.ASR * 100).toFixed(2)}%`
      : (result.attackSuccessRate ?? result.successRate);
  const totalAcceptLabel =
    typeof patched.total_accept === 'number' ? patched.total_accept.toLocaleString() : '-';
  const totalTrialsLabel =
    typeof patched.total_trials === 'number' ? patched.total_trials.toLocaleString() : '-';

  return (
    <div className="analysis-prominent-metrics analysis-prominent-metrics--voice">
      <div className="prominent-item">
        <div className="prominent-label">원본 인식률 (정상 화자 통과)</div>
        <div className="prominent-value">{cleanAccPct}</div>
      </div>
      <div className="prominent-item">
        <div className="prominent-label">합성 인식률 (Attack Success Rate)</div>
        <div className="prominent-value danger">{asrPct}</div>
      </div>
      <div className="prominent-item">
        <div className="prominent-label">공격 성공 개수 (Total Accept)</div>
        <div className="prominent-value danger">{totalAcceptLabel}</div>
      </div>
      <div className="prominent-item">
        <div className="prominent-label">공격 전체 개수 (Total Trials)</div>
        <div className="prominent-value">{totalTrialsLabel}</div>
      </div>
    </div>
  );
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

function InversionMetricCards({ result }: { result: AttackResult }) {
  // 백엔드 trapmi parser 가 detail.metrics 에 채움 (TRAPMI_API.md §3.7).
  // clean.victim_accuracy = 정상 입력에 대한 victim 분류 정확도 (0~1)
  // patched.reconstruction_ssim = 원본 ↔ 복원 SSIM (0~1, 높을수록 공격 성공)
  // patched.reconstruction_mse = 원본 ↔ 복원 MSE 평균 (낮을수록 복원 정확)
  // patched.attack_ce_on_reconstruction = 복원 이미지의 CE Loss (높을수록 방어 효과)
  const clean = result.detail?.metrics?.clean ?? {};
  const patched = result.detail?.metrics?.patched ?? {};

  const victimAccPct =
    typeof clean.victim_accuracy === 'number' ? `${(clean.victim_accuracy * 100).toFixed(1)}%` : '-';
  const ssimPct =
    typeof patched.reconstruction_ssim === 'number'
      ? `${(patched.reconstruction_ssim * 100).toFixed(2)}%`
      : (result.attackSuccessRate ?? result.successRate);
  const mseLabel =
    typeof patched.reconstruction_mse === 'number' ? patched.reconstruction_mse.toFixed(4) : '-';
  const ceLabel =
    typeof patched.attack_ce_on_reconstruction === 'number'
      ? patched.attack_ce_on_reconstruction.toFixed(2)
      : '-';

  return (
    <div className="analysis-prominent-metrics analysis-prominent-metrics--inversion">
      <div className="prominent-item">
        <div className="prominent-label">정상 분류 정확도 (Victim Acc)</div>
        <div className="prominent-value">{victimAccPct}</div>
      </div>
      <div className="prominent-item">
        <div className="prominent-label">복원 유사도 (Reconstruction SSIM)</div>
        <div className="prominent-value danger">{ssimPct}</div>
      </div>
      <div className="prominent-item">
        <div className="prominent-label">복원 오차 (Reconstruction MSE)</div>
        <div className="prominent-value">{mseLabel}</div>
      </div>
      <div className="prominent-item">
        <div className="prominent-label">오분류 손실 (Attack CE Loss)</div>
        <div className="prominent-value">{ceLabel}</div>
      </div>
    </div>
  );
}

function ImageNetMetricCards({ result }: { result: AttackResult }) {
  const patched = result.detail?.metrics?.patched ?? {};

  const asrPct =
    typeof patched.ASR === 'number'
      ? `${(patched.ASR * 100).toFixed(2)}%`
      : (result.attackSuccessRate ?? result.successRate);
  const l0 = typeof patched.L0 === 'number' ? patched.L0.toLocaleString() : '-';
  const l2 = typeof patched.L2 === 'number' ? patched.L2.toFixed(3) : '-';
  const ssim = typeof patched.SSIM === 'number' ? patched.SSIM.toFixed(4) : '-';
  const n = typeof patched.n === 'number' ? patched.n.toLocaleString() : '-';

  return (
    <div className="analysis-prominent-metrics analysis-prominent-metrics--imagenet">
      <div className="prominent-item">
        <div className="prominent-label">Attack Success Rate (ASR)</div>
        <div className="prominent-value danger">{asrPct}</div>
      </div>
      <div className="prominent-item">
        <div className="prominent-label">L0 (변경 픽셀 수)</div>
        <div className="prominent-value">{l0}</div>
      </div>
      <div className="prominent-item">
        <div className="prominent-label">L2 (평균 거리)</div>
        <div className="prominent-value">{l2}</div>
      </div>
      <div className="prominent-item">
        <div className="prominent-label">SSIM (구조적 유사도)</div>
        <div className="prominent-value">{ssim}</div>
      </div>
      <div className="prominent-item">
        <div className="prominent-label">샘플 수 (n)</div>
        <div className="prominent-value">{n}</div>
      </div>
    </div>
  );
}
