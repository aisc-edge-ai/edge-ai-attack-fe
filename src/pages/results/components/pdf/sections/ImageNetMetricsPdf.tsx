import { Text, View } from '@react-pdf/renderer';
import type { AttackResult } from '@/types';
import { COLORS, styles } from '../styles';

interface ImageNetMetricsPdfProps {
  result: AttackResult;
}

export function ImageNetMetricsPdf({ result }: ImageNetMetricsPdfProps) {
  const patched = result.detail?.metrics?.patched ?? {};

  const asrPct =
    typeof patched.ASR === 'number'
      ? `${(patched.ASR * 100).toFixed(2)}%`
      : (result.attackSuccessRate ?? result.successRate);
  const l0 = typeof patched.L0 === 'number' ? patched.L0.toLocaleString() : '-';
  const l2 = typeof patched.L2 === 'number' ? patched.L2.toFixed(3) : '-';
  const ssim = typeof patched.SSIM === 'number' ? patched.SSIM.toFixed(4) : '-';
  const n = typeof patched.n === 'number' ? patched.n.toLocaleString() : '-';

  const metrics = [
    { label: 'ASR', value: asrPct, danger: true },
    { label: 'L0', value: l0, danger: false },
    { label: 'L2', value: l2, danger: false },
    { label: 'SSIM', value: ssim, danger: false },
    { label: 'n', value: n, danger: false },
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
