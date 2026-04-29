import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { RiskDistribution } from '@/types';
import { DashboardSectionUnavailable } from './DashboardSectionUnavailable';

interface RiskDistributionChartProps {
  data: RiskDistribution | undefined;
  isLoading: boolean;
  isError?: boolean;
}

const SEGMENT_CONFIG = [
  { key: 'vulnerable', label: '취약 (Vulnerable)', color: '#cd4246' },
  { key: 'warning', label: '경고 (Warning)', color: '#d9822b' },
  { key: 'safe', label: '안전 (Safe)', color: '#0d8050' },
] as const;

export function RiskDistributionChart({ data, isLoading, isError }: RiskDistributionChartProps) {
  if (isLoading) {
    return <div className="bp6-skeleton" style={{ height: 240, width: '100%' }} />;
  }

  if (isError || !data) {
    return <DashboardSectionUnavailable height={240} />;
  }

  const chartData = SEGMENT_CONFIG.map((s) => ({
    name: s.label,
    value: data[s.key] ?? 0,
    color: s.color,
  }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="risk-distribution-wrapper" role="img" aria-label="위험도 분포 차트">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Tooltip
            formatter={(value, name) => {
              const num = typeof value === 'number' ? value : Number(value);
              const pct = total > 0 ? ((num / total) * 100).toFixed(1) : '0';
              return [`${num}개 (${pct}%)`, name];
            }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ fontSize: 12 }}
          />
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={56}
            outerRadius={86}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="risk-distribution-center">
        <div className="risk-distribution-total">{total}</div>
        <div className="risk-distribution-total-label">Total Models</div>
      </div>
    </div>
  );
}
