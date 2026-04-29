import { useState, useMemo } from 'react';
import { Icon } from '@blueprintjs/core';
import { useResults, useResultSummary } from '@/hooks/useResults';
import { ResultKpiCards } from './ResultKpiCards';
import { FilterBar, type FilterOption } from './FilterBar';
import { SuccessRateChart } from './SuccessRateChart';
import { AccuracyDropChart } from './AccuracyDropChart';
import { ResultLogTable, type ModelGroup } from './ResultLogTable';
import type { AttackResult } from '@/types';

interface ResultSummaryTabProps {
  onViewAnalysis: (result: AttackResult) => void;
}

const splitAttackTechniques = (attack: string): string[] =>
  attack
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

const getAttackGroup = (attack: string): FilterOption => {
  const normalized = attack.toLowerCase();

  if (normalized.includes('patch-')) {
    return { value: 'patch', label: '적대적 패치' };
  }

  if (/(fgsm|bim|pgd)/i.test(attack)) {
    return { value: 'gradient', label: 'FGSM / BIM / PGD' };
  }

  if (attack.includes('딥보이스') || normalized.includes('voice')) {
    return { value: 'voice', label: '음성 우회' };
  }

  return { value: attack, label: attack };
};

const getTechniqueLabel = (technique: string): string =>
  technique.startsWith('Patch-') ? technique.replace('Patch-', '') : technique;

const uniqueOptions = (options: FilterOption[]): FilterOption[] => {
  const seen = new Set<string>();
  return options.filter((option) => {
    if (seen.has(option.value)) return false;
    seen.add(option.value);
    return true;
  });
};

export function ResultSummaryTab({ onViewAnalysis }: ResultSummaryTabProps) {
  const [modelFilter, setModelFilter] = useState('all');
  const [attackFilter, setAttackFilter] = useState('all');
  const [techniqueFilter, setTechniqueFilter] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const { data: summary, isLoading: summaryLoading } = useResultSummary();
  const { data: resultsData, isLoading: resultsLoading } = useResults({ size: 500 });

  const allResults = useMemo(() => resultsData?.data ?? [], [resultsData]);

  const modelOptions = useMemo<FilterOption[]>(
    () => [
      { value: 'all', label: '모든 모델' },
      ...uniqueOptions(allResults.map((result) => ({
        value: result.model,
        label: result.model,
      }))),
    ],
    [allResults]
  );

  const attackOptions = useMemo<FilterOption[]>(
    () => [
      { value: 'all', label: '모든 공격 기법' },
      ...uniqueOptions(allResults.map((result) => getAttackGroup(result.attack))),
    ],
    [allResults]
  );

  const techniqueOptions = useMemo<FilterOption[]>(() => {
    if (attackFilter === 'all') return [];

    const techniques = allResults
      .filter((result) => getAttackGroup(result.attack).value === attackFilter)
      .flatMap((result) => splitAttackTechniques(result.attack))
      .map((technique) => ({
        value: technique,
        label: getTechniqueLabel(technique),
      }));

    return uniqueOptions(techniques);
  }, [allResults, attackFilter]);

  const groupedResults: ModelGroup[] = useMemo(() => {
    let results = allResults;

    if (modelFilter !== 'all') {
      results = results.filter((result) => result.model === modelFilter);
    }

    if (attackFilter !== 'all') {
      results = results.filter(
        (result) => getAttackGroup(result.attack).value === attackFilter
      );
    }

    if (techniqueFilter.length > 0) {
      results = results.filter((r) =>
        techniqueFilter.some((technique) =>
          splitAttackTechniques(r.attack).includes(technique)
        )
      );
    }

    const normalizedSearch = search.trim().toLowerCase();
    if (normalizedSearch) {
      results = results.filter((result) =>
        [
          result.id,
          result.model,
          result.modelType,
          result.attack,
          result.dataset,
        ].some((value) => value?.toLowerCase().includes(normalizedSearch))
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
  }, [allResults, modelFilter, attackFilter, techniqueFilter, search]);

  return (
    <div className="results-summary-content">
      <FilterBar
        modelFilter={modelFilter}
        attackFilter={attackFilter}
        techniqueFilter={techniqueFilter}
        search={search}
        modelOptions={modelOptions}
        attackOptions={attackOptions}
        techniqueOptions={techniqueOptions}
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
