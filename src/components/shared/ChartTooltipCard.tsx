import { cn } from '@/lib/utils';

type RawValue = number | string;

interface TooltipPayloadEntry {
  name?: string | number;
  value?: RawValue | ReadonlyArray<RawValue>;
  color?: string;
  dataKey?: string | number;
}

interface ChartTooltipCardProps {
  // injected by Recharts when passed via `content={<ChartTooltipCard ... />}`
  active?: boolean;
  payload?: ReadonlyArray<TooltipPayloadEntry>;
  label?: string | number;
  // local props
  valueFormatter?: (value: RawValue) => string;
  labelFormatter?: (label: string | number) => string;
  hideLabel?: boolean;
  className?: string;
}

const defaultValueFormatter = (value: RawValue) => String(value);

export function ChartTooltipCard({
  active,
  payload,
  label,
  valueFormatter = defaultValueFormatter,
  labelFormatter,
  hideLabel = false,
  className,
}: ChartTooltipCardProps) {
  if (!active || !payload || payload.length === 0) return null;

  const displayLabel = !hideLabel && label !== undefined && label !== null
    ? labelFormatter
      ? labelFormatter(label)
      : String(label)
    : null;

  return (
    <div className={cn('chart-tooltip-card', className)}>
      {displayLabel && <div className="chart-tooltip-label">{displayLabel}</div>}
      {payload.map((entry, idx) => {
        const raw = (Array.isArray(entry.value) ? entry.value[0] : entry.value) as RawValue;
        const formatted = valueFormatter(raw);
        return (
          <div className="chart-tooltip-row" key={`${entry.name ?? entry.dataKey ?? idx}`}>
            <span className="chart-tooltip-row-label">
              <span
                className="chart-tooltip-row-dot"
                style={{ background: entry.color }}
              />
              {entry.name}
            </span>
            <span className="chart-tooltip-value">{formatted}</span>
          </div>
        );
      })}
    </div>
  );
}
