import { useState } from 'react';
import { useResults, useResultSummary } from '@/hooks/useResults';
import { ResultKpiCards } from './ResultKpiCards';
import { FilterBar } from './FilterBar';
import { SuccessRateChart } from './SuccessRateChart';
import { AccuracyDropChart } from './AccuracyDropChart';
import { ResultLogTable } from './ResultLogTable';
import type { AttackResult } from '@/types';

interface ResultSummaryTabProps {
  onViewAnalysis: (result: AttackResult) => void;
}

export function ResultSummaryTab({ onViewAnalysis }: ResultSummaryTabProps) {
  const [modelFilter, setModelFilter] = useState('all');
  const [attackFilter, setAttackFilter] = useState('all');
  const [search, setSearch] = useState('');

  const { data: summary, isLoading: summaryLoading } = useResultSummary();
  const { data: resultsData, isLoading: resultsLoading } = useResults({
    model: modelFilter !== 'all' ? modelFilter : undefined,
    attack: attackFilter !== 'all' ? attackFilter : undefined,
    search: search || undefined,
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <FilterBar
        modelFilter={modelFilter}
        attackFilter={attackFilter}
        search={search}
        onModelChange={setModelFilter}
        onAttackChange={setAttackFilter}
        onSearchChange={setSearch}
      />

      <ResultKpiCards summary={summary} isLoading={summaryLoading} />

      <div className="charts-grid">
        <SuccessRateChart />
        <AccuracyDropChart />
      </div>

      <ResultLogTable
        results={resultsData?.data ?? []}
        isLoading={resultsLoading}
        onViewAnalysis={onViewAnalysis}
      />
    </div>
  );
}
