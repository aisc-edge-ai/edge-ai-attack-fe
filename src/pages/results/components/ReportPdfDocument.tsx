import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { AttackResult, RiskLevel } from '@/types';

/* ===========================
   Font — Pretendard from jsDelivr CDN
   =========================== */
Font.register({
  family: 'Pretendard',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/public/static/alternative/Pretendard-Regular.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/public/static/alternative/Pretendard-SemiBold.ttf',
      fontWeight: 600,
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/public/static/alternative/Pretendard-Bold.ttf',
      fontWeight: 700,
    },
  ],
});

/* ===========================
   Colors — Blueprint palette as literal hex
   (mirrors src/index.css :root --bp-* tokens)
   =========================== */
const COLORS = {
  dark: '#1C2127',
  light: '#F5F8FA',
  white: '#FFFFFF',
  textPrimary: '#182026',
  textSecondary: '#5F6B7C',
  textMuted: '#A7B6C2',
  border: '#E1E5EB',
  primary: '#2D72D2', // blue3
  danger: '#AC2F33', // red2
  warning: '#D9822B',
  success: '#0D8050',
};

const RISK_META: Record<RiskLevel, { label: string; color: string }> = {
  vulnerable: { label: '취약 (Vulnerable)', color: COLORS.danger },
  warning: { label: '경고 (Warning)', color: COLORS.warning },
  safe: { label: '안전 (Safe)', color: COLORS.success },
};

/* ===========================
   Report body constants
   (복제 원본: src/pages/results/components/ResultAnalysisTab.tsx)
   =========================== */
const GRADE_CRITERIA: Array<{
  risk: RiskLevel;
  label: string;
  description: string;
}> = [
  {
    risk: 'safe',
    label: '안전 (Safe)',
    description:
      '공격 성공률이 낮으며, 모델이 입력 교란에도 불구하고 안정적으로 객체를 탐지함. 실제 환경에서 악의적인 입력에 대한 대응력이 충분한 수준으로 판단됨.',
  },
  {
    risk: 'warning',
    label: '경고 (Warning)',
    description:
      '일부 공격 조건에서 탐지 성능 저하가 확인됨. 특정 상황(패치 위치, 크기 등)에 따라 취약점이 발생할 수 있어 추가적인 방어 전략 적용이 필요함.',
  },
  {
    risk: 'vulnerable',
    label: '취약 (Vulnerable)',
    description:
      '공격 성공률이 높으며, 제한된 조건에서도 객체 탐지가 쉽게 무력화됨. 실제 서비스 환경에서 악용 가능성이 높아 즉각적인 보완 조치가 요구됨.',
  },
];

const RECOMMENDATIONS: Array<{ num: string; title: string; description: string }> = [
  {
    num: '01',
    title: '적대적 학습 (Adversarial Training)',
    description:
      'Patch 공격 데이터를 학습 데이터에 포함하여 모델 재학습 수행. 다양한 위치·크기·패턴의 공격을 반영해 모델의 강건성(robustness) 향상.',
  },
  {
    num: '02',
    title: '입력 데이터 전처리 적용',
    description:
      'Spatial Smoothing, Gaussian Blur, JPEG 압축 등 노이즈 제거 기법 적용. 공격 패치의 고주파 성분을 완화하여 공격 효과 감소.',
  },
  {
    num: '03',
    title: '이상 패턴 탐지 또는 입력 무결성 검증',
    description:
      '입력 이미지 내 비정상적인 국소 패턴이나 패치 삽입 여부를 탐지하는 절차를 추가함. 공격 의심 입력을 사전 차단하거나 별도 후처리하도록 구성하는 것이 바람직함.',
  },
];

/* ===========================
   StyleSheet
   =========================== */
const styles = StyleSheet.create({
  // ─── Cover Page ─────────────────────────
  coverPage: {
    backgroundColor: COLORS.dark,
    color: COLORS.white,
    padding: 48,
    fontFamily: 'Pretendard',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  coverHeader: {},
  coverLogo: {
    fontSize: 32,
    fontWeight: 700,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  coverSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  coverMeta: {
    marginTop: 40,
  },
  coverMetaLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
    letterSpacing: 1.2,
    marginTop: 18,
    marginBottom: 4,
  },
  coverMetaValue: {
    fontSize: 13,
    color: COLORS.white,
    fontWeight: 600,
  },
  coverStripes: {
    display: 'flex',
    flexDirection: 'row',
    gap: 6,
    marginTop: 40,
    height: 120,
  },
  stripe: {
    flex: 1,
    borderRadius: 2,
  },
  coverFooter: {
    fontSize: 9,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },

  // ─── Main Page ───────────────────────────
  mainPage: {
    backgroundColor: COLORS.white,
    color: COLORS.textPrimary,
    padding: 40,
    paddingBottom: 60,
    fontFamily: 'Pretendard',
    fontSize: 10,
    lineHeight: 1.5,
  },
  mainHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${COLORS.border}`,
    paddingBottom: 8,
    marginBottom: 18,
  },
  mainHeaderLogo: {
    fontSize: 11,
    fontWeight: 700,
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  mainHeaderDate: {
    fontSize: 9,
    color: COLORS.textSecondary,
  },

  // Title block
  reportTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  idChip: {
    backgroundColor: COLORS.light,
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 8,
    fontSize: 9,
    color: COLORS.textSecondary,
  },
  riskTag: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 10,
    fontSize: 9,
    fontWeight: 600,
  },

  // Section label (11px uppercase muted)
  sectionLabel: {
    fontSize: 9,
    fontWeight: 600,
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 8,
  },

  // Summary prose
  summaryProse: {
    fontSize: 11,
    lineHeight: 1.65,
    color: COLORS.textPrimary,
  },
  bold: {
    fontWeight: 700,
  },

  // Metrics grid — 3 cols × 2 rows
  metricsGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricCard: {
    width: '32%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.border,
    borderRadius: 3,
    padding: 10,
  },
  metricLabel: {
    fontSize: 8,
    color: COLORS.textSecondary,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 700,
    color: COLORS.textPrimary,
  },

  // Metadata table
  metadataTable: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.border,
    borderRadius: 3,
  },
  metadataRow: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: COLORS.border,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  metadataRowLast: {
    borderBottomWidth: 0,
  },
  metadataKey: {
    width: 100,
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  metadataValue: {
    flex: 1,
    fontSize: 10,
    color: COLORS.textPrimary,
    fontWeight: 600,
  },

  // Grade rows
  gradeRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 6,
  },
  gradeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 5,
  },
  gradeLabel: {
    width: 95,
    fontSize: 10,
    fontWeight: 500,
    color: COLORS.textSecondary,
  },
  gradeDesc: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.55,
    color: COLORS.textSecondary,
  },

  // Recommendations
  recItem: {
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: COLORS.border,
  },
  recItemFirst: {
    borderTopWidth: 0,
  },
  recNumber: {
    width: 20,
    fontSize: 10,
    fontWeight: 500,
    color: COLORS.textMuted,
  },
  recContent: {
    flex: 1,
  },
  recTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  recDesc: {
    fontSize: 10,
    lineHeight: 1.55,
    color: COLORS.textSecondary,
  },

  // Footer (fixed on every main page)
  footer: {
    position: 'absolute',
    left: 40,
    right: 40,
    bottom: 28,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: COLORS.textMuted,
    borderTop: `1px solid ${COLORS.border}`,
    paddingTop: 8,
  },
});

/* ===========================
   Helpers
   =========================== */
const formatNow = () =>
  new Date().toLocaleString('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

const computeApDrop = (result: AttackResult): string => {
  if (!result.beforeAP || !result.afterAP) return '-';
  const drop = parseFloat(result.beforeAP) - parseFloat(result.afterAP);
  return `-${drop.toFixed(3)}`;
};

/* ===========================
   Document
   =========================== */
interface ReportPdfDocumentProps {
  result: AttackResult;
}

export function ReportPdfDocument({ result }: ReportPdfDocumentProps) {
  const risk = RISK_META[result.risk];
  const generatedAt = formatNow();
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

  const metadataRows: Array<[string, string]> = [
    ['타겟 모델', result.model],
    ['모델 유형', result.modelType],
    ['공격 기법', result.attack],
    ['Conf Threshold', result.confThreshold?.toString() ?? '-'],
    ['Average CIoU', result.averageCIoU?.toString() ?? '-'],
    ['데이터 출처', 'clean_map_stats / patch_map_stats'],
  ];

  return (
    <Document title={`${result.id} Report`} author="AI안전성연구센터">
      {/* ─────── Page 1: Dark Cover ─────── */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverHeader}>
          <Text style={styles.coverLogo}>Edge AI Report</Text>
          <Text style={styles.coverSubtitle}>AI 보안 모의 공격 리포트</Text>
        </View>

        <View style={styles.coverMeta}>
          <Text style={styles.coverMetaLabel}>PREPARED FOR</Text>
          <Text style={styles.coverMetaValue}>AI안전성연구센터</Text>

          <Text style={styles.coverMetaLabel}>SCAN COMPLETED AT</Text>
          <Text style={styles.coverMetaValue}>{result.date}</Text>

          <Text style={styles.coverMetaLabel}>REPORT GENERATED AT</Text>
          <Text style={styles.coverMetaValue}>{generatedAt}</Text>
        </View>

        <View style={styles.coverStripes}>
          {[
            COLORS.primary,
            COLORS.danger,
            COLORS.warning,
            COLORS.success,
            COLORS.textSecondary,
          ].map((c, i) => (
            <View key={i} style={[styles.stripe, { backgroundColor: c }]} />
          ))}
        </View>

        <Text style={styles.coverFooter}>Provided by AI안전성연구센터</Text>
      </Page>

      {/* ─────── Page 2: Main Content ─────── */}
      <Page size="A4" style={styles.mainPage}>
        {/* Top header strip */}
        <View style={styles.mainHeader}>
          <Text style={styles.mainHeaderLogo}>Edge AI Report</Text>
          <Text style={styles.mainHeaderDate}>{generatedAt}</Text>
        </View>

        {/* Title + ID chip + risk tag */}
        <Text style={styles.reportTitle}>
          Report: {result.model} 취약성 분석
        </Text>
        <View style={styles.titleRow}>
          <Text style={styles.idChip}>{result.id}</Text>
          <Text
            style={[
              styles.riskTag,
              { borderColor: risk.color, color: risk.color },
            ]}
          >
            {risk.label}
          </Text>
        </View>

        {/* Summary */}
        <Text style={styles.sectionLabel}>Summary of test results</Text>
        <Text style={styles.summaryProse}>
          해당 <Text style={styles.bold}>{result.model}</Text>은{' '}
          <Text style={styles.bold}>
            {result.dataset ?? '테스트 데이터셋'}
          </Text>
          에 대한 <Text style={styles.bold}>{result.attack}</Text> 공격에 대해
          공격 성공률이{' '}
          <Text style={styles.bold}>
            {result.attackSuccessRate ?? result.successRate}
          </Text>
          로{' '}
          <Text style={[styles.bold, { color: risk.color }]}>{risk.label}</Text>{' '}
          수준으로 나타났다.
        </Text>

        {/* Data — 6 metric cards */}
        <Text style={styles.sectionLabel}>Data</Text>
        <View style={styles.metricsGrid}>
          {metrics.map((m) => (
            <View key={m.label} style={styles.metricCard}>
              <Text style={styles.metricLabel}>{m.label}</Text>
              <Text
                style={[
                  styles.metricValue,
                  m.danger && { color: COLORS.danger },
                ]}
              >
                {m.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Metadata */}
        <Text style={styles.sectionLabel}>Metadata</Text>
        <View style={styles.metadataTable}>
          {metadataRows.map(([k, v], idx) => (
            <View
              key={k}
              style={[
                styles.metadataRow,
                idx === metadataRows.length - 1 && styles.metadataRowLast,
              ]}
            >
              <Text style={styles.metadataKey}>{k}</Text>
              <Text style={styles.metadataValue}>{v}</Text>
            </View>
          ))}
        </View>

        {/* Grade criteria */}
        <Text style={styles.sectionLabel}>등급 기준 및 해석</Text>
        {GRADE_CRITERIA.map((g) => {
          const isCurrent = g.risk === result.risk;
          return (
            <View key={g.risk} style={styles.gradeRow}>
              <View
                style={[
                  styles.gradeDot,
                  { backgroundColor: RISK_META[g.risk].color },
                ]}
              />
              <Text
                style={[
                  styles.gradeLabel,
                  isCurrent && { color: COLORS.textPrimary, fontWeight: 700 },
                ]}
              >
                {g.label}
              </Text>
              <Text
                style={[
                  styles.gradeDesc,
                  isCurrent && { color: COLORS.textPrimary },
                ]}
              >
                {g.description}
              </Text>
            </View>
          );
        })}

        {/* Security Recommendations */}
        <Text style={styles.sectionLabel}>Security Recommendations</Text>
        {RECOMMENDATIONS.map((r, idx) => (
          <View
            key={r.num}
            style={[styles.recItem, idx === 0 && styles.recItemFirst]}
          >
            <Text style={styles.recNumber}>{r.num}</Text>
            <View style={styles.recContent}>
              <Text style={styles.recTitle}>{r.title}</Text>
              <Text style={styles.recDesc}>{r.description}</Text>
            </View>
          </View>
        ))}

        {/* Footer with page number */}
        <View style={styles.footer} fixed>
          <Text>Provided by AI안전성연구센터</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
