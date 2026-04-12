import { useState } from 'react';
import { Button, Card, Elevation, Icon, Intent, Tag } from '@blueprintjs/core';
import { EmptyState } from '@/components/shared/EmptyState';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { RISK_LABELS, GRADE_CRITERIA, RECOMMENDATIONS } from '@/lib/risk-constants';
import { AppToaster } from '@/lib/toaster';
import type { AttackResult } from '@/types';

interface ResultAnalysisTabProps {
  selectedResult: AttackResult | null;
  onGoBack: () => void;
}

export function ResultAnalysisTab({ selectedResult, onGoBack }: ResultAnalysisTabProps) {
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
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedResult.id}_report.pdf`;
      // Firefox/일부 Chromium 에서 document 에 연결되지 않은 엘리먼트의 click 을
      // 무시하는 경우가 있어, 명시적으로 body 에 추가 후 제거한다.
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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
                  <Icon icon="camera" size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                  <span style={{ fontSize: 13 }}>정상적인 사람 이미지</span>
                  <div style={{ position: 'absolute', top: 40, left: 64, width: 96, height: 128, border: '2px solid #0d8050', background: 'rgba(13,128,80,0.1)' }} />
                  <span style={{ position: 'absolute', top: 24, left: 64, background: 'var(--bp-success)', color: '#fff', fontSize: 10, padding: '1px 4px', fontWeight: 700 }}>Person: 98%</span>
                </div>
              </div>
              <div className="evidence-panel danger">
                <div className="evidence-header">
                  <Icon icon="warning-sign" size={12} style={{ marginRight: 4 }} />
                  적대적 데이터 (탐지 회피)
                </div>
                <div className="evidence-body">
                  <Icon icon="camera" size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                  <span style={{ fontSize: 13 }}>적대적 패치 부착 이미지</span>
                  <div style={{ position: 'absolute', top: 80, left: 80, width: 32, height: 32, background: 'linear-gradient(135deg, #7157d9, #cd4246, #d9822b)', borderRadius: 4 }} />
                  <div style={{ position: 'absolute', bottom: 8, right: 8, fontSize: 11, fontWeight: 700, color: 'var(--bp-danger)', background: 'rgba(205,66,70,0.1)', padding: '2px 8px', borderRadius: 3, border: '1px solid rgba(205,66,70,0.2)' }}>
                    객체 탐지 실패 (0건)
                  </div>
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
