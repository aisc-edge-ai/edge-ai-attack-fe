import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DashboardTrendPoint } from '@/types';
import { DashboardSectionUnavailable } from './DashboardSectionUnavailable';

interface AttackTrendChartProps {
  data: DashboardTrendPoint[] | undefined;
  isLoading: boolean;
  isError?: boolean;
}

const SERIES = [
  { key: 'overall', label: '전체', color: '#2d72d2', strokeWidth: 2.5 },
  { key: 'cctv', label: 'CCTV', color: '#4c90f0', strokeWidth: 1.5 },
  { key: 'voice', label: 'Voice', color: '#8abbff', strokeWidth: 1.5 },
  { key: 'autonomous', label: 'Autonomous', color: '#215db0', strokeWidth: 1.5 },
] as const;

function formatTickDate(value: string) {
  const d = new Date(value);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function AttackTrendChart({ data, isLoading, isError }: AttackTrendChartProps) {
  if (isLoading) {
    return <div className="bp6-skeleton" style={{ height: 240, width: '100%' }} />;
  }

  if (isError || !data || data.length === 0) {
    return <DashboardSectionUnavailable height={240} />;
  }

  const reduced = data.length > 14 ? data.filter((_, i) => i % Math.ceil(data.length / 14) === 0 || i === data.length - 1) : data;

  return (
    <div role="img" aria-label="공격 성공률 추이 차트">
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatTickDate}
            tick={{ fontSize: 11, fill: 'var(--bp-text-secondary)' }}
            ticks={reduced.map((d) => d.date)}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: 'var(--bp-text-secondary)' }}
            width={42}
          />
          <Tooltip
            formatter={(value, name) => [`${value}%`, name]}
            labelFormatter={(label) => `날짜: ${label}`}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} iconType="line" />
          {SERIES.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={s.strokeWidth}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
