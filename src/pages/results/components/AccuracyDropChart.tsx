import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { AccuracyDropDatum } from '@/lib/result-aggregation';

const BEFORE_COLOR = '#A7B6C2';
const AFTER_COLOR = '#cd4246';
const LINE_COLOR = '#C5CBD3';
const DOT_RADIUS = 5.5;

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

  const avgDrop = dumbbellData.reduce((s, d) => s + d.drop, 0) / dumbbellData.length;
  const worstDrop = Math.max(...dumbbellData.map((d) => d.drop));
  const ariaLabel = `모델별 정확도 하락 차트: ${dumbbellData
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
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={dumbbellData}
            layout="vertical"
            margin={{ top: 8, right: 76, left: 8, bottom: 24 }}
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
      </div>
    </>
  );
}
