import { Icon } from '@blueprintjs/core';
import type { AttackResult } from '@/types';

type VisualEvidence = NonNullable<AttackResult['detail']>['visualEvidence'];

interface MTCEvidenceProps {
  evidence: VisualEvidence;
}

/**
 * Model Type Classification (MTC) 의 시각 증거.
 * Prominent 좌측 영역에 4모델 × 3방법 confusion matrix 합본 이미지를 렌더링.
 * ROC curve / Validation accuracy 학습곡선은 ResultAnalysisTab 의 Visual Evidence
 * 섹션에서 별도로 표시.
 */
export function MTCEvidence({ evidence }: MTCEvidenceProps) {
  const src = evidence.confusionMatrixCombined;

  return (
    <div className="evidence-grid evidence-grid-single">
      <div className="evidence-panel">
        <div className="evidence-header">Confusion Matrix · 4모델 × 3방법</div>
        <div className="evidence-body">
          {src ? (
            <img
              src={src}
              alt="MTC confusion matrix grid"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            <>
              <Icon icon="grid-view" size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
              <span style={{ fontSize: 13 }}>Confusion matrix 이미지 없음</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
