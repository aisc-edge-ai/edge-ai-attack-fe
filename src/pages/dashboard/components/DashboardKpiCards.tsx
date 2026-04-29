import type { DashboardSummary } from '@/types';
import { cn } from '@/lib/utils';

interface DashboardKpiCardsProps {
  summary: DashboardSummary | undefined;
  isLoading: boolean;
}

interface KpiItem {
  label: string;
  value: string;
  deltaText: string | null;
  deltaTone: 'good' | 'bad' | 'neutral';
}

function formatNumber(n: number) {
  return n.toLocaleString('en-US');
}

function formatDelta(delta: number | undefined, suffix: string, isPercentPoints = false): string | null {
  if (delta === undefined || delta === null || Number.isNaN(delta)) return null;
  const sign = delta >= 0 ? '+' : '';
  const body = isPercentPoints ? `${delta.toFixed(1)}%p` : `${delta}`;
  return `${sign}${body} ${suffix}`;
}

function buildItems(s: DashboardSummary): KpiItem[] {
  const successDelta = s.successRateDelta;
  return [
    {
      label: 'Models Validated',
      value: formatNumber(s.totalModels ?? 0),
      deltaText: formatDelta(s.modelsDelta, 'this month'),
      deltaTone: (s.modelsDelta ?? 0) > 0 ? 'good' : 'neutral',
    },
    {
      label: 'Total Attack Runs',
      value: formatNumber(s.totalAttacks ?? 0),
      deltaText: formatDelta(s.attacksDelta, 'this week'),
      deltaTone: 'neutral',
    },
    {
      label: 'Avg. Attack Success Rate',
      value: `${(s.avgSuccessRate ?? 0).toFixed(1)}%`,
      deltaText: formatDelta(successDelta, 'vs. last month', true),
      // 성공률이 떨어지면 보안 개선 → good
      deltaTone:
        successDelta === undefined
          ? 'neutral'
          : successDelta < 0
          ? 'good'
          : successDelta > 0
          ? 'bad'
          : 'neutral',
    },
    {
      label: 'Safety Verified',
      value: formatNumber(s.safetyVerified ?? 0),
      deltaText: formatDelta(s.safetyVerifiedDelta, 'this week'),
      deltaTone: (s.safetyVerifiedDelta ?? 0) > 0 ? 'good' : 'neutral',
    },
  ];
}

export function DashboardKpiCards({ summary, isLoading }: DashboardKpiCardsProps) {
  if (isLoading || !summary) {
    return (
      <div className="prominent-card">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="prominent-item">
            <div className="bp6-skeleton" style={{ height: 10, width: 100, marginBottom: 10 }} />
            <div className="bp6-skeleton" style={{ height: 30, width: 80, marginBottom: 6 }} />
            <div className="bp6-skeleton" style={{ height: 10, width: 110 }} />
          </div>
        ))}
      </div>
    );
  }

  const items = buildItems(summary);

  return (
    <div className="prominent-card">
      {items.map((item) => (
        <div key={item.label} className="prominent-item">
          <div className="prominent-label">{item.label}</div>
          <div className="prominent-value">{item.value}</div>
          {item.deltaText && (
            <div className={cn('dashboard-kpi-delta', item.deltaTone)}>{item.deltaText}</div>
          )}
        </div>
      ))}
    </div>
  );
}
