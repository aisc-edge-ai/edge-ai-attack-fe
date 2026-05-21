import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tabs, Tab, Tag } from '@blueprintjs/core';
import { ResultSummaryTab } from './components/ResultSummaryTab';
import { ResultAnalysisTab } from './components/ResultAnalysisTab';
import { useResultById } from '@/hooks/useResults';
import type { AttackResult } from '@/types';

export function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(id ? 'analysis' : 'summary');
  const [selectedResult, setSelectedResult] = useState<AttackResult | null>(null);
  // URL 의 id 가 truthy 면 그것을 fetch, 아니면 row 클릭으로 set 된 selectedResult.id.
  // (이전에는 URL id 가 항상 우선이라 row 클릭해도 옛 상세 페이지가 노출되는 버그 존재 →
  //  handleViewAnalysis 에서 navigate 로 URL 도 같이 갱신.)
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
    // URL 동기화 — useParams 의 id 가 다음 렌더링에 자동 반영되어 detailId 가 새 ID 로 갱신.
    if (id !== result.id) {
      navigate(`/results/${result.id}`);
    }
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
