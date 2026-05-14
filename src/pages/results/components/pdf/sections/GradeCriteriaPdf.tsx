import { Text, View } from '@react-pdf/renderer';
import { getGradeCriteria } from '@/lib/risk-constants';
import type { AttackResult } from '@/types';
import { COLORS, RISK_RESOLVED, styles } from '../styles';

interface GradeCriteriaPdfProps {
  result: AttackResult;
}

/**
 * 등급 기준 — `getGradeCriteria(modelType)` lookup 으로 modelType 별
 * 다른 해석 텍스트 사용. (web UI 와 같은 lookup helper 공유)
 */
export function GradeCriteriaPdf({ result }: GradeCriteriaPdfProps) {
  const criteria = getGradeCriteria(result.modelType);

  return (
    <>
      {criteria.map((g) => {
        const isCurrent = g.risk === result.risk;
        return (
          <View key={g.risk} style={styles.gradeRow}>
            <View
              style={[
                styles.gradeDot,
                { backgroundColor: RISK_RESOLVED[g.risk].color },
              ]}
            />
            <View style={styles.gradeTextColumn}>
              <Text
                style={[
                  styles.gradeLabel,
                  isCurrent ? { color: COLORS.textPrimary, fontWeight: 700 } : {},
                ]}
              >
                {g.label}
              </Text>
              <Text
                style={[
                  styles.gradeDesc,
                  isCurrent ? { color: COLORS.textPrimary } : {},
                ]}
              >
                {g.description}
              </Text>
            </View>
          </View>
        );
      })}
    </>
  );
}
