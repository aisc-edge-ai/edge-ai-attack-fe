import type { ResultSummary } from '@/types';
import { cn } from '@/lib/utils';

interface ResultKpiCardsProps {
  summary: ResultSummary | undefined;
  isLoading: boolean;
}

const getTextValueClass = (value: string | undefined) => {
  const length = value?.length ?? 0;
  return cn(
    'prominent-value',
    'text-value',
    length > 24 && 'compact',
    length > 42 && 'dense'
  );
};

export function ResultKpiCards({ summary, isLoading }: ResultKpiCardsProps) {
  if (isLoading) {
    return (
      <div className="prominent-card">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="prominent-item">
            <div className="bp6-skeleton" style={{ height: 10, width: 100, marginBottom: 10 }} />
            <div className="bp6-skeleton" style={{ height: 30, width: 80 }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="prominent-card">
      <div className="prominent-item">
        <div className="prominent-label">Total Attacks Executed</div>
        <div className="prominent-value">
          {summary?.totalAttacks ?? 0}
        </div>
      </div>

      <div className="prominent-item">
        <div className="prominent-label">Average Vulnerability</div>
        <div className="prominent-value danger">
          {summary?.avgVulnerability ?? 0}%
        </div>
      </div>

      <div className="prominent-item">
        <div className="prominent-label">Most Vulnerable Model</div>
        <div
          className={getTextValueClass(summary?.mostVulnerableModel.name)}
          title={summary?.mostVulnerableModel.name}
        >
          {summary?.mostVulnerableModel.name ?? '-'}
        </div>
        <div className="prominent-sub">({summary?.mostVulnerableModel.rate})</div>
      </div>

      <div className="prominent-item">
        <div className="prominent-label">Critical Attack Vector</div>
        <div
          className={getTextValueClass(summary?.mostLethalAttack.name)}
          title={summary?.mostLethalAttack.name}
        >
          {summary?.mostLethalAttack.name ?? '-'}
        </div>
        <div className="prominent-sub">({summary?.mostLethalAttack.rate})</div>
      </div>
    </div>
  );
}
