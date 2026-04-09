import { Card, Elevation, Button, Icon, Tag, Intent } from '@blueprintjs/core';
import { EmptyState } from '@/components/shared/EmptyState';
import { RiskBadge } from '@/components/shared/RiskBadge';
import type { AttackResult } from '@/types';

interface ResultAnalysisTabProps {
  selectedResult: AttackResult | null;
  onGoBack: () => void;
}

export function ResultAnalysisTab({ selectedResult, onGoBack }: ResultAnalysisTabProps) {
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
          <Button icon="download" text="PDF 다운로드" outlined />
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
                  <td className="analysis-meta-key">공격 전 정확도</td>
                  <td className="analysis-meta-value primary">{selectedResult.beforeAccuracy}</td>
                </tr>
                <tr>
                  <td className="analysis-meta-key">공격 후 정확도</td>
                  <td className="analysis-meta-value danger">{selectedResult.afterAccuracy}</td>
                </tr>
                <tr>
                  <td className="analysis-meta-key">성능 저하 폭</td>
                  <td className="analysis-meta-value danger">-{drop}%p</td>
                </tr>
                <tr>
                  <td className="analysis-meta-key">타겟 모델</td>
                  <td className="analysis-meta-value">{selectedResult.model}</td>
                </tr>
                <tr>
                  <td className="analysis-meta-key">공격 기법</td>
                  <td className="analysis-meta-value">{selectedResult.attack}</td>
                </tr>
                <tr>
                  <td className="analysis-meta-key">모델 유형</td>
                  <td className="analysis-meta-value">{selectedResult.modelType}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 하단: Prominent 수치 3칸 */}
        <div className="analysis-prominent-metrics">
          <div className="prominent-item">
            <div className="prominent-label">Before Accuracy</div>
            <div className="prominent-value">{selectedResult.beforeAccuracy}</div>
          </div>
          <div className="prominent-item">
            <div className="prominent-label">After Accuracy</div>
            <div className="prominent-value danger">{selectedResult.afterAccuracy}</div>
          </div>
          <div className="prominent-item">
            <div className="prominent-label">Performance Drop</div>
            <div className="prominent-value danger">-{drop}%p</div>
          </div>
        </div>
      </div>

      {/* 🛡 Security Recommendations */}
      <div className="results-section-card">
        <div className="results-section-header">
          <Icon icon="shield" size={12} />
          <span>Security Recommendations</span>
        </div>
        <div className="recommendation-card">
          <div className="recommendation-section">
            <h6 style={{ color: 'var(--bp-danger)', marginBottom: 8 }}>취약점 발견 (Vulnerability Found)</h6>
            <p style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.9 }}>
              해당 <strong>{selectedResult.model}</strong> 모델은{' '}
              <strong>{selectedResult.attack}</strong> 공격 기법에 대해 극히 취약한 것으로
              확인되었습니다. 입력 이미지의 국소적인 픽셀 조작(패치)만으로도 모델의 Feature Map
              추출 과정에 교란이 발생하여, 높은 Confidence로 탐지되던 객체가 완전히
              무시(Hiding)되는 현상이 나타났습니다.
            </p>
          </div>
          <div className="recommendation-section">
            <h6 style={{ color: '#3dcc91', marginBottom: 8 }}>보안 권고사항 (Mitigation Strategy)</h6>
            <ul style={{ fontSize: 14, lineHeight: 1.8, opacity: 0.9, paddingLeft: 20 }}>
              <li><strong>적대적 학습 (Adversarial Training) 도입:</strong> 현재 생성된 패치 공격 데이터를 학습 데이터셋에 포함시켜 모델 재학습을 권장합니다.</li>
              <li><strong>입력 데이터 전처리 필터 적용:</strong> Edge 장비에서 추론 전, Local Spatial Smoothing 또는 JPEG 압축 기반의 노이즈 제거 필터 적용을 검토하세요.</li>
              <li><strong>모델 앙상블 (Ensemble):</strong> 단일 모델 의존도를 낮추고 다중 아키텍처 기반의 교차 검증 로직 도입이 필요합니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
