import { Document, Page, Text, View } from '@react-pdf/renderer';
import type { AttackResult } from '@/types';
import { AssessmentSummaryPdf } from './sections/AssessmentSummaryPdf';
import { GradeCriteriaPdf } from './sections/GradeCriteriaPdf';
import { MetadataTablePdf } from './sections/MetadataTablePdf';
import { MetricsStripPdf } from './sections/MetricsStripPdf';
import { RecommendationsPdf } from './sections/RecommendationsPdf';
import { VisualEvidencePdf } from './sections/VisualEvidencePdf';
import { RISK_RESOLVED, styles } from './styles';

interface ReportPdfDocumentProps {
  result: AttackResult;
}

/**
 * Edge AI 취약성 분석 리포트 — 외곽(헤더/타이틀/푸터) + 섹션 라우터.
 *
 * modelType 별 본문은 각 sub-section 이 책임:
 *   - MetricsStripPdf       : 6칸 (객체 탐지) vs 3카드 (MTC) 등
 *   - MetadataTablePdf      : buildMetadataRows() 로 modelType 별 row
 *   - AssessmentSummaryPdf  : buildAssessmentPrompt() 분기
 *   - GradeCriteriaPdf      : getGradeCriteria(modelType) lookup
 *   - RecommendationsPdf    : getRecommendations(modelType) lookup
 *   - VisualEvidencePdf     : modelType 별 이미지 set
 *
 * 새 modelType 추가 시 이 파일은 손대지 않고 sub-section/helper 만 확장.
 */
export function ReportPdfDocument({ result }: ReportPdfDocumentProps) {
  const risk = RISK_RESOLVED[result.risk];
  const generatedAt = formatNow();

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
          <Text style={styles.titleText}>{result.model} 취약성 분석 리포트</Text>
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
        <AssessmentSummaryPdf
          result={result}
          riskLabel={risk.label}
          riskColor={risk.color}
        />

        <View style={styles.hairline} />

        {/* ─── 주요 지표 ─── */}
        <Text style={styles.sectionLabel}>주요 지표</Text>
        <MetricsStripPdf result={result} />

        <View style={styles.hairline} />

        {/* ─── 2-column body: 모델 정보 | 등급 기준 ─── */}
        <View style={styles.bodyColumns}>
          <View style={styles.bodyColumn}>
            <Text style={styles.sectionLabel}>모델 정보</Text>
            <MetadataTablePdf result={result} />
          </View>
          <View style={styles.bodyColumn}>
            <Text style={styles.sectionLabel}>등급 기준</Text>
            <GradeCriteriaPdf result={result} />
          </View>
        </View>

        <View style={styles.hairline} />

        {/* ─── Visual Evidence (modelType 별 이미지, 없으면 null) ─── */}
        {result.detail?.visualEvidence && (
          <>
            <Text style={styles.sectionLabel}>Visual Evidence</Text>
            <VisualEvidencePdf result={result} />
            <View style={styles.hairline} />
          </>
        )}

        {/* ─── 보안 권고사항 ─── */}
        <Text style={styles.sectionLabel}>보안 권고사항</Text>
        <RecommendationsPdf result={result} />

        {/* ─── Footer (고정) ─── */}
        <View style={styles.footer} fixed>
          <Text>AI안전성연구센터 · Confidential</Text>
          <Text>Generated {generatedAt}</Text>
        </View>
      </Page>
    </Document>
  );
}

function formatNow(): string {
  return new Date().toLocaleString('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
