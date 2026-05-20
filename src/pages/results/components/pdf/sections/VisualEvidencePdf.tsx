import { Image, Text, View } from '@react-pdf/renderer';
import type { AttackResult } from '@/types';
import { isImagenetResult } from '../helpers/isImagenetResult';
import { isMtcResult } from '../helpers/isMtcResult';
import { isVoiceResult } from '../helpers/isVoiceResult';
import { COLORS, styles } from '../styles';

interface VisualEvidencePdfProps {
  result: AttackResult;
}

/**
 * Visual Evidence 섹션 — modelType 별 다른 자산 표시.
 *  - Voice: audioSamples 라벨 목록 (PDF 는 audio 임베드 불가, 웹에서 재생 안내)
 *  - MTC: confusionMatrixCombined (큰 이미지) + ROC + Val Accuracy (2-up)
 *  - 객체 탐지: patchImage + confusionMatrix
 */
export function VisualEvidencePdf({ result }: VisualEvidencePdfProps) {
  const evidence = result.detail?.visualEvidence;
  if (!evidence) return null;

  if (isVoiceResult(result)) {
    return <VoiceEvidence evidence={evidence} />;
  }
  if (isMtcResult(result)) {
    return <MtcEvidence evidence={evidence} />;
  }
  if (isImagenetResult(result)) {
    return <ImageNetEvidence evidence={evidence} />;
  }
  return <DetectionEvidence evidence={evidence} />;
}

function VoiceEvidence({ evidence }: { evidence: Evidence }) {
  const samples = evidence.audioSamples ?? [];
  const specOrig = absolutize(evidence.spectrogramOriginal);
  const specSynth = absolutize(evidence.spectrogramSynth);
  const tsne = absolutize(evidence.tsneClusterImage);

  if (samples.length === 0 && !specOrig && !specSynth && !tsne) return null;

  return (
    <View>
      {samples.length > 0 && (
        <>
          <Text style={{ fontSize: 9, color: COLORS.textSecondary, marginBottom: 6 }}>
            음성 샘플은 PDF 에 첨부할 수 없습니다. 웹 화면에서 재생 가능.
          </Text>
          <View style={[styles.evidenceGrid, { marginTop: 4 }]}>
            <View style={styles.evidenceColumn}>
              <Text style={styles.evidenceCaption}>원본 음성 (정상 화자)</Text>
              {samples
                .filter((s) => s.label.includes('원본') || s.label.includes('정상'))
                .map((s, i) => (
                  <Text
                    key={`orig-${i}`}
                    style={{ fontSize: 9, color: COLORS.textPrimary, marginTop: 3 }}
                  >
                    · {s.label}
                  </Text>
                ))}
            </View>
            <View style={styles.evidenceColumn}>
              <Text style={styles.evidenceCaption}>공격 음성 (합성)</Text>
              {samples
                .filter((s) => s.label.includes('공격') || s.label.includes('합성'))
                .map((s, i) => (
                  <Text
                    key={`attack-${i}`}
                    style={{ fontSize: 9, color: COLORS.danger, marginTop: 3 }}
                  >
                    · {s.label}
                  </Text>
                ))}
            </View>
          </View>
        </>
      )}

      {(specOrig || specSynth) && (
        <View style={[styles.evidenceGrid, { marginTop: 10 }]}>
          {specOrig && (
            <View style={styles.evidenceColumn}>
              <Text style={styles.evidenceCaption}>원본 음성 스펙트로그램</Text>
              <Image src={specOrig} style={styles.evidenceImage} />
            </View>
          )}
          {specSynth && (
            <View style={styles.evidenceColumn}>
              <Text style={styles.evidenceCaption}>공격 음성 스펙트로그램</Text>
              <Image src={specSynth} style={styles.evidenceImage} />
            </View>
          )}
        </View>
      )}

      {tsne && (
        <View style={[styles.evidenceColumn, { marginTop: 10 }]}>
          <Text style={styles.evidenceCaption}>Speaker Embedding t-SNE Clustering</Text>
          <Image src={tsne} style={styles.evidenceImageWide} />
        </View>
      )}
    </View>
  );
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

function ImageNetEvidence({ evidence }: { evidence: Evidence }) {
  const sample = evidence.sampleImages?.[0];
  const cleanUrl = absolutize(sample?.clean);
  const patchedUrl = absolutize(sample?.patched);
  const summaryPlot = absolutize(evidence.patchImage);

  if (!cleanUrl && !patchedUrl && !summaryPlot) return null;

  return (
    <View>
      {(cleanUrl || patchedUrl) && (
        <View style={styles.evidenceGrid}>
          {cleanUrl && (
            <View style={styles.evidenceColumn}>
              <Text style={styles.evidenceCaption}>원본 이미지 (정상 분류)</Text>
              <Image src={cleanUrl} style={styles.evidenceImage} />
            </View>
          )}
          {patchedUrl && (
            <View style={styles.evidenceColumn}>
              <Text style={styles.evidenceCaption}>공격 이미지 (적대적 perturbation)</Text>
              <Image src={patchedUrl} style={styles.evidenceImage} />
            </View>
          )}
        </View>
      )}
      {summaryPlot && (
        <View style={[styles.evidenceColumn, { marginTop: 10 }]}>
          <Text style={styles.evidenceCaption}>
            공격 성공률 및 SSIM 비교 (4종 공격)
          </Text>
          <Image src={summaryPlot} style={styles.evidenceImageWide} />
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
