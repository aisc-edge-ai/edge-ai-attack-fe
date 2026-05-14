import { Font, StyleSheet } from '@react-pdf/renderer';
import { RISK_LABELS } from '@/lib/risk-constants';
import type { RiskLevel } from '@/types';

/* ===========================
   Font — Pretendard from jsDelivr CDN
   PDF 모든 sub-section 공유. 새 modelType 추가 시 이 파일 손대지 않음.
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
   =========================== */
export const COLORS = {
  white: '#FFFFFF',
  textPrimary: '#182026',
  textSecondary: '#5F6B7C',
  textMuted: '#A7B6C2',
  border: '#E1E5EB',
  primary: '#2D72D2',
  danger: '#AC2F33',
  warning: '#D9822B',
  success: '#0D8050',
} as const;

const RISK_COLORS: Record<RiskLevel, string> = {
  vulnerable: COLORS.danger,
  warning: COLORS.warning,
  safe: COLORS.success,
};

export const RISK_RESOLVED: Record<RiskLevel, { label: string; color: string }> = {
  vulnerable: { label: RISK_LABELS.vulnerable, color: RISK_COLORS.vulnerable },
  warning: { label: RISK_LABELS.warning, color: RISK_COLORS.warning },
  safe: { label: RISK_LABELS.safe, color: RISK_COLORS.safe },
};

/* ===========================
   StyleSheet — PDF 전체 공유
   =========================== */
export const styles = StyleSheet.create({
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

  // ─── Metric strip (mini cards) ───────────
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
    textAlign: 'center',
  },
  metricStripValue: {
    fontSize: 13,
    fontWeight: 700,
    color: COLORS.textPrimary,
  },

  // ─── MTC-variant accuracy cards (3 cards, larger) ───
  mtcCard: {
    flex: 1,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.border,
    borderRadius: 3,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  mtcCardLabel: {
    fontSize: 8,
    fontWeight: 700,
    color: COLORS.textPrimary,
    marginBottom: 6,
    lineHeight: 1.4,
  },
  mtcCardValue: {
    fontSize: 22,
    fontWeight: 700,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
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

  // Metadata rows
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

  // Grade rows
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

  // Recommendations
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

  // ─── Visual Evidence ─────────────────────
  evidenceGrid: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  evidenceColumn: {
    flex: 1,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: COLORS.border,
    borderRadius: 3,
    padding: 6,
  },
  evidenceCaption: {
    fontSize: 8,
    color: COLORS.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  evidenceImage: {
    width: '100%',
    height: 140,
    objectFit: 'contain',
  },
  evidenceImageWide: {
    width: '100%',
    height: 160,
    objectFit: 'contain',
    marginBottom: 6,
  },

  // ─── Footer ──────────────────────────────
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
