import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, ResponsiveContainer } from 'recharts';
import { ChartTooltipCard } from '@/components/shared/ChartTooltipCard';
import type { SuccessRateDatum } from '@/lib/result-aggregation';

const TRACK_FILL = '#E5EAEF';
const BAR_FILL = '#2d72d2';
const BAR_SIZE = 16;
const BAR_RADIUS = BAR_SIZE / 2;

interface SuccessRateChartProps {
  data: SuccessRateDatum[];
}

export function SuccessRateChart({ data }: SuccessRateChartProps) {
  if (data.length === 0) {
    return (
      <>
        <header className="properties-chart-header">
          <span className="properties-chart-title">공격 기법별 성공률 (취약성)</span>
        </header>
        <div className="properties-chart-body properties-chart-empty">
          <span className="bp6-text-muted">집계할 결과 데이터가 없습니다.</span>
        </div>
      </>
    );
  }

  const avg = data.reduce((sum, d) => sum + d.rate, 0) / data.length;
  const peak = Math.max(...data.map((d) => d.rate));
  const ariaLabel = `공격 기법별 성공률 차트: ${data.map((d) => `${d.name} ${d.rate}%`).join(', ')}`;

  return (
    <>
      <header className="properties-chart-header">
        <span className="properties-chart-title">공격 기법별 성공률 (취약성)</span>
        <span className="properties-chart-stat">
          <span className="properties-chart-stat-label">AVG</span>
          <span className="properties-chart-stat-value">{avg.toFixed(1)}%</span>
          <span className="properties-chart-stat-divider">·</span>
          <span className="properties-chart-stat-label">PEAK</span>
          <span className="properties-chart-stat-value">{peak}%</span>
        </span>
      </header>
      <div className="properties-chart-body" role="img" aria-label={ariaLabel}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 56, left: 8, bottom: 4 }}
            barCategoryGap="38%"
          >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{ fontSize: 12, fill: 'var(--bp-text-primary)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(45, 114, 210, 0.04)' }}
              content={<ChartTooltipCard valueFormatter={(v) => `${v}%`} />}
            />
            <Bar
              dataKey="rate"
              name="성공률"
              fill={BAR_FILL}
              barSize={BAR_SIZE}
              radius={BAR_RADIUS}
              background={{ fill: TRACK_FILL, radius: BAR_RADIUS }}
              isAnimationActive={false}
            >
              <LabelList
                dataKey="rate"
                position="right"
                offset={10}
                formatter={(value) => (value == null ? '' : `${value}%`)}
                style={{
                  fontFamily: 'Consolas, Monaco, monospace',
                  fontSize: 12,
                  fontWeight: 700,
                  fill: 'var(--bp-text-primary)',
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
