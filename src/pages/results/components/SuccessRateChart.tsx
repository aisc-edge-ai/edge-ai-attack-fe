import { useState } from 'react';
import { Icon } from '@blueprintjs/core';
import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, ResponsiveContainer } from 'recharts';
import { ChartTooltipCard } from '@/components/shared/ChartTooltipCard';
import type { SuccessRateDatum } from '@/lib/result-aggregation';

const TRACK_FILL = '#E5EAEF';
const BAR_FILL = '#2d72d2';
const BAR_SIZE = 16;
const BAR_RADIUS = BAR_SIZE / 2;
/** 기본으로 노출할 상위 N 행 — 나머지는 chevron 아이콘 토글로 펼침 */
const TOP_N = 5;
/** 행 1개당 Y축 차지 높이 (BarChart 동적 height 계산용) — 위아래 spacing 확보 */
const ROW_HEIGHT_PX = 42;
/** XAxis label + 상하 padding 등 차트 자체 고정 영역 */
const CHART_PADDING_PX = 60;

interface SuccessRateChartProps {
  data: SuccessRateDatum[];
}

export function SuccessRateChart({ data }: SuccessRateChartProps) {
  const [expanded, setExpanded] = useState(false);
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

  // AVG / PEAK 는 전체 data 기준 (펼침 상태와 무관) 유지.
  const avg = data.reduce((sum, d) => sum + d.rate, 0) / data.length;
  const peak = Math.max(...data.map((d) => d.rate));

  // 성공률 내림차순 정렬 후 상위 N 만 노출 (펼치면 전체).
  const sorted = [...data].sort((a, b) => b.rate - a.rate);
  const hasMore = sorted.length > TOP_N;
  const visible = expanded || !hasMore ? sorted : sorted.slice(0, TOP_N);
  const chartHeight = Math.max(180, visible.length * ROW_HEIGHT_PX + CHART_PADDING_PX);

  const ariaLabel = `공격 기법별 성공률 차트: ${visible.map((d) => `${d.name} ${d.rate}%`).join(', ')}`;

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
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={visible}
            layout="vertical"
            margin={{ top: 8, right: 56, left: 8, bottom: 4 }}
            barCategoryGap="55%"
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
        {hasMore && (
          <div className="properties-chart-toggle-row">
            <button
              type="button"
              className="properties-chart-toggle"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-label={expanded ? '접기' : `나머지 ${sorted.length - TOP_N}개 더 보기`}
            >
              <Icon icon={expanded ? 'chevron-up' : 'chevron-down'} size={14} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
