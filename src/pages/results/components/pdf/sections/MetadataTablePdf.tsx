import { Text, View } from '@react-pdf/renderer';
import type { AttackResult } from '@/types';
import { buildMetadataRows } from '../helpers/metadataRows';
import { styles } from '../styles';

interface MetadataTablePdfProps {
  result: AttackResult;
}

/**
 * 모델 정보 메타데이터 테이블 — `buildMetadataRows` 의 결과를 렌더링.
 * modelType 별 row 구성은 helper 가 결정 (이 컴포넌트는 layout 만).
 */
export function MetadataTablePdf({ result }: MetadataTablePdfProps) {
  const rows = buildMetadataRows(result);

  return (
    <>
      {rows.map(([k, v], idx) => (
        <View
          key={k}
          style={[
            styles.metaRow,
            idx === rows.length - 1 ? styles.metaRowLast : {},
          ]}
        >
          <Text style={styles.metaKey}>{k}</Text>
          <Text style={styles.metaValue}>{v}</Text>
        </View>
      ))}
    </>
  );
}
