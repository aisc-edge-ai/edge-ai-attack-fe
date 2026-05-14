import { Text, View } from '@react-pdf/renderer';
import type { AttackResult } from '@/types';
import { COLORS, styles } from '../styles';

interface MtcAccuracyCardsPdfProps {
  inference: NonNullable<AttackResult['inferenceAccuracy']>;
}

/**
 * MTC (Model Type Classification) 의 3카드 정확도 표시.
 * Baseline (probability only) / Blackbox (+Feature1) / Graybox (+Feature1+Feature2).
 * Graybox 가 가장 강한 위험 — danger 색 강조.
 */
export function MtcAccuracyCardsPdf({ inference }: MtcAccuracyCardsPdfProps) {
  const cards = [
    {
      label: '모델 확률 기반 추론 정확도 (Baseline)',
      value: `${inference.baseline}%`,
      color: COLORS.textPrimary,
    },
    {
      label: 'Black box 기반 추론 정확도 (+Feature1)',
      value: `${inference.blackbox}%`,
      color: COLORS.warning,
    },
    {
      label: 'Gray box 기반 추론 정확도 (+Feature1+Feature2)',
      value: `${inference.graybox}%`,
      color: COLORS.danger,
    },
  ];

  return (
    <View style={styles.metricStrip}>
      {cards.map((c) => (
        <View key={c.label} style={styles.mtcCard}>
          <Text style={styles.mtcCardLabel}>{c.label}</Text>
          <Text style={[styles.mtcCardValue, { color: c.color }]}>
            {c.value}
          </Text>
        </View>
      ))}
    </View>
  );
}
