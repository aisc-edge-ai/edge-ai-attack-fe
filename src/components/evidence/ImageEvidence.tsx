import { Icon } from '@blueprintjs/core';
import type { AttackResult } from '@/types';

type VisualEvidence = NonNullable<AttackResult['detail']>['visualEvidence'];

interface ImageEvidenceProps {
  evidence: VisualEvidence;
}

/**
 * 이미지 분류 / 객체 인식 결과의 시각 증거.
 * 좌측: clean 원본, 우측: patched 적대적 샘플 (있을 때만 렌더).
 */
export function ImageEvidence({ evidence }: ImageEvidenceProps) {
  const sample = evidence.sampleImages?.[0];

  return (
    <div className="evidence-grid">
      <div className="evidence-panel">
        <div className="evidence-header">원본 데이터 (정상 탐지)</div>
        <div className="evidence-body">
          {sample?.clean ? (
            <img
              src={sample.clean}
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
          {sample?.patched ? (
            <img
              src={sample.patched}
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
  );
}
