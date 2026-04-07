import { Card, Elevation, Icon } from '@blueprintjs/core';
import type { ResultSummary } from '@/types';

interface ResultKpiCardsProps {
  summary: ResultSummary | undefined;
  isLoading: boolean;
}

export function ResultKpiCards({ summary, isLoading }: ResultKpiCardsProps) {
  if (isLoading) {
    return (
      <div className="kpi-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} elevation={Elevation.ONE}>
            <div className="bp6-skeleton" style={{ height: 60 }} />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="kpi-grid">
      <Card elevation={0} style={{ padding: '16px 20px', border: '1px solid #E1E8ED', borderRadius: 3, background: '#F5F8FA' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', color: 'var(--bp-text-secondary)', textTransform: 'uppercase', marginBottom: 12 }}>
          <Icon icon="pulse" size={12} />
          <span>Total Attacks Executed</span>
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Consolas, Monaco, monospace', color: 'var(--bp-text-primary)' }}>
          {summary?.totalAttacks ?? 0}
        </div>
      </Card>

      <Card elevation={0} style={{ padding: '16px 20px', border: '1px solid #E1E8ED', borderRadius: 3 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', color: 'var(--bp-text-secondary)', textTransform: 'uppercase', marginBottom: 12 }}>
          <Icon icon="shield" size={12} intent="danger" />
          <span>System Vulnerability Avg</span>
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Consolas, Monaco, monospace', color: 'var(--bp-danger)' }}>
          {summary?.avgVulnerability ?? 0}<span style={{ fontSize: 14, marginLeft: 2, fontWeight: 500 }}>%</span>
        </div>
      </Card>

      <Card elevation={0} style={{ padding: '16px 20px', border: '1px solid #E1E8ED', borderRadius: 3 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', color: 'var(--bp-text-secondary)', textTransform: 'uppercase', marginBottom: 12 }}>
          <Icon icon="target" size={12} intent="warning" />
          <span>Most Vulnerable Model</span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--bp-text-primary)', lineHeight: 1.2 }}>
          {summary?.mostVulnerableModel.name ?? '-'}<br />
          <span style={{ fontSize: 12, fontWeight: 500, fontFamily: 'Consolas, Monaco, monospace', color: 'var(--bp-danger)', display: 'inline-block', marginTop: 4 }}>
            ({summary?.mostVulnerableModel.rate})
          </span>
        </div>
      </Card>

      <Card elevation={0} style={{ padding: '16px 20px', border: '1px solid #E1E8ED', borderRadius: 3 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', color: 'var(--bp-text-secondary)', textTransform: 'uppercase', marginBottom: 12 }}>
          <Icon icon="warning-sign" size={12} intent="warning" />
          <span>Critical Attack Vector</span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--bp-text-primary)', lineHeight: 1.2 }}>
          {summary?.mostLethalAttack.name ?? '-'}<br />
          <span style={{ fontSize: 12, fontWeight: 500, fontFamily: 'Consolas, Monaco, monospace', color: 'var(--bp-danger)', display: 'inline-block', marginTop: 4 }}>
            ({summary?.mostLethalAttack.rate})
          </span>
        </div>
      </Card>
    </div>
  );
}
