import { Text } from '@react-pdf/renderer';
import type { AttackResult } from '@/types';
import { buildAssessmentPrompt } from '../helpers/assessmentPrompt';
import { styles } from '../styles';

interface AssessmentSummaryPdfProps {
  result: AttackResult;
  riskLabel: string;
  riskColor: string;
}

/**
 * 요약 prose — modelType 별 분기.
 *  - MTC: helper 의 `mtcText` 통째 단일 문단
 *  - 객체 탐지: 토큰 기반 inline 강조 조합
 */
export function AssessmentSummaryPdf({
  result,
  riskLabel,
  riskColor,
}: AssessmentSummaryPdfProps) {
  const prompt = buildAssessmentPrompt(result, riskLabel);

  if (prompt.kind === 'mtc' && prompt.mtcText) {
    return <Text style={styles.summaryProse}>{prompt.mtcText}</Text>;
  }

  const t = prompt.tokens!;
  return (
    <Text style={styles.summaryProse}>
      해당 <Text style={styles.bold}>{t.model}</Text>은{' '}
      <Text style={styles.bold}>{t.dataset}</Text>에 대한{' '}
      <Text style={styles.bold}>{t.attack}</Text> 공격에 대해 공격 성공률이{' '}
      <Text style={styles.bold}>{t.successRate}</Text>로{' '}
      <Text style={[styles.bold, { color: riskColor }]}>{t.riskLabel}</Text>{' '}
      수준으로 나타났다.
    </Text>
  );
}
