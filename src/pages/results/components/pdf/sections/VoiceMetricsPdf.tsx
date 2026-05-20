import { Text, View } from '@react-pdf/renderer';
import type { AttackResult } from '@/types';
import { COLORS, styles } from '../styles';

interface VoiceMetricsPdfProps {
  result: AttackResult;
}

/**
 * DeepVoice (음성 인식 공격) 의 4카드 metric strip.
 *  - 원본 인식률 (clean.accuracy) : summary_results_raw.csv 의 ASR% / 100
 *  - 합성 인식률 (patched.ASR)    : summary_results_<synth>.csv 의 ASR% / 100
 *  - 공격 성공 개수 (patched.total_accept)
 *  - 공격 전체 개수 (patched.total_trials)
 */
export function VoiceMetricsPdf({ result }: VoiceMetricsPdfProps) {
  const clean = result.detail?.metrics?.clean ?? {};
  const patched = result.detail?.metrics?.patched ?? {};

  const cleanAccPct =
    typeof clean.accuracy === 'number' ? `${(clean.accuracy * 100).toFixed(2)}%` : '-';
  const asrPct =
    typeof patched.ASR === 'number'
      ? `${(patched.ASR * 100).toFixed(2)}%`
      : (result.attackSuccessRate ?? result.successRate);
  const totalAcceptLabel =
    typeof patched.total_accept === 'number' ? patched.total_accept.toLocaleString() : '-';
  const totalTrialsLabel =
    typeof patched.total_trials === 'number' ? patched.total_trials.toLocaleString() : '-';

  const cards = [
    {
      label: '원본 인식률 (정상 화자 통과)',
      value: cleanAccPct,
      color: COLORS.textPrimary,
    },
    {
      label: '합성 인식률 (Attack Success Rate)',
      value: asrPct,
      color: COLORS.danger,
    },
    {
      label: '공격 성공 개수 (Total Accept)',
      value: totalAcceptLabel,
      color: COLORS.danger,
    },
    {
      label: '공격 전체 개수 (Total Trials)',
      value: totalTrialsLabel,
      color: COLORS.textPrimary,
    },
  ];

  return (
    <View style={styles.metricStrip}>
      {cards.map((c) => (
        <View key={c.label} style={styles.mtcCard}>
          <Text style={styles.mtcCardLabel}>{c.label}</Text>
          <Text style={[styles.mtcCardValue, { color: c.color }]}>{c.value}</Text>
        </View>
      ))}
    </View>
  );
}
