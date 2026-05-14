import { Text, View } from '@react-pdf/renderer';
import { getRecommendations } from '@/lib/risk-constants';
import type { AttackResult } from '@/types';
import { styles } from '../styles';

interface RecommendationsPdfProps {
  result: AttackResult;
}

/**
 * 보안 권고사항 — `getRecommendations(modelType)` lookup 으로
 * modelType 별 권고 셋 사용 (web UI 와 동일).
 */
export function RecommendationsPdf({ result }: RecommendationsPdfProps) {
  const recommendations = getRecommendations(result.modelType);

  return (
    <>
      {recommendations.map((r, idx) => (
        <View
          key={r.num}
          style={[styles.recItem, idx === 0 ? styles.recItemFirst : {}]}
        >
          <Text style={styles.recNumber}>{r.num}</Text>
          <View style={styles.recContent}>
            <Text style={styles.recTitle}>{r.title}</Text>
            <Text style={styles.recDesc}>{r.description}</Text>
          </View>
        </View>
      ))}
    </>
  );
}
