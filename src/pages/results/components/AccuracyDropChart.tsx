import { useState } from 'react';
import { Icon } from '@blueprintjs/core';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { AccuracyDropDatum } from '@/lib/result-aggregation';

const BEFORE_COLOR = '#A7B6C2';
const AFTER_COLOR = '#cd4246';
const LINE_COLOR = '#C5CBD3';
const DOT_RADIUS = 5.5;
/** 기본으로 노출할 상위 N 행 — 정확도 하락 폭이 큰 (취약한) 순서대로 */
const TOP_N = 5;
/** 행 1개당 Y축 차지 높이 — 위아래 spacing 확보 */
const ROW_HEIGHT_PX = 42;
const CHART_PADDING_PX = 60;

interface AccuracyDropChartProps {
  data: AccuracyDropDatum[];
}

// Range = [100 - before, 100 - after] so the bar visually represents the LOSS magnitude:
// left edge (smaller value) = before (less lost) → WHITE; right edge = after (more lost) → RED.
// X-axis is hidden so this re-mapping is invisible; only relative dot positions matter.
function toDumbbellData(data: AccuracyDropDatum[]) {
  return data.map((d) => ({
    ...d,
    range: [100 - d.before, 100 - d.after] as [number, number],
    drop: d.before - d.after,
  }));
}

interface DumbbellShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: { before: number; after: number; drop: number; model: string };
}

function DumbbellShape({ x = 0, y = 0, width = 0, height = 0, payload }: DumbbellShapeProps) {
  if (!payload) return null;
  const cy = y + height / 2;
  const beforeX = x;
  const afterX = x + width;
  return (
    <g>
      <line
        x1={beforeX}
        y1={cy}
        x2={afterX}
        y2={cy}
        stroke={LINE_COLOR}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <circle cx={beforeX} cy={cy} r={DOT_RADIUS} fill="#FFFFFF" stroke={BEFORE_COLOR} strokeWidth={2} />
      <circle cx={afterX} cy={cy} r={DOT_RADIUS} fill={AFTER_COLOR} />
      <text
        x={beforeX - 10}
        y={cy}
        dy="0.35em"
        textAnchor="end"
        style={{
          fontFamily: 'var(--font-sans)',
          fontVariantNumeric: 'tabular-nums lining-nums',
          fontSize: 11,
          fontWeight: 600,
          fill: 'var(--bp-text-secondary)',
        }}
      >
        {payload.before}%
      </text>
      <text
        x={afterX + 14}
        y={cy}
        dy="0.35em"
        style={{
          fontFamily: 'var(--font-sans)',
          fontVariantNumeric: 'tabular-nums lining-nums',
          fontSize: 12,
          fontWeight: 700,
          fill: 'var(--bp-danger)',
        }}
      >
        −{payload.drop}pp
      </text>
    </g>
  );
}

interface DumbbellTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: { model: string; before: number; after: number; drop: number } }>;
}

function DumbbellTooltip({ active, payload }: DumbbellTooltipProps) {
  if (!active || !payload || payload.length === 0 || !payload[0].payload) return null;
  const row = payload[0].payload;
  return (
    <div className="chart-tooltip-card">
      <div className="chart-tooltip-label">{row.model}</div>
      <div className="chart-tooltip-row">
        <span className="chart-tooltip-row-label">
          <span
            className="chart-tooltip-row-dot"
            style={{ background: '#FFFFFF', border: `2px solid ${BEFORE_COLOR}`, boxSizing: 'border-box' }}
          />
          공격 전
        </span>
        <span className="chart-tooltip-value">{row.before}%</span>
      </div>
      <div className="chart-tooltip-row">
        <span className="chart-tooltip-row-label">
          <span className="chart-tooltip-row-dot" style={{ background: AFTER_COLOR }} />
          공격 후
        </span>
        <span className="chart-tooltip-value">{row.after}%</span>
      </div>
      <div className="chart-tooltip-row chart-tooltip-row-divider">
        <span className="chart-tooltip-row-label">하락</span>
        <span className="chart-tooltip-value" style={{ color: 'var(--bp-danger)' }}>
          −{row.drop}pp
        </span>
      </div>
    </div>
  );
}

export function AccuracyDropChart({ data }: AccuracyDropChartProps) {
  const [expanded, setExpanded] = useState(false);
  const dumbbellData = toDumbbellData(data);

  if (dumbbellData.length === 0) {
    return (
      <>
        <header className="properties-chart-header">
          <span className="properties-chart-title">모델별 평균 정확도 하락</span>
        </header>
        <div className="properties-chart-body properties-chart-empty">
          <span className="bp6-text-muted">집계할 결과 데이터가 없습니다.</span>
        </div>
      </>
    );
  }

  // AVG / WORST 는 전체 데이터 기준 (펼침 상태와 무관) 유지.
  const avgDrop = dumbbellData.reduce((s, d) => s + d.drop, 0) / dumbbellData.length;
  const worstDrop = Math.max(...dumbbellData.map((d) => d.drop));

  // 정확도 하락 폭이 큰 순서 (취약 모델 우선) — 상위 N 만 노출, 펼치면 전체.
  const sorted = [...dumbbellData].sort((a, b) => b.drop - a.drop);
  const hasMore = sorted.length > TOP_N;
  const visible = expanded || !hasMore ? sorted : sorted.slice(0, TOP_N);
  const chartHeight = Math.max(180, visible.length * ROW_HEIGHT_PX + CHART_PADDING_PX);

  const ariaLabel = `모델별 정확도 하락 차트: ${visible
    .map((d) => `${d.model} ${d.before}→${d.after}%`)
    .join(', ')}`;

  return (
    <>
      <header className="properties-chart-header">
        <span className="properties-chart-title">모델별 평균 정확도 하락</span>
        <span className="properties-chart-stat">
          <span className="properties-chart-stat-label">AVG</span>
          <span className="properties-chart-stat-value">−{avgDrop.toFixed(1)}pp</span>
          <span className="properties-chart-stat-divider">·</span>
          <span className="properties-chart-stat-label">WORST</span>
          <span className="properties-chart-stat-value">−{worstDrop}pp</span>
        </span>
      </header>
      <div className="properties-chart-body" role="img" aria-label={ariaLabel}>
        <div className="dumbbell-legend">
          <span className="dumbbell-legend-item">
            <span className="dumbbell-legend-dot dumbbell-legend-before" />
            공격 전
          </span>
          <span className="dumbbell-legend-item">
            <span className="dumbbell-legend-dot dumbbell-legend-after" />
            공격 후
          </span>
        </div>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={visible}
            layout="vertical"
            margin={{ top: 8, right: 76, left: 8, bottom: 24 }}
            barCategoryGap="55%"
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(v) => `${100 - v}%`}
              tick={{ fontSize: 10, fill: 'var(--bp-text-muted)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="model"
              width={180}
              tickMargin={44}
              tick={{ fontSize: 12, fill: 'var(--bp-text-primary)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(45, 114, 210, 0.04)' }}
              content={<DumbbellTooltip />}
            />
            <Bar dataKey="range" shape={<DumbbellShape />} isAnimationActive={false} />
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
