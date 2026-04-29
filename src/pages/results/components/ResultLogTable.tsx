import { useState } from 'react';
import { HTMLTable, Button, Icon, Tag, Intent } from '@blueprintjs/core';
import { RiskBadge } from '@/components/shared/RiskBadge';
import type { AttackResult } from '@/types';

export interface ModelGroup {
  model: string;
  modelType: string;
  results: AttackResult[];
}

interface ResultLogTableProps {
  groups: ModelGroup[];
  isLoading: boolean;
  onViewAnalysis: (result: AttackResult) => void;
}

export function ResultLogTable({ groups, isLoading, onViewAnalysis }: ResultLogTableProps) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(() => new Set());

  const toggleGroup = (model: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(model)) {
        next.delete(model);
      } else {
        next.add(model);
      }
      return next;
    });
  };

  const totalResults = groups.reduce((sum, g) => sum + g.results.length, 0);

  if (isLoading) {
    return (
      <div className="results-grouped-table">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="results-group-skeleton">
            <div className="bp6-skeleton" style={{ height: 32, marginBottom: 8 }} />
            <div className="bp6-skeleton" style={{ height: 24, marginBottom: 4 }} />
            <div className="bp6-skeleton" style={{ height: 24 }} />
          </div>
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return <div className="results-empty">검색 결과가 없습니다.</div>;
  }

  return (
    <div className="results-grouped-table">
      <HTMLTable bordered interactive className="results-unified-table">
        <thead>
          <tr>
            <th style={{ width: 180 }}>로그 ID</th>
            <th style={{ width: 150 }}>일시</th>
            <th>공격 종류</th>
            <th style={{ width: 110 }}>성공률</th>
            <th style={{ width: 150 }}>위험도</th>
            <th style={{ width: 100, textAlign: 'center' }}>액션</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => {
            const isExpanded = !collapsedGroups.has(group.model);
            const vulnerableCount = group.results.filter((r) => r.risk === 'vulnerable').length;

            return (
              <GroupRows
                key={group.model}
                group={group}
                isExpanded={isExpanded}
                vulnerableCount={vulnerableCount}
                onToggle={() => toggleGroup(group.model)}
                onViewAnalysis={onViewAnalysis}
              />
            );
          })}
        </tbody>
      </HTMLTable>

      <div className="results-table-footer">
        Showing {totalResults} results in {groups.length} model groups
      </div>
    </div>
  );
}

function GroupRows({
  group,
  isExpanded,
  vulnerableCount,
  onToggle,
  onViewAnalysis,
}: {
  group: ModelGroup;
  isExpanded: boolean;
  vulnerableCount: number;
  onToggle: () => void;
  onViewAnalysis: (result: AttackResult) => void;
}) {
  return (
    <>
      {/* 그룹 헤더 행 */}
      <tr className="results-group-header-row" onClick={onToggle}>
        <td colSpan={6}>
          <div className="results-group-header-left">
            <Icon icon={isExpanded ? 'chevron-down' : 'chevron-right'} size={14} />
            <strong>{group.model}</strong>
            <span className="bp6-text-muted">({group.modelType})</span>
            <Tag minimal round>{group.results.length}건</Tag>
            {vulnerableCount > 0 && (
              <Tag intent={Intent.DANGER} minimal round>{vulnerableCount} 취약</Tag>
            )}
          </div>
        </td>
      </tr>

      {/* 데이터 행 */}
      {isExpanded && group.results.map((result) => (
        <tr key={result.id}>
          <td><code className="bp6-code">{result.id}</code></td>
          <td className="bp6-text-muted">{result.date}</td>
          <td>{result.attack}</td>
          <td><strong>{result.successRate}</strong></td>
          <td><RiskBadge risk={result.risk} /></td>
          <td style={{ textAlign: 'center' }}>
            <Button text="상세 분석" small intent={Intent.PRIMARY} minimal onClick={() => onViewAnalysis(result)} />
          </td>
        </tr>
      ))}
    </>
  );
}
