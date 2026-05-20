import { useState } from 'react';
import { saveAs } from 'file-saver';
import { Button, Card, Elevation, Icon, Intent, Tag } from '@blueprintjs/core';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { EvidenceRenderer } from '@/components/evidence';
import { RISK_LABELS, getGradeCriteria, getRecommendations } from '@/lib/risk-constants';
import { AppToaster } from '@/lib/toaster';
import { ProminentMetrics } from './ProminentMetrics';
import { isImagenetResult } from './pdf/helpers/isImagenetResult';
import type { AttackResult } from '@/types';

interface ResultAnalysisTabProps {
  selectedResult: AttackResult | null;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onGoBack: () => void;
}

export function ResultAnalysisTab({
  selectedResult,
  isLoading = false,
  isError = false,
  onRetry,
  onGoBack,
}: ResultAnalysisTabProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    if (!selectedResult) return;
    setIsGeneratingPdf(true);
    try {
      // 동적 import — @react-pdf/renderer 를 main bundle 에서 분리
      const [{ pdf }, { ReportPdfDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./pdf/ReportPdfDocument'),
      ]);
      const blob = await pdf(<ReportPdfDocument result={selectedResult} />).toBlob();
      saveAs(new Blob([blob], { type: 'application/pdf' }), `${selectedResult.id}_report.pdf`);
    } catch (err: unknown) {
      const toaster = await AppToaster;
      toaster.show({
        message: 'PDF 다운로드에 실패했습니다.',
        intent: Intent.DANGER,
        icon: 'error',
      });
      void err;
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (isLoading && !selectedResult) {
    return (
      <div className="results-summary-content animate-fade-in">
        <div className="bp6-skeleton" style={{ height: 110 }} />
        <div className="bp6-skeleton" style={{ height: 360 }} />
        <div className="bp6-skeleton" style={{ height: 240 }} />
      </div>
    );
  }

  if (isError && !selectedResult) {
    return (
      <ErrorState
        title="상세 결과를 불러올 수 없습니다"
        description="선택한 공격 로그의 상세 데이터를 다시 요청해주세요."
        onRetry={onRetry}
      />
    );
  }

  if (!selectedResult) {
    return (
      <EmptyState
        icon="search"
        title="선택된 공격 로그가 없습니다."
        description="결과 요약 탭에서 분석할 로그의 [상세 분석] 버튼을 클릭해주세요."
        action={<Button intent={Intent.PRIMARY} text="요약 탭으로 돌아가기" onClick={onGoBack} />}
      />
    );
  }

  const visualEvidence = selectedResult.detail?.visualEvidence;
  const isMtc = !!selectedResult.inferenceAccuracy;
  const isVoice = !!selectedResult.verifier;
  const isImagenet = isImagenetResult(selectedResult);
  const patched = selectedResult.detail?.metrics?.patched ?? {};
  // README v2: 결과 CSV 는 per-run path. rawResultsUrl 에서 runId 추출.
  const voiceRunId =
    selectedResult.rawResultsUrl?.match(/results_raw\/([^/]+)/)?.[1] ?? '<runId>';

  const RISK_INTENTS: Record<string, Intent> = {
    vulnerable: Intent.DANGER,
    warning: Intent.WARNING,
    safe: Intent.SUCCESS,
  };
  const riskLabel = RISK_LABELS[selectedResult.risk] || selectedResult.risk;
  const riskIntent: Intent = RISK_INTENTS[selectedResult.risk] ?? Intent.NONE;
  const gradeCriteria = getGradeCriteria(selectedResult.modelType);
  const recommendations = getRecommendations(selectedResult.modelType);

  const successRateLabel = selectedResult.attackSuccessRate ?? selectedResult.successRate;
  let assessmentPrompt: string | null = null;
  if (isMtc) {
    assessmentPrompt = `해당 모델군에 대해 수행한 Model Type Classification 에서 공격 성공률이 ${successRateLabel} 로 나타나 ${riskLabel} 수준의 취약성을 보였다. 이는 공격자가 대상 모델의 출력값 또는 출력 분포를 분석함으로써, 사전에 정의된 N개의 후보 모델 중 해당 모델이 어떤 유형에 속하는지 식별할 가능성이 있음을 의미한다. 이와 같이 유출된 모델 구조 정보는 이후 모델 복제, 표적형 적대적 공격, 우회 공격 등 추가적인 공격의 기초 정보로 악용될 수 있다.`;
  } else if (isVoice) {
    assessmentPrompt = `해당 ${selectedResult.model}은(는) ${selectedResult.dataset ?? '데이터셋'} 환경에서 수행한 합성 음성 입력 공격(딥보이스) 점검 결과, 공격 성공률이 ${successRateLabel}로 나타나 ${riskLabel} 수준의 취약성을 보였다. 이는 공격자가 딥보이스 기반 합성 음성을 입력할 경우, 인식 모델이 비정상적으로 동작하거나 오인식할 가능성이 있음을 의미한다.`;
  }

  let assessmentJsx: React.ReactNode | null = null;
  if (isImagenet) {
    assessmentJsx = (
      <p className="assessment-summary">
        해당 <strong>{selectedResult.model}</strong>은(는){' '}
        <strong>{selectedResult.dataset ?? 'ImageNet 데이터셋'}</strong>에 대해 수행한{' '}
        <strong>{selectedResult.attack}</strong> 점검 결과, 공격 성공률이{' '}
        <strong className="assessment-summary-num">{successRateLabel}</strong>로 나타나{' '}
        <strong>{riskLabel}</strong> 수준의 취약성을 보였다. Contour 계열 공격은 이미지의
        윤곽선(contour) 영역에만 perturbation을 적용하여 시각적 차이를 최소화하면서도
        분류 결과를 변경할 수 있음을 보여준다.
      </p>
    );
  }

  return (
    <div className="results-summary-content animate-fade-in">
      {/* 리포트 헤더 — 유지 */}
      <Card elevation={Elevation.ONE}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <Tag minimal><code>{selectedResult.id}</code></Tag>
              <RiskBadge risk={selectedResult.risk} />
            </div>
            <h3 className="bp6-heading" style={{ marginBottom: 4 }}>
              {selectedResult.model} 취약성 분석 리포트
            </h3>
            <p className="bp6-text-muted">
              공격 기법: <strong>{selectedResult.attack}</strong> | 수행 일시: {selectedResult.date}
            </p>
          </div>
          <Button
            icon="download"
            text="PDF 다운로드"
            outlined
            loading={isGeneratingPdf}
            onClick={handleDownloadPdf}
          />
        </div>
      </Card>

      {/* ★ Prominent — 증거 + 메타데이터 + 수치 통합 */}
      <div className="results-section-card">
        <div className="results-section-header">
          <Icon icon="star" size={12} />
          <span>Prominent</span>
        </div>

        {/* 상단: 좌 증거 이미지 | 우 메타데이터 */}
        <div className="analysis-prominent-top">
          <div className="analysis-evidence-side">
            <EvidenceRenderer evidence={visualEvidence} />
          </div>

          <div className="analysis-metadata-side">
            <h6>Metadata</h6>
            <table className="analysis-meta-table">
              <tbody>
                <tr>
                  <td className="analysis-meta-key">타겟 모델</td>
                  <td className="analysis-meta-value">{selectedResult.model}</td>
                </tr>
                <tr>
                  <td className="analysis-meta-key">모델 유형</td>
                  <td className="analysis-meta-value">{selectedResult.modelType}</td>
                </tr>
                <tr>
                  <td className="analysis-meta-key">공격 기법</td>
                  <td className="analysis-meta-value">{selectedResult.attack}</td>
                </tr>
                {isMtc && (
                  <>
                    <tr>
                      <td className="analysis-meta-key">데이터셋</td>
                      <td className="analysis-meta-value">{selectedResult.dataset ?? '-'}</td>
                    </tr>
                    <tr>
                      <td className="analysis-meta-key">후보 모델</td>
                      <td className="analysis-meta-value">CNN / ResNet / VGG / AlexNet</td>
                    </tr>
                    <tr>
                      <td className="analysis-meta-key">데이터 출처</td>
                      <td className="analysis-meta-value">results_raw/comparison/summary_comparison.csv</td>
                    </tr>
                  </>
                )}
                {isVoice && (
                  <>
                    <tr>
                      <td className="analysis-meta-key">데이터셋</td>
                      <td className="analysis-meta-value">{selectedResult.dataset ?? '-'}</td>
                    </tr>
                    <tr>
                      <td className="analysis-meta-key">검증 임계값</td>
                      <td className="analysis-meta-value">{selectedResult.confThreshold ?? '-'}</td>
                    </tr>
                    <tr>
                      <td className="analysis-meta-key">합성 엔진</td>
                      <td className="analysis-meta-value">{selectedResult.attack}</td>
                    </tr>
                    <tr>
                      <td className="analysis-meta-key">데이터 출처</td>
                      <td className="analysis-meta-value">
                        results_raw/{voiceRunId}/{selectedResult.verifier}/summary_results_{selectedResult.attack}.csv
                      </td>
                    </tr>
                  </>
                )}
                {isImagenet && (
                  <>
                    <tr>
                      <td className="analysis-meta-key">데이터셋</td>
                      <td className="analysis-meta-value">
                        {selectedResult.dataset ?? 'ImageNet subset (100 classes × 10)'}
                      </td>
                    </tr>
                    <tr>
                      <td className="analysis-meta-key">Epsilon (ε)</td>
                      <td className="analysis-meta-value">{patched.Linf ?? 0.03}</td>
                    </tr>
                    <tr>
                      <td className="analysis-meta-key">샘플 수</td>
                      <td className="analysis-meta-value">
                        {typeof patched.n === 'number' ? patched.n.toLocaleString() : '1,000'}
                      </td>
                    </tr>
                    <tr>
                      <td className="analysis-meta-key">데이터 출처</td>
                      <td className="analysis-meta-value">results_raw/summary.csv</td>
                    </tr>
                  </>
                )}
                {!isMtc && !isVoice && !isImagenet && (
                  <>
                    <tr>
                      <td className="analysis-meta-key">Conf Threshold</td>
                      <td className="analysis-meta-value">{selectedResult.confThreshold ?? '-'}</td>
                    </tr>
                    <tr>
                      <td className="analysis-meta-key">Average CIoU</td>
                      <td className="analysis-meta-value">{selectedResult.averageCIoU ?? '-'}</td>
                    </tr>
                    <tr>
                      <td className="analysis-meta-key">데이터 출처</td>
                      <td className="analysis-meta-value">clean_map_stats / patch_map_stats</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 하단: Prominent 수치 (modelType 별 분기 — ProminentMetrics 내부) */}
        <ProminentMetrics result={selectedResult} />
      </div>

      {/* 🧩 Visual Evidence — 공격 유형별 다른 이미지 세트 */}
      {(visualEvidence?.patchImage ||
        visualEvidence?.confusionMatrix ||
        visualEvidence?.rocCurveComparison ||
        visualEvidence?.valAccuracyComparison ||
        (visualEvidence?.sampleImages?.length ?? 0) > 0 ||
        visualEvidence?.tsneClusterImage) && (
        <div className="results-section-card">
          <div className="results-section-header">
            <Icon icon="media" size={12} />
            <span>Visual Evidence</span>
          </div>
          {isVoice && visualEvidence?.tsneClusterImage ? (
            <div style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
              <VisualEvidenceImage
                label="Speaker Embedding t-SNE: Original vs Generated Voices"
                src={visualEvidence.tsneClusterImage}
                alt="t-SNE speaker embedding cluster"
              />
            </div>
          ) : isImagenet ? (
            <div style={{ padding: 16 }}>
              {visualEvidence!.sampleImages?.[0] && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: visualEvidence!.patchImage ? 16 : 0 }}>
                  {visualEvidence!.sampleImages[0].clean && (
                    <VisualEvidenceImage label="원본 이미지 (정상 분류)" src={visualEvidence!.sampleImages[0].clean} alt="Clean sample" />
                  )}
                  {visualEvidence!.sampleImages[0].patched && (
                    <VisualEvidenceImage label="공격 이미지 (적대적 perturbation)" src={visualEvidence!.sampleImages[0].patched} alt="Patched sample" />
                  )}
                </div>
              )}
              {visualEvidence!.patchImage && (
                <div style={{ maxWidth: 720, margin: '0 auto' }}>
                  <VisualEvidenceImage label="공격 성공률 및 SSIM 비교 (4종 공격)" src={visualEvidence!.patchImage} alt="Attack summary plot" />
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 16 }}>
              {visualEvidence!.patchImage && (
                <VisualEvidenceImage label="학습된 적대적 패치" src={visualEvidence!.patchImage} alt="Adversarial patch" />
              )}
              {visualEvidence!.confusionMatrix && (
                <VisualEvidenceImage
                  label="Confusion Matrix (패치 적용 후)"
                  src={visualEvidence!.confusionMatrix}
                  alt="Confusion matrix"
                />
              )}
              {visualEvidence!.rocCurveComparison && (
                <VisualEvidenceImage
                  label="MTC · Averaged ROC curve"
                  src={visualEvidence!.rocCurveComparison}
                  alt="MTC averaged ROC curve"
                />
              )}
              {visualEvidence!.valAccuracyComparison && (
                <VisualEvidenceImage
                  label="MTC · Validation Accuracy"
                  src={visualEvidence!.valAccuracyComparison}
                  alt="MTC validation accuracy"
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* 🔍 Vulnerability Assessment */}
      <div className="results-section-card">
        <div className="results-section-header">
          <Icon icon="search" size={12} />
          <span>Vulnerability Assessment</span>
        </div>
        <div className="assessment-body">
          <div className="assessment-verdict-row">
            <div className="assessment-verdict-label">판정</div>
            <Tag large minimal round intent={riskIntent}>
              {riskLabel}
            </Tag>
          </div>

          {assessmentJsx ? (
            assessmentJsx
          ) : assessmentPrompt ? (
            <p className="assessment-summary">{assessmentPrompt}</p>
          ) : (
            <p className="assessment-summary">
              해당 <strong>{selectedResult.model}</strong>은{' '}
              <strong>{selectedResult.dataset ?? '테스트 데이터셋'}</strong>에 대한{' '}
              <strong>{selectedResult.attack}</strong> 공격에 대해 공격 성공률이{' '}
              <strong className="assessment-summary-num">
                {selectedResult.attackSuccessRate ?? selectedResult.successRate}
              </strong>
              로 <strong>{riskLabel}</strong> 수준으로 나타났다.
            </p>
          )}

          <div className="assessment-divider" />

          <div>
            <div className="assessment-sub-label">등급 기준 및 해석</div>
            <dl className="grade-legend">
              {gradeCriteria.map((g) => {
                const isCurrent = g.risk === selectedResult.risk;
                return (
                  <div
                    key={g.risk}
                    className="grade-legend-row"
                    data-risk={g.risk}
                    data-active={isCurrent ? 'true' : undefined}
                  >
                    <dt className="grade-legend-term">
                      <span className="grade-legend-dot" aria-hidden />
                      <span>{g.label}</span>
                    </dt>
                    <dd className="grade-legend-desc">{g.description}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </div>

      {/* 🛡 Security Recommendations */}
      <div className="results-section-card">
        <div className="results-section-header">
          <Icon icon="shield" size={12} />
          <span>Security Recommendations</span>
        </div>
        <ol className="rec-list">
          {recommendations.map((r) => (
            <li key={r.num} className="rec-item">
              <div className="rec-number">{r.num}</div>
              <div className="rec-content">
                <h5 className="bp6-heading rec-title">{r.title}</h5>
                <p className="rec-desc">{r.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

interface VisualEvidenceImageProps {
  label: string;
  src: string;
  alt: string;
}

function VisualEvidenceImage({ label, src, alt }: VisualEvidenceImageProps) {
  return (
    <div>
      <div className="bp6-text-muted" style={{ fontSize: 12, marginBottom: 6 }}>
        {label}
      </div>
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          maxHeight: 320,
          objectFit: 'contain',
          background: '#f5f8fa',
          borderRadius: 4,
          border: '1px solid rgba(16,22,26,0.1)',
        }}
      />
    </div>
  );
}
