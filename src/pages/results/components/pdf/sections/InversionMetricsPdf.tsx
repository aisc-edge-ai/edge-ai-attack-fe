import { Text, View } from '@react-pdf/renderer';
import type { AttackResult } from '@/types';
import { COLORS, styles } from '../styles';

interface InversionMetricsPdfProps {
  result: AttackResult;
}

/**
 * TrapMI Model Inversion 결과 PDF 메트릭 4 카드.
 * 웹 화면의 `InversionMetricCards` 와 동일 메트릭 매핑.
 * - detail.metrics.clean.victim_accuracy
 * - detail.metrics.patched.reconstruction_ssim
 * - detail.metrics.patched.reconstruction_mse
 * - detail.metrics.patched.attack_ce_on_reconstruction
 */
export function InversionMetricsPdf({ result }: InversionMetricsPdfProps) {
  const clean = result.detail?.metrics?.clean ?? {};
  const patched = result.detail?.metrics?.patched ?? {};

  const victimAccPct =
    typeof clean.victim_accuracy === 'number' ? `${(clean.victim_accuracy * 100).toFixed(1)}%` : '-';
  const ssimPct =
    typeof patched.reconstruction_ssim === 'number'
      ? `${(patched.reconstruction_ssim * 100).toFixed(2)}%`
      : (result.attackSuccessRate ?? result.successRate);
  const mseLabel =
    typeof patched.reconstruction_mse === 'number' ? patched.reconstruction_mse.toFixed(4) : '-';
  const ceLabel =
    typeof patched.attack_ce_on_reconstruction === 'number'
      ? patched.attack_ce_on_reconstruction.toFixed(2)
      : '-';

  const metrics = [
    { label: 'Victim Acc', value: victimAccPct, danger: false },
    { label: 'Reconstruction SSIM', value: ssimPct, danger: true },
    { label: 'Reconstruction MSE', value: mseLabel, danger: false },
    { label: 'Attack CE Loss', value: ceLabel, danger: false },
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
