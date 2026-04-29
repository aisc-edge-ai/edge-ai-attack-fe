import { useState } from 'react';
import { saveAs } from 'file-saver';
import { Button, Card, Elevation, Icon, Intent, Tag } from '@blueprintjs/core';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { RISK_LABELS, GRADE_CRITERIA, RECOMMENDATIONS } from '@/lib/risk-constants';
import { AppToaster } from '@/lib/toaster';
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
        import('./ReportPdfDocument'),
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

  const beforeAcc = parseFloat(selectedResult.beforeAccuracy);
  const afterAcc = parseFloat(selectedResult.afterAccuracy);
  const drop = (beforeAcc - afterAcc).toFixed(1);

  const visualEvidence = selectedResult.detail?.visualEvidence;
  const sampleImage = visualEvidence?.sampleImages?.[0];

  const RISK_INTENTS: Record<string, Intent> = {
    vulnerable: Intent.DANGER,
    warning: Intent.WARNING,
    safe: Intent.SUCCESS,
  };
  const riskLabel = RISK_LABELS[selectedResult.risk] || selectedResult.risk;
  const riskIntent: Intent = RISK_INTENTS[selectedResult.risk] ?? Intent.NONE;

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
            <div className="evidence-grid">
              <div className="evidence-panel">
                <div className="evidence-header">원본 데이터 (정상 탐지)</div>
                <div className="evidence-body">
                  {sampleImage?.clean ? (
                    <img
                      src={sampleImage.clean}
                      alt="Clean sample"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <>
                      <Icon icon="media" size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                      <span style={{ fontSize: 13 }}>원본 이미지 없음</span>
                    </>
                  )}
                </div>
              </div>
              <div className="evidence-panel danger">
                <div className="evidence-header">
                  <Icon icon="warning-sign" size={12} style={{ marginRight: 4 }} />
                  적대적 데이터 (탐지 회피)
                </div>
                <div className="evidence-body">
                  {sampleImage?.patched ? (
                    <img
                      src={sampleImage.patched}
                      alt="Patched sample"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <>
                      <Icon icon="media" size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                      <span style={{ fontSize: 13 }}>공격 이미지 없음</span>
                    </>
                  )}
                </div>
              </div>
            </div>
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
              </tbody>
            </table>
          </div>
        </div>

        {/* 하단: Prominent 수치 6칸 */}
        <div className="analysis-prominent-metrics">
          <div className="prominent-item">
            <div className="prominent-label">Before AP</div>
            <div className="prominent-value">{selectedResult.beforeAP ?? '-'}</div>
          </div>
          <div className="prominent-item">
            <div className="prominent-label">After AP</div>
            <div className="prominent-value danger">{selectedResult.afterAP ?? '-'}</div>
          </div>
          <div className="prominent-item">
            <div className="prominent-label">Before AR</div>
            <div className="prominent-value">{selectedResult.beforeAR ?? '-'}</div>
          </div>
          <div className="prominent-item">
            <div className="prominent-label">After AR</div>
            <div className="prominent-value danger">{selectedResult.afterAR ?? '-'}</div>
          </div>
          <div className="prominent-item">
            <div className="prominent-label">AP Drop</div>
            <div className="prominent-value danger">
              {selectedResult.beforeAP && selectedResult.afterAP
                ? `-${(parseFloat(selectedResult.beforeAP) - parseFloat(selectedResult.afterAP)).toFixed(3)}`
                : `-${drop}%p`}
            </div>
          </div>
          <div className="prominent-item">
            <div className="prominent-label">Attack Success</div>
            <div className="prominent-value danger">{selectedResult.attackSuccessRate ?? selectedResult.successRate}</div>
          </div>
        </div>
      </div>

      {/* 🧩 Visual Evidence — patch & confusion matrix */}
      {(visualEvidence?.patchImage || visualEvidence?.confusionMatrix) && (
        <div className="results-section-card">
          <div className="results-section-header">
            <Icon icon="media" size={12} />
            <span>Visual Evidence</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 16 }}>
            {visualEvidence.patchImage && (
              <div>
                <div className="bp6-text-muted" style={{ fontSize: 12, marginBottom: 6 }}>
                  학습된 적대적 패치
                </div>
                <img
                  src={visualEvidence.patchImage}
                  alt="Adversarial patch"
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
            )}
            {visualEvidence.confusionMatrix && (
              <div>
                <div className="bp6-text-muted" style={{ fontSize: 12, marginBottom: 6 }}>
                  Confusion Matrix (패치 적용 후)
                </div>
                <img
                  src={visualEvidence.confusionMatrix}
                  alt="Confusion matrix"
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
            )}
          </div>
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

          <p className="assessment-summary">
            해당 <strong>{selectedResult.model}</strong>은{' '}
            <strong>{selectedResult.dataset ?? '테스트 데이터셋'}</strong>에 대한{' '}
            <strong>{selectedResult.attack}</strong> 공격에 대해 공격 성공률이{' '}
            <strong className="assessment-summary-num">
              {selectedResult.attackSuccessRate ?? selectedResult.successRate}
            </strong>
            로 <strong>{riskLabel}</strong> 수준으로 나타났다.
          </p>

          <div className="assessment-divider" />

          <div>
            <div className="assessment-sub-label">등급 기준 및 해석</div>
            <dl className="grade-legend">
              {GRADE_CRITERIA.map((g) => {
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
          {RECOMMENDATIONS.map((r) => (
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
