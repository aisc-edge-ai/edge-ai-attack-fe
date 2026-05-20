import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Tab, Tag } from '@blueprintjs/core';
import { ResultSummaryTab } from './components/ResultSummaryTab';
import { ResultAnalysisTab } from './components/ResultAnalysisTab';
import { useResultById } from '@/hooks/useResults';
import type { AttackResult } from '@/types';

export function ResultsPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(id ? 'analysis' : 'summary');
  const [selectedResult, setSelectedResult] = useState<AttackResult | null>(null);
  const detailId = activeTab === 'analysis' ? id ?? selectedResult?.id ?? null : null;
  const {
    data: detailResult,
    isLoading: isDetailLoading,
    isError: isDetailError,
    refetch: refetchDetail,
  } = useResultById(detailId);
  const analysisResult = detailResult ?? selectedResult;

  const handleViewAnalysis = (result: AttackResult) => {
    setSelectedResult(result);
    setActiveTab('analysis');
  };

  // 탭 전환 또는 선택된 결과 변경 시 스크롤을 맨 위로 — 두 탭이 공유하는
  // `.results-tab-content` 의 scrollTop 이 유지되어 새 콘텐츠가 중간부터
  // 보이는 문제 방지.
  const tabContentRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    tabContentRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeTab, selectedResult?.id]);

  return (
    <div className="results-page-layout">
      <div className="results-tab-bar">
        <Tabs
          id="results-tabs"
          selectedTabId={activeTab}
          onChange={(newTabId) => setActiveTab(newTabId as string)}
          large
        >
          <Tab id="summary" title="공격 결과 요약" />
          <Tab id="analysis" title={
            <span>
              상세 결과 분석
              {analysisResult && <Tag intent="primary" minimal round style={{ marginLeft: 8 }}>선택됨</Tag>}
            </span>
          } />
        </Tabs>
      </div>

      <div className="results-tab-content" ref={tabContentRef}>
        {activeTab === 'summary' && <ResultSummaryTab onViewAnalysis={handleViewAnalysis} />}
        {activeTab === 'analysis' && (
          <ResultAnalysisTab
            selectedResult={analysisResult}
            isLoading={isDetailLoading}
            isError={isDetailError}
            onRetry={() => void refetchDetail()}
            onGoBack={() => setActiveTab('summary')}
          />
        )}
      </div>
    </div>
  );
}
