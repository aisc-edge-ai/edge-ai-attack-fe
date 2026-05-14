import { Text, View } from '@react-pdf/renderer';
import type { AttackResult } from '@/types';
import { COLORS, styles } from '../styles';

interface DetectionMetricsPdfProps {
  result: AttackResult;
}

/**
 * 객체 탐지 (Adversarial Patch — Hiding/Altering/Creating) 의 6칸 metric strip.
 * Before/After AP, Before/After AR, AP Drop, Attack Success.
 */
export function DetectionMetricsPdf({ result }: DetectionMetricsPdfProps) {
  const apDrop = computeApDrop(result);
  const metrics = [
    { label: 'Before AP', value: result.beforeAP ?? '-', danger: false },
    { label: 'After AP', value: result.afterAP ?? '-', danger: true },
    { label: 'Before AR', value: result.beforeAR ?? '-', danger: false },
    { label: 'After AR', value: result.afterAR ?? '-', danger: true },
    { label: 'AP Drop', value: apDrop, danger: true },
    {
      label: 'Attack Success',
      value: result.attackSuccessRate ?? result.successRate,
      danger: true,
    },
  ];

  return (
    <View style={styles.metricStrip}>
      {metrics.map((m) => (
        <View key={m.label} style={styles.metricStripCard}>
          <Text style={styles.metricStripLabel}>{m.label}</Text>
          <Text
            style={[
              styles.metricStripValue,
              m.danger ? { color: COLORS.danger } : {},
            ]}
          >
            {m.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

function computeApDrop(result: AttackResult): string {
  if (!result.beforeAP || !result.afterAP) return '-';
  const drop = parseFloat(result.beforeAP) - parseFloat(result.afterAP);
  return `-${drop.toFixed(3)}`;
}
