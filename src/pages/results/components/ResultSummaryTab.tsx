import { useState, useMemo } from 'react';
import { Icon } from '@blueprintjs/core';
import { useResults, useResultSummary } from '@/hooks/useResults';
import { ResultKpiCards } from './ResultKpiCards';
import { FilterBar } from './FilterBar';
import { SuccessRateChart } from './SuccessRateChart';
import { AccuracyDropChart } from './AccuracyDropChart';
import { ResultLogTable, type ModelGroup } from './ResultLogTable';
import type { AttackResult } from '@/types';

interface ResultSummaryTabProps {
  onViewAnalysis: (result: AttackResult) => void;
}

export function ResultSummaryTab({ onViewAnalysis }: ResultSummaryTabProps) {
  const [modelFilter, setModelFilter] = useState('all');
  const [attackFilter, setAttackFilter] = useState('all');
  const [techniqueFilter, setTechniqueFilter] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const { data: summary, isLoading: summaryLoading } = useResultSummary();
  const { data: resultsData, isLoading: resultsLoading } = useResults({
    model: modelFilter !== 'all' ? modelFilter : undefined,
    attack: attackFilter !== 'all' ? attackFilter : undefined,
    search: search || undefined,
  });

  const groupedResults: ModelGroup[] = useMemo(() => {
    let results = resultsData?.data ?? [];

    // 세부 기법 필터링 (프론트엔드에서 추가 필터)
    if (techniqueFilter.length > 0) {
      results = results.filter((r) =>
        techniqueFilter.some((t) => r.attack.includes(t))
      );
    }

    const groups: Record<string, ModelGroup> = {};
    for (const r of results) {
      if (!groups[r.model]) {
        groups[r.model] = { model: r.model, modelType: r.modelType, results: [] };
      }
      groups[r.model].results.push(r);
    }
    return Object.values(groups);
  }, [resultsData, techniqueFilter]);

  return (
    <div className="results-summary-content">
      <FilterBar
        modelFilter={modelFilter}
        attackFilter={attackFilter}
        techniqueFilter={techniqueFilter}
        search={search}
        onModelChange={setModelFilter}
        onAttackChange={setAttackFilter}
        onTechniqueChange={setTechniqueFilter}
        onSearchChange={setSearch}
      />

      <div className="results-section-card">
        <div className="results-section-header">
          <Icon icon="star" size={12} />
          <span>Prominent</span>
        </div>
        <ResultKpiCards summary={summary} isLoading={summaryLoading} />
      </div>

      <div className="results-section-card">
        <div className="results-section-header">
          <Icon icon="grid-view" size={12} />
          <span>Properties</span>
        </div>
        <div className="results-charts-section">
          <div className="charts-grid">
            <SuccessRateChart />
            <AccuracyDropChart />
          </div>
        </div>
      </div>

      <div className="results-section-card">
        <div className="results-section-header">
          <Icon icon="link" size={12} />
          <span>Linked Results</span>
        </div>
        <ResultLogTable
          groups={groupedResults}
          isLoading={resultsLoading}
          onViewAnalysis={onViewAnalysis}
        />
      </div>
    </div>
  );
}
