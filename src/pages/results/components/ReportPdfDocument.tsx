import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { RISK_LABELS, GRADE_CRITERIA, RECOMMENDATIONS } from '@/lib/risk-constants';
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

const RISK_COLORS: Record<RiskLevel, string> = {
  vulnerable: COLORS.danger,
  warning: COLORS.warning,
  safe: COLORS.success,
};

/** RISK_LABELS(공유) + RISK_COLORS(PDF 전용)를 합쳐 이전 RISK_META 역할 수행 */
const RISK_RESOLVED: Record<RiskLevel, { label: string; color: string }> = {
  vulnerable: { label: RISK_LABELS.vulnerable, color: RISK_COLORS.vulnerable },
  warning: { label: RISK_LABELS.warning, color: RISK_COLORS.warning },
  safe: { label: RISK_LABELS.safe, color: RISK_COLORS.safe },
};

/* ===========================
   StyleSheet — single A4 page, typography-first
   =========================== */
const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.white,
    color: COLORS.textPrimary,
    paddingTop: 32,
    paddingBottom: 44,
    paddingHorizontal: 36,
    fontFamily: 'Pretendard',
    fontSize: 10,
    lineHeight: 1.5,
  },

  // ─── Header strip ────────────────────────
  headerStrip: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: COLORS.border,
    paddingBottom: 6,
    marginBottom: 14,
  },
  headerLogo: {
    fontSize: 9,
    fontWeight: 700,
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  headerDate: {
    fontSize: 8,
    color: COLORS.textMuted,
  },

  // ─── Title row ───────────────────────────
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 700,
    color: COLORS.textPrimary,
    flex: 1,
    paddingRight: 12,
  },
  titleRiskTag: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 10,
    fontSize: 9,
    fontWeight: 600,
  },
  titleMetaLine: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },

  // ─── Hairline divider ────────────────────
  hairline: {
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: COLORS.border,
    marginVertical: 10,
  },

  // ─── Section label ───────────────────────
  sectionLabel: {
    fontSize: 9,
    fontWeight: 600,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },

  // ─── Summary prose ───────────────────────
  summaryProse: {
    fontSize: 11,
    lineHeight: 1.65,
    color: COLORS.textPrimary,
  },
  bold: {
    fontWeight: 700,
  },

  // ─── Metric strip (6 inline mini cards) ──
  metricStrip: {
    display: 'flex',
    flexDirection: 'row',
    gap: 6,
  },
  metricStripCard: {
    flex: 1,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.border,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  metricStripLabel: {
    fontSize: 7,
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  metricStripValue: {
    fontSize: 13,
    fontWeight: 700,
    color: COLORS.textPrimary,
  },

  // ─── 2-column body ───────────────────────
  bodyColumns: {
    display: 'flex',
    flexDirection: 'row',
    gap: 18,
  },
  bodyColumn: {
    flex: 1,
  },

  // Metadata rows (inside left column)
  metaRow: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: COLORS.border,
  },
  metaRowLast: {
    borderBottomWidth: 0,
  },
  metaKey: {
    width: 78,
    fontSize: 9,
    color: COLORS.textSecondary,
  },
  metaValue: {
    flex: 1,
    fontSize: 9,
    fontWeight: 600,
    color: COLORS.textPrimary,
  },

  // Grade rows (inside right column)
  gradeRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingVertical: 5,
  },
  gradeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
  gradeTextColumn: {
    flex: 1,
  },
  gradeLabel: {
    fontSize: 9,
    fontWeight: 500,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  gradeDesc: {
    fontSize: 9,
    lineHeight: 1.5,
    color: COLORS.textSecondary,
  },

  // ─── Recommendations (compact numbered list) ──
  recItem: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 7,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: COLORS.border,
  },
  recItemFirst: {
    borderTopWidth: 0,
    paddingTop: 2,
  },
  recNumber: {
    width: 18,
    fontSize: 9,
    fontWeight: 500,
    color: COLORS.textMuted,
  },
  recContent: {
    flex: 1,
  },
  recTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  recDesc: {
    fontSize: 9,
    lineHeight: 1.6,
    color: COLORS.textSecondary,
  },

  // ─── Footer strip (fixed) ────────────────
  footer: {
    position: 'absolute',
    left: 36,
    right: 36,
    bottom: 22,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: COLORS.border,
    paddingTop: 6,
    fontSize: 8,
    color: COLORS.textMuted,
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
   Document — single A4 page
   =========================== */
interface ReportPdfDocumentProps {
  result: AttackResult;
}

export function ReportPdfDocument({ result }: ReportPdfDocumentProps) {
  const risk = RISK_RESOLVED[result.risk];
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
      <Page size="A4" style={styles.page}>
        {/* ─── Header strip ─── */}
        <View style={styles.headerStrip}>
          <Text style={styles.headerLogo}>Edge AI 취약성 분석 리포트</Text>
          <Text style={styles.headerDate}>{generatedAt}</Text>
        </View>

        {/* ─── Title row + metadata line ─── */}
        <View style={styles.titleRow}>
          <Text style={styles.titleText}>
            {result.model} 취약성 분석 리포트
          </Text>
          <Text
            style={[
              styles.titleRiskTag,
              { borderColor: risk.color, color: risk.color },
            ]}
          >
            {risk.label}
          </Text>
        </View>
        <Text style={styles.titleMetaLine}>
          {result.attack} · {result.id} · {result.date}
        </Text>

        <View style={styles.hairline} />

        {/* ─── 요약 ─── */}
        <Text style={styles.sectionLabel}>요약</Text>
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

        <View style={styles.hairline} />

        {/* ─── 주요 지표 (6 mini cards in 1 row) ─── */}
        <Text style={styles.sectionLabel}>주요 지표</Text>
        <View style={styles.metricStrip}>
          {metrics.map((m) => (
            <View key={m.label} style={styles.metricStripCard}>
              <Text style={styles.metricStripLabel}>{m.label}</Text>
              <Text
                style={[
                  styles.metricStripValue,
                  m.danger && { color: COLORS.danger },
                ]}
              >
                {m.value}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.hairline} />

        {/* ─── 2-column body: 모델 정보 | 등급 기준 ─── */}
        <View style={styles.bodyColumns}>
          {/* Left column — 모델 정보 */}
          <View style={styles.bodyColumn}>
            <Text style={styles.sectionLabel}>모델 정보</Text>
            {metadataRows.map(([k, v], idx) => (
              <View
                key={k}
                style={[
                  styles.metaRow,
                  idx === metadataRows.length - 1 && styles.metaRowLast,
                ]}
              >
                <Text style={styles.metaKey}>{k}</Text>
                <Text style={styles.metaValue}>{v}</Text>
              </View>
            ))}
          </View>

          {/* Right column — 등급 기준 */}
          <View style={styles.bodyColumn}>
            <Text style={styles.sectionLabel}>등급 기준</Text>
            {GRADE_CRITERIA.map((g) => {
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
                        isCurrent && {
                          color: COLORS.textPrimary,
                          fontWeight: 700,
                        },
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
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.hairline} />

        {/* ─── 보안 권고사항 ─── */}
        <Text style={styles.sectionLabel}>보안 권고사항</Text>
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

        {/* ─── Footer strip (fixed at bottom) ─── */}
        <View style={styles.footer} fixed>
          <Text>AI안전성연구센터 · Confidential</Text>
          <Text>Generated {generatedAt}</Text>
        </View>
      </Page>
    </Document>
  );
}
