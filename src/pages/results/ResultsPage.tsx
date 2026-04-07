import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Tab, Tag } from '@blueprintjs/core';
import { ResultSummaryTab } from './components/ResultSummaryTab';
import { ResultAnalysisTab } from './components/ResultAnalysisTab';
import type { AttackResult } from '@/types';

export function ResultsPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(id ? 'analysis' : 'summary');
  const [selectedResult, setSelectedResult] = useState<AttackResult | null>(null);

  const handleViewAnalysis = (result: AttackResult) => {
    setSelectedResult(result);
    setActiveTab('analysis');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Tabs
        id="results-tabs"
        selectedTabId={activeTab}
        onChange={(newTabId) => setActiveTab(newTabId as string)}
        large
      >
        <Tab id="summary" title="공격 결과 요약" panel={
          <ResultSummaryTab onViewAnalysis={handleViewAnalysis} />
        } />
        <Tab id="analysis" title={
          <span>
            상세 결과 분석
            {selectedResult && <Tag intent="primary" minimal round style={{ marginLeft: 8 }}>선택됨</Tag>}
          </span>
        } panel={
          <ResultAnalysisTab selectedResult={selectedResult} onGoBack={() => setActiveTab('summary')} />
        } />
      </Tabs>
    </div>
  );
}
