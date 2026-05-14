import { Image, Text, View } from '@react-pdf/renderer';
import type { AttackResult } from '@/types';
import { isMtcResult } from '../helpers/isMtcResult';
import { styles } from '../styles';

interface VisualEvidencePdfProps {
  result: AttackResult;
}

/**
 * Visual Evidence 섹션 — modelType 별 다른 이미지 set 삽입.
 *  - MTC: confusionMatrixCombined (큰 이미지) + ROC + Val Accuracy (2-up)
 *  - 객체 탐지: patchImage + confusionMatrix
 *
 * 새 modelType 추가 시 분기 한 줄만 추가. URL 은 백엔드 정적 자산(`/api/static/...`)
 * 절대 경로로 변환하여 PDF 렌더링 컨텍스트가 fetch 가능하도록.
 */
export function VisualEvidencePdf({ result }: VisualEvidencePdfProps) {
  const evidence = result.detail?.visualEvidence;
  if (!evidence) return null;

  if (isMtcResult(result)) {
    return <MtcEvidence evidence={evidence} />;
  }
  return <DetectionEvidence evidence={evidence} />;
}

type Evidence = NonNullable<NonNullable<AttackResult['detail']>['visualEvidence']>;

function MtcEvidence({ evidence }: { evidence: Evidence }) {
  const combined = absolutize(evidence.confusionMatrixCombined);
  const roc = absolutize(evidence.rocCurveComparison);
  const valAcc = absolutize(evidence.valAccuracyComparison);

  if (!combined && !roc && !valAcc) return null;

  return (
    <View>
      {combined && (
        <View style={styles.evidenceColumn}>
          <Text style={styles.evidenceCaption}>
            Confusion Matrix · 4모델 × 3방법 (Baseline / Blackbox / Graybox)
          </Text>
          <Image src={combined} style={styles.evidenceImageWide} />
        </View>
      )}
      {(roc || valAcc) && (
        <View style={[styles.evidenceGrid, { marginTop: 10 }]}>
          {roc && (
            <View style={styles.evidenceColumn}>
              <Text style={styles.evidenceCaption}>Averaged ROC Curve</Text>
              <Image src={roc} style={styles.evidenceImage} />
            </View>
          )}
          {valAcc && (
            <View style={styles.evidenceColumn}>
              <Text style={styles.evidenceCaption}>Validation Accuracy</Text>
              <Image src={valAcc} style={styles.evidenceImage} />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

function DetectionEvidence({ evidence }: { evidence: Evidence }) {
  const patch = absolutize(evidence.patchImage);
  const confusion = absolutize(evidence.confusionMatrix);

  if (!patch && !confusion) return null;

  return (
    <View style={styles.evidenceGrid}>
      {patch && (
        <View style={styles.evidenceColumn}>
          <Text style={styles.evidenceCaption}>학습된 적대적 패치</Text>
          <Image src={patch} style={styles.evidenceImage} />
        </View>
      )}
      {confusion && (
        <View style={styles.evidenceColumn}>
          <Text style={styles.evidenceCaption}>
            Confusion Matrix (패치 적용 후)
          </Text>
          <Image src={confusion} style={styles.evidenceImage} />
        </View>
      )}
    </View>
  );
}

/**
 * `/api/static/...` 같은 상대 경로를 PDF 가 fetch 가능한 절대 URL 로 변환.
 * SSR 가능성을 고려해 `window` 가드.
 */
function absolutize(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  if (typeof window === 'undefined') return url;
  return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
}
