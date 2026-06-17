'use client';

import { cn, formatNumber } from '@/lib/utils';
import type { ChartTheme } from '@/hooks/useChartTheme';

export type MixDatum = { name: string; value: number; mw: number };
export type DemandDatum = { hour: string; demand: number };

export function mixColor(chartTheme: ChartTheme, index: number) {
  return chartTheme.palette[index % chartTheme.palette.length];
}

export function mixShare(value: number, total: number) {
  return total > 0 ? ((value / total) * 100).toFixed(1) : '0';
}

export function GridChartTooltipShell({
  title,
  accent,
  children,
  className,
}: {
  title?: string;
  accent?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn('grid-chart-tooltip', className)}
      style={accent ? ({ '--grid-tip-accent': accent } as React.CSSProperties) : undefined}
    >
      {title ? <div className="grid-chart-tooltip__title">{title}</div> : null}
      {children}
    </div>
  );
}

export function GridPieTooltip({
  active,
  payload,
  totalMw,
}: {
  active?: boolean;
  payload?: { payload?: MixDatum; fill?: string }[];
  totalMw: number;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  if (!row) return null;
  const accent = payload[0]?.fill ?? 'hsl(var(--primary))';
  const share = mixShare(row.mw, totalMw);
  return (
    <GridChartTooltipShell title={row.name} accent={accent}>
      <div className="grid-chart-tooltip__grid">
        <span className="grid-chart-tooltip__label">Capacity</span>
        <span className="grid-chart-tooltip__value">{formatNumber(row.mw)} MW</span>
        <span className="grid-chart-tooltip__label">Share</span>
        <span className="grid-chart-tooltip__value">{share}%</span>
        <span className="grid-chart-tooltip__label">Mix index</span>
        <span className="grid-chart-tooltip__value">{row.value}%</span>
      </div>
    </GridChartTooltipShell>
  );
}

export function GridBarTooltip({
  active,
  payload,
  label,
  totalMw,
}: {
  active?: boolean;
  payload?: { payload?: MixDatum; fill?: string }[];
  label?: string;
  totalMw: number;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  if (!row) return null;
  const accent = payload[0]?.fill ?? 'hsl(var(--primary))';
  const share = mixShare(row.mw, totalMw);
  return (
    <GridChartTooltipShell title={label ?? row.name} accent={accent}>
      <div className="grid-chart-tooltip__grid">
        <span className="grid-chart-tooltip__label">Installed</span>
        <span className="grid-chart-tooltip__value">{formatNumber(row.mw)} MW</span>
        <span className="grid-chart-tooltip__label">Of total</span>
        <span className="grid-chart-tooltip__value">{share}%</span>
      </div>
    </GridChartTooltipShell>
  );
}

export function GridLineTooltip({
  active,
  payload,
  label,
  accent,
}: {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string;
  accent: string;
}) {
  if (!active || !payload?.length) return null;
  const demand = Number(payload[0]?.value ?? 0);
  const gw = (demand / 1000).toFixed(2);
  return (
    <GridChartTooltipShell title={label} accent={accent}>
      <div className="grid-chart-tooltip__row">
        <span className="grid-chart-tooltip__dot grid-chart-tooltip__dot--line" />
        <span className="grid-chart-tooltip__label">Grid demand</span>
        <span className="grid-chart-tooltip__value">{formatNumber(demand)} MW</span>
      </div>
      <div className="grid-chart-tooltip__foot">{gw} GW equivalent</div>
    </GridChartTooltipShell>
  );
}

export function MixLegend({
  data,
  chartTheme,
  hoveredIndex,
  onHover,
  totalMw,
}: {
  data: MixDatum[];
  chartTheme: ChartTheme;
  hoveredIndex: number | null;
  onHover: (index: number | null) => void;
  totalMw: number;
}) {
  return (
    <div className="grid-chart-legend">
      {data.map((item, i) => {
        const color = mixColor(chartTheme, i);
        const dimmed = hoveredIndex !== null && hoveredIndex !== i;
        return (
          <button
            key={item.name}
            type="button"
            className={cn('grid-chart-legend__item', dimmed && 'grid-chart-legend__item--dim')}
            onMouseEnter={() => onHover(i)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(i)}
            onBlur={() => onHover(null)}
          >
            <span className="grid-chart-legend__swatch" style={{ backgroundColor: color }} />
            <span className="grid-chart-legend__name">{item.name}</span>
            <span className="grid-chart-legend__meta">{mixShare(item.mw, totalMw)}%</span>
            <span className="grid-chart-legend__val">{formatNumber(item.mw)}</span>
          </button>
        );
      })}
    </div>
  );
}

export function GridStatusBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  const tone =
    lower.includes('construction') || lower.includes('ongoing')
      ? 'warn'
      : lower.includes('tender') || lower.includes('planned')
        ? 'info'
        : lower.includes('operational') || lower.includes('commissioned')
          ? 'ok'
          : 'muted';

  return <span className={cn('grid-status', `grid-status--${tone}`)}>{status}</span>;
}

export function GridLoadMeter({ load }: { load: number }) {
  const tone = load > 85 ? 'high' : load > 70 ? 'mid' : 'low';
  return (
    <div className="grid-load-meter">
      <div className="grid-load-meter__head">
        <span className="grid-load-meter__label">Load factor</span>
        <span className="grid-load-meter__val">{load}%</span>
      </div>
      <div className="grid-load-meter__track">
        <div
          className={cn('grid-load-meter__fill', `grid-load-meter__fill--${tone}`)}
          style={{ width: `${load}%` }}
        />
      </div>
    </div>
  );
}

export function GridLiveBadge({ label = 'Live telemetry' }: { label?: string }) {
  return (
    <span className="grid-live-badge">
      <span className="grid-live-badge__dot" aria-hidden />
      {label}
    </span>
  );
}