'use client';

import { useEffect, useId, useState } from 'react';
import Link from 'next/link';
import {
  Zap, Activity, Cable, TrendingUp, FileText, BarChart3, MapPin,
} from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, Line, CartesianGrid, Area, ComposedChart,
} from 'recharts';
import { cn, formatNumber } from '@/lib/utils';
import { useChartTheme } from '@/hooks/useChartTheme';
import {
  GridBarTooltip,
  GridLineTooltip,
  GridLiveBadge,
  GridLoadMeter,
  GridPieTooltip,
  GridStatusBadge,
  MixLegend,
  mixColor,
  type MixDatum,
} from '@/components/news/PowerGridChartUI';

const defaultMix: MixDatum[] = [
  { name: 'Gas (CCGT + GT)', value: 52, mw: 14780 },
  { name: 'Coal', value: 18, mw: 5110 },
  { name: 'HFO / Diesel', value: 12, mw: 3410 },
  { name: 'Hydro', value: 2, mw: 570 },
  { name: 'Solar + Wind', value: 5, mw: 1420 },
  { name: 'Imports', value: 8, mw: 2270 },
  { name: 'Nuclear (Rooppur-1)', value: 3, mw: 850 },
];

const defaultLines = [
  { name: '400 kV Patuakhali–Gopalganj', status: 'Commissioned', capacity: '1800 MW', owner: 'PGCB', load: 74 },
  { name: '400 kV Rooppur–Baghabari', status: 'Under Construction', capacity: '2400 MW', owner: 'PGCB', load: 0 },
  { name: '230 kV Barisal–Khulna', status: 'Commissioned', capacity: '650 MW', owner: 'PGCB', load: 82 },
  { name: '400 kV Bheramara HVDC (India)', status: 'Operational', capacity: '1000 MW', owner: 'PGCB/POWERGRID', load: 90 },
];

const demandData = [
  { hour: '00:00', demand: 9200 }, { hour: '06:00', demand: 10800 },
  { hour: '09:00', demand: 14200 }, { hour: '12:00', demand: 16500 },
  { hour: '15:00', demand: 15800 }, { hour: '18:00', demand: 17200 },
  { hour: '21:00', demand: 14900 }, { hour: '24:00', demand: 10300 },
];

const defaultProjects = [
  { name: 'SREDA 1800 MW Solar+Wind', status: 'Tender', mw: '1800', date: 'Q3 2026' },
  { name: 'Matarbari Phase-2 Coal', status: 'Construction', mw: '1200', date: '2027' },
  { name: 'Payra 1320 MW Expansion', status: 'Planned', mw: '1320', date: '2028' },
  { name: 'BREB 500k SHS + Mini-grid', status: 'Ongoing', mw: '—', date: '2026-27' },
];

interface PowerGridExplorerProps {
  initialMix?: MixDatum[];
  initialLines?: typeof defaultLines;
  initialProjects?: typeof defaultProjects;
}

const KPI_STRIP = [
  { label: 'Installed Capacity', valKey: 'capacity' as const, icon: Zap, hint: 'Nameplate across fuel types' },
  { label: 'Today Peak Demand', val: '17.2 GW', icon: Activity, hint: 'SCADA peak for current day' },
  { label: 'Renewables Online', valKey: 'renewables' as const, icon: Zap, hint: 'Solar, wind & hydro online' },
  { label: 'Transmission (400kV+)', val: '4,850 km', icon: Cable, hint: 'National backbone length' },
  { label: 'Reserve Margin', val: '11.4%', icon: TrendingUp, hint: 'Available headroom vs peak' },
];

export function PowerGridExplorer({ initialMix, initialLines, initialProjects }: PowerGridExplorerProps) {
  const chartTheme = useChartTheme();
  const gradientId = useId().replace(/:/g, '');
  const [activeTab, setActiveTab] = useState<'overview' | 'mix' | 'grid' | 'demand' | 'projects'>('overview');
  const [chartsReady, setChartsReady] = useState(false);
  const [hoveredMixIndex, setHoveredMixIndex] = useState<number | null>(null);

  useEffect(() => {
    setChartsReady(true);
  }, []);

  const generationMix = Array.isArray(initialMix) && initialMix.length ? initialMix : defaultMix;
  const transmissionLines = Array.isArray(initialLines) && initialLines.length ? initialLines : defaultLines;
  const projects = Array.isArray(initialProjects) && initialProjects.length ? initialProjects : defaultProjects;

  const totalCapacityMw = generationMix.reduce((sum, item) => sum + item.mw, 0);
  const totalCapacityGw = (totalCapacityMw / 1000).toFixed(1);
  const renewablesMw = generationMix.find((item) => item.name.toLowerCase().includes('solar'))?.mw || 1420;
  const renewablesGw = (renewablesMw / 1000).toFixed(2);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'mix', label: 'Generation Mix', icon: Zap },
    { id: 'grid', label: 'Transmission', icon: Cable },
    { id: 'demand', label: 'Demand Trends', icon: Activity },
    { id: 'projects', label: 'Major Projects', icon: FileText },
  ] as const;

  const axisProps = {
    axisLine: false as const,
    tickLine: false as const,
  };

  return (
    <div className="grid-explorer">
      <div className="grid-explorer-kpi-strip">
        {KPI_STRIP.map((k, i) => {
          const val =
            k.valKey === 'capacity'
              ? `${totalCapacityGw} GW`
              : k.valKey === 'renewables'
                ? `${renewablesGw} GW`
                : k.val;
          return (
            <div key={i} className="grid-explorer-kpi stat" title={k.hint}>
              <k.icon className="grid-explorer-kpi__icon" />
              <div className="min-w-0">
                <div className="grid-explorer-kpi__label">{k.label}</div>
                <div className="grid-explorer-kpi__value">{val}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid-explorer-tabs" role="tablist" aria-label="Grid data views">
        {tabs.map((t) => {
          const TabIcon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(t.id)}
              className={cn('explorer-tab', active && 'active')}
            >
              <TabIcon className="h-4 w-4 shrink-0" />
              {t.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'overview' && (
        <div className="grid-explorer-panel grid lg:grid-cols-2 gap-6">
          <div className="grid-explorer-chart-card card">
            <div className="grid-explorer-chart-card__head">
              <div>
                <h3 className="grid-explorer-chart-card__title">Generation Mix Snapshot</h3>
                <p className="grid-explorer-chart-card__sub">Installed capacity share by fuel source</p>
              </div>
              <span className="grid-explorer-chip">Current feed</span>
            </div>

            <div className="grid-explorer-mix-stack" aria-hidden>
              {generationMix.map((item, i) => {
                const width = totalCapacityMw > 0 ? (item.mw / totalCapacityMw) * 100 : 0;
                const dimmed = hoveredMixIndex !== null && hoveredMixIndex !== i;
                return (
                  <div
                    key={item.name}
                    className={cn('grid-explorer-mix-stack__seg', dimmed && 'grid-explorer-mix-stack__seg--dim')}
                    style={{ width: `${width}%`, backgroundColor: mixColor(chartTheme, i) }}
                  />
                );
              })}
            </div>

            <div className="grid-explorer-donut-wrap">
              {chartsReady ? (
                <ResponsiveContainer width="100%" height="100%" minHeight={220}>
                  <PieChart>
                    <Pie
                      data={generationMix}
                      dataKey="mw"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius="54%"
                      outerRadius="82%"
                      paddingAngle={2}
                      cornerRadius={4}
                      stroke="hsl(var(--card))"
                      strokeWidth={2}
                      onMouseEnter={(_, i) => setHoveredMixIndex(i)}
                      onMouseLeave={() => setHoveredMixIndex(null)}
                    >
                      {generationMix.map((_, idx) => {
                        const dimmed = hoveredMixIndex !== null && hoveredMixIndex !== idx;
                        return (
                          <Cell
                            key={idx}
                            fill={mixColor(chartTheme, idx)}
                            fillOpacity={dimmed ? 0.3 : 1}
                            style={{ transition: 'fill-opacity 200ms ease' }}
                          />
                        );
                      })}
                    </Pie>
                    <Tooltip
                      content={<GridPieTooltip totalMw={totalCapacityMw} />}
                      wrapperStyle={{ outline: 'none', zIndex: 20 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="grid-explorer-skeleton" />
              )}
              <div className="grid-explorer-donut-center">
                <span className="grid-explorer-donut-total">{totalCapacityGw}</span>
                <span className="grid-explorer-donut-label">GW total</span>
              </div>
            </div>

            <MixLegend
              data={generationMix}
              chartTheme={chartTheme}
              hoveredIndex={hoveredMixIndex}
              onHover={setHoveredMixIndex}
              totalMw={totalCapacityMw}
            />
          </div>

          <div className="grid-explorer-chart-card card">
            <div className="grid-explorer-chart-card__head">
              <div>
                <h3 className="grid-explorer-chart-card__title">Key Transmission Corridors</h3>
                <p className="grid-explorer-chart-card__sub">Highest-load backbone segments right now</p>
              </div>
              <GridLiveBadge />
            </div>

            <div className="grid-explorer-corridors">
              {transmissionLines.slice(0, 3).map((l, i) => {
                const isUnderConstruction = l.status.toLowerCase().includes('construction');
                return (
                  <div key={i} className="grid-explorer-corridor">
                    <div className="grid-explorer-corridor__head">
                      <div className="min-w-0">
                        <div className="grid-explorer-corridor__name">
                          <Cable className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          <span className="truncate">{l.name}</span>
                        </div>
                        <div className="grid-explorer-corridor__meta">{l.owner} · {l.capacity}</div>
                      </div>
                      <GridStatusBadge status={l.status} />
                    </div>
                    {isUnderConstruction ? (
                      <div className="grid-explorer-corridor__pending">
                        <span>Expected commissioning</span>
                        <span className="font-semibold text-foreground">Q4 2026</span>
                      </div>
                    ) : (
                      <GridLoadMeter load={l.load} />
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className="grid-explorer-link"
              onClick={() => setActiveTab('grid')}
            >
              View full transmission status →
            </button>
          </div>
        </div>
      )}

      {activeTab === 'mix' && (
        <div className="grid-explorer-chart-card card">
          <div className="grid-explorer-chart-card__head">
            <div>
              <h3 className="grid-explorer-chart-card__title">Installed Capacity by Fuel — June 2026</h3>
              <p className="grid-explorer-chart-card__sub">Source: BPDB Generation Report</p>
            </div>
            <span className="grid-explorer-chip">Total {totalCapacityGw} GW</span>
          </div>

          <div className="grid-explorer-chart-area grid-explorer-chart-area--lg">
            {chartsReady ? (
              <ResponsiveContainer width="100%" height="100%" minHeight={320}>
                <BarChart data={generationMix} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 6" stroke={chartTheme.gridStroke} opacity={0.45} vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: chartTheme.axisTick }}
                    interval={0}
                    angle={-18}
                    textAnchor="end"
                    height={56}
                    {...axisProps}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: chartTheme.axisTick }}
                    width={42}
                    tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
                    {...axisProps}
                  />
                  <Tooltip
                    content={<GridBarTooltip totalMw={totalCapacityMw} />}
                    cursor={{ fill: chartTheme.hoverFill, radius: 8 }}
                    wrapperStyle={{ outline: 'none', zIndex: 20 }}
                  />
                  <Bar dataKey="mw" radius={[6, 6, 0, 0]} maxBarSize={48} activeBar={{ fillOpacity: 0.88 }}>
                    {generationMix.map((_, idx) => (
                      <Cell key={idx} fill={mixColor(chartTheme, idx)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="grid-explorer-skeleton" />
            )}
          </div>

          <div className="grid-explorer-fuel-grid">
            {generationMix.map((g, idx) => (
              <div key={g.name} className="grid-explorer-fuel-tile">
                <span className="grid-explorer-fuel-tile__swatch" style={{ backgroundColor: mixColor(chartTheme, idx) }} />
                <span className="grid-explorer-fuel-tile__name">{g.name}</span>
                <span className="grid-explorer-fuel-tile__val">{formatNumber(g.mw)} MW</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'grid' && (
        <div className="grid-explorer-chart-card card">
          <div className="grid-explorer-chart-card__head grid-explorer-chart-card__head--border">
            <Cable className="h-5 w-5 text-primary shrink-0" />
            <div>
              <h3 className="grid-explorer-chart-card__title">Major Transmission Lines &amp; Interconnectors</h3>
              <p className="grid-explorer-chart-card__sub">National grid corridors and cross-border links</p>
            </div>
          </div>

          <div className="grid-explorer-table-wrap">
            <table className="grid-explorer-table">
              <thead>
                <tr>
                  <th>Line / Corridor</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Operator</th>
                  <th>Current Load</th>
                </tr>
              </thead>
              <tbody>
                {transmissionLines.map((l, idx) => {
                  const isUnderConstruction = l.status.toLowerCase().includes('construction');
                  return (
                    <tr key={idx}>
                      <td>
                        <span className="grid-explorer-table__line">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          {l.name}
                        </span>
                      </td>
                      <td className="tabular-nums font-semibold">{l.capacity}</td>
                      <td><GridStatusBadge status={l.status} /></td>
                      <td className="text-muted-foreground">{l.owner}</td>
                      <td>
                        {isUnderConstruction ? (
                          <span className="text-muted-foreground text-xs">—</span>
                        ) : (
                          <div className="grid-explorer-table__load">
                            <span className="font-mono font-bold text-xs tabular-nums">{l.load}%</span>
                            <div className="grid-load-meter__track grid-load-meter__track--sm">
                              <div
                                className={cn(
                                  'grid-load-meter__fill',
                                  l.load > 85 ? 'grid-load-meter__fill--high' : l.load > 70 ? 'grid-load-meter__fill--mid' : 'grid-load-meter__fill--low',
                                )}
                                style={{ width: `${l.load}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="grid-explorer-footnote">
            <GridLiveBadge label="PGCB SCADA" />
            Full GIS map available to members.
          </p>
        </div>
      )}

      {activeTab === 'demand' && (
        <div className="grid-explorer-chart-card card">
          <div className="grid-explorer-chart-card__head">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary shrink-0" />
              <div>
                <h3 className="grid-explorer-chart-card__title">Hourly Demand Profile</h3>
                <p className="grid-explorer-chart-card__sub">14 Jun 2026 · live SCADA grid feed</p>
              </div>
            </div>
            <GridLiveBadge />
          </div>

          <div className="grid-explorer-chart-area grid-explorer-chart-area--lg">
            {chartsReady ? (
              <ResponsiveContainer width="100%" height="100%" minHeight={320}>
                <ComposedChart data={demandData} margin={{ top: 8, right: 12, left: -6, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`demand-fill-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={chartTheme.primary} stopOpacity={0.28} />
                      <stop offset="100%" stopColor={chartTheme.primary} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 6" stroke={chartTheme.gridStroke} opacity={0.45} vertical={false} />
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: chartTheme.axisTick }} {...axisProps} />
                  <YAxis
                    tick={{ fontSize: 10, fill: chartTheme.axisTick }}
                    width={44}
                    tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
                    {...axisProps}
                  />
                  <Tooltip
                    content={<GridLineTooltip accent={chartTheme.primary} />}
                    cursor={{ stroke: chartTheme.primary, strokeWidth: 1, strokeDasharray: '4 6', strokeOpacity: 0.45 }}
                    wrapperStyle={{ outline: 'none', zIndex: 20 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="demand"
                    fill={`url(#demand-fill-${gradientId})`}
                    stroke="none"
                    isAnimationActive
                  />
                  <Line
                    type="monotone"
                    dataKey="demand"
                    stroke={chartTheme.primary}
                    strokeWidth={2.5}
                    dot={{ fill: chartTheme.primary, r: 2.5, strokeWidth: 0 }}
                    activeDot={{
                      r: 5,
                      fill: chartTheme.primary,
                      stroke: 'hsl(var(--card))',
                      strokeWidth: 2,
                    }}
                    isAnimationActive
                  />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="grid-explorer-skeleton" />
            )}
          </div>

          <p className="grid-explorer-footnote">
            <GridLiveBadge />
            Evening peak demand typically occurs between 18:30–21:00 during summer months.
          </p>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="grid-explorer-projects">
          <div className="grid-explorer-chart-card__head mb-4">
            <div>
              <h3 className="grid-explorer-chart-card__title">Major Generation &amp; Grid Projects</h3>
              <p className="grid-explorer-chart-card__sub">Pipeline outlook 2026–2028</p>
            </div>
            <Link href="/articles" className="grid-explorer-link text-xs">
              See tender coverage →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {projects.map((p, idx) => (
              <div key={idx} className="grid-project-card card">
                <div>
                  <h4 className="grid-project-card__title">{p.name}</h4>
                  <p className="grid-project-card__meta">
                    {p.mw !== '—' && <span className="font-semibold text-foreground">{p.mw} MW · </span>}
                    Target commissioning: <span className="font-semibold text-foreground/90">{p.date}</span>
                  </p>
                </div>
                <GridStatusBadge status={p.status} />
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/articles" className="grid-explorer-link">
              Read full project pipeline analysis and tender notices →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}