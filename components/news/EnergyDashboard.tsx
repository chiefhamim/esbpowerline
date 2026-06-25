'use client';

import { useEffect, useState } from 'react';
import { formatNumber } from '@/lib/utils';
import { Zap, Activity, Leaf, Gauge, Flame, Cable, Sun, TrendingUp } from 'lucide-react';
import { isSimulatedTelemetryEnabled } from '@/lib/telemetry-mode';
import { useLocale } from '@/components/shared/LocaleProvider';
import { localizeEnergyStatLabel } from '@/lib/i18n/homepage-copy';
import { ModernTooltip } from '@/components/shared/ModernTooltip';

const IconMap: Record<string, any> = {
  Zap,
  Activity,
  Leaf,
  Gauge,
  Flame,
  Cable,
  Sun,
  TrendingUp,
};

interface Stat {
  label: string;
  value: number;
  unit: string;
  isDecimal?: boolean;
  icon: any;
  iconClass?: string;
  iconBgClass?: string;
  hoverBgClass?: string;
  hoverTextClass?: string;
}

const ICON_STYLES: Record<
  string,
  { color: string; bg: string; hoverBg: string; hoverText: string }
> = {
  Zap: {
    color: 'text-emerald-500 dark:text-emerald-400',
    bg: 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/15 dark:border-emerald-400/20 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.12)] dark:shadow-none group-hover:scale-105 group-hover:rotate-3 transition-all duration-300',
    hoverBg: 'hover:bg-emerald-500/[0.04] dark:hover:bg-emerald-500/[0.05] hover:border-emerald-500/10',
    hoverText: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
  },
  Activity: {
    color: 'text-rose-500 dark:text-rose-400',
    bg: 'bg-gradient-to-br from-rose-500/10 to-rose-600/5 border border-rose-500/15 dark:border-rose-400/20 shadow-[0_2px_8px_-2px_rgba(244,63,94,0.12)] dark:shadow-none group-hover:scale-105 group-hover:rotate-3 transition-all duration-300',
    hoverBg: 'hover:bg-rose-500/[0.04] dark:hover:bg-rose-500/[0.05] hover:border-rose-500/10',
    hoverText: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
  },
  Leaf: {
    color: 'text-teal-500 dark:text-teal-400',
    bg: 'bg-gradient-to-br from-teal-500/10 to-teal-600/5 border border-teal-500/15 dark:border-teal-400/20 shadow-[0_2px_8px_-2px_rgba(20,184,166,0.12)] dark:shadow-none group-hover:scale-105 group-hover:rotate-3 transition-all duration-300',
    hoverBg: 'hover:bg-teal-500/[0.04] dark:hover:bg-teal-500/[0.05] hover:border-teal-500/10',
    hoverText: 'group-hover:text-teal-600 dark:group-hover:text-teal-400',
  },
  Gauge: {
    color: 'text-amber-500 dark:text-amber-400',
    bg: 'bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/15 dark:border-amber-400/20 shadow-[0_2px_8px_-2px_rgba(245,158,11,0.12)] dark:shadow-none group-hover:scale-105 group-hover:rotate-3 transition-all duration-300',
    hoverBg: 'hover:bg-amber-500/[0.04] dark:hover:bg-amber-500/[0.05] hover:border-amber-500/10',
    hoverText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
  },
  Flame: {
    color: 'text-violet-500 dark:text-violet-400',
    bg: 'bg-gradient-to-br from-violet-500/10 to-violet-600/5 border border-violet-500/15 dark:border-violet-400/20 shadow-[0_2px_8px_-2px_rgba(139,92,246,0.12)] dark:shadow-none group-hover:scale-105 group-hover:rotate-3 transition-all duration-300',
    hoverBg: 'hover:bg-violet-500/[0.04] dark:hover:bg-violet-500/[0.05] hover:border-violet-500/10',
    hoverText: 'group-hover:text-violet-600 dark:group-hover:text-violet-400',
  },
  Cable: {
    color: 'text-cyan-500 dark:text-cyan-400',
    bg: 'bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/15 dark:border-cyan-400/20 shadow-[0_2px_8px_-2px_rgba(6,182,212,0.12)] dark:shadow-none group-hover:scale-105 group-hover:rotate-3 transition-all duration-300',
    hoverBg: 'hover:bg-cyan-500/[0.04] dark:hover:bg-cyan-500/[0.05] hover:border-cyan-500/10',
    hoverText: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400',
  },
  Sun: {
    color: 'text-yellow-500 dark:text-yellow-400',
    bg: 'bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/15 dark:border-yellow-400/20 shadow-[0_2px_8px_-2px_rgba(234,179,8,0.12)] dark:shadow-none group-hover:scale-105 group-hover:rotate-3 transition-all duration-300',
    hoverBg: 'hover:bg-yellow-500/[0.04] dark:hover:bg-yellow-500/[0.05] hover:border-yellow-500/10',
    hoverText: 'group-hover:text-yellow-600 dark:group-hover:text-yellow-400',
  },
  TrendingUp: {
    color: 'text-primary dark:text-primary-foreground',
    bg: 'bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/15 dark:border-primary/20 shadow-[0_2px_8px_-2px_rgba(59,130,246,0.12)] dark:shadow-none group-hover:scale-105 group-hover:rotate-3 transition-all duration-300',
    hoverBg: 'hover:bg-primary/[0.04] dark:hover:bg-primary/[0.05] hover:border-primary/10',
    hoverText: 'group-hover:text-primary dark:group-hover:text-primary-foreground',
  },
};

const initial: Stat[] = [
  { label: 'Generation Capacity', value: 28420, unit: 'MW', icon: 'Zap' },
  { label: 'Current Demand', value: 16154, unit: 'MW', icon: 'Activity' },
  { label: 'Peak Today', value: 16854, unit: 'MW', icon: 'TrendingUp' },
  { label: 'Daily Generation', value: 312.4, unit: 'MKWh', isDecimal: true, icon: 'TrendingUp' },
  { label: 'Load Shedding', value: 1250, unit: 'MW', icon: 'Activity' },
  { label: 'Coal Generation', value: 3820, unit: 'MW', icon: 'Flame' },
  { label: 'Gas Supply', value: 907, unit: 'MMcfd', icon: 'Flame' },
  { label: 'India Grid Import', value: 2584, unit: 'MW', icon: 'Cable' },
  { label: 'Liquid Fuel Gen', value: 2450, unit: 'MW', icon: 'Flame' },
  { label: 'Hydro Power', value: 150, unit: 'MW', icon: 'Leaf' },
  { label: 'Fuel Cost', value: 6.25, unit: 'Tk/kWh', isDecimal: true, icon: 'Gauge' },
  { label: 'Grid Frequency', value: 50.02, unit: 'Hz', isDecimal: true, icon: 'Gauge' },
];

const TARGET_ORDER: Record<string, number> = {
  'Generation Capacity': 0,
  'Current Demand': 1,
  'Peak Today': 2,
  'Daily Generation': 3,
  'Load Shedding': 4,
  'Coal Generation': 5,
  'Gas Supply': 6,
  'India Grid Import': 7,
  'Liquid Fuel Gen': 8,
  'Hydro Power': 9,
  'Fuel Cost': 10,
  'Grid Frequency': 11,
};

function mergeSnapshotStats(incoming?: Stat[]): Stat[] {
  const incomingMap = new Map<string, Stat>();
  if (incoming && incoming.length > 0) {
    for (const s of incoming) {
      if (s && s.label && TARGET_ORDER[s.label] !== undefined) {
        incomingMap.set(s.label, s);
      }
    }
  }

  const result: Stat[] = [];
  for (const item of initial) {
    const matched = incomingMap.get(item.label);
    if (matched) {
      result.push({
        ...item,
        value: typeof matched.value === 'number' ? matched.value : item.value,
        unit: matched.unit || item.unit,
        isDecimal: typeof matched.isDecimal === 'boolean' ? matched.isDecimal : item.isDecimal,
      });
    } else {
      result.push({ ...item });
    }
  }
  return result;
}

function sortStats(stats: Stat[]): Stat[] {
  return [...stats].sort((a, b) => {
    const orderA = TARGET_ORDER[a.label] ?? 99;
    const orderB = TARGET_ORDER[b.label] ?? 99;
    return orderA - orderB;
  });
}

export function EnergyDashboard({
  initialStats,
  compact = false,
  fillHeight = false,
}: {
  initialStats?: Stat[];
  compact?: boolean;
  fillHeight?: boolean;
}) {
  const { locale, t } = useLocale();
  const [stats, setStats] = useState<Stat[]>(() => {
    const raw = mergeSnapshotStats(initialStats);
    const sorted = sortStats(raw);
    return sorted.map(s => {
      const iconKey = typeof s.icon === 'string' ? s.icon : 'Zap';
      const style = ICON_STYLES[iconKey] || ICON_STYLES.Zap;
      return {
        ...s,
        icon: typeof s.icon === 'string' ? (IconMap[s.icon] || Zap) : s.icon,
        iconClass: s.iconClass ?? style.color,
        iconBgClass: s.iconBgClass ?? style.bg,
        hoverBgClass: style.hoverBg,
        hoverTextClass: style.hoverText,
      };
    });
  });

  const simulateLive = isSimulatedTelemetryEnabled();

  useEffect(() => {
    if (!simulateLive) return;

    const interval = setInterval(() => {
      setStats(prev => prev.map((s) => {
        if (s.label === 'Current Demand') {
          const variation = (Math.random() - 0.5) * 160;
          const next = Math.max(100, s.value + variation);
          return {
            ...s,
            value: Math.round(next),
          };
        }
        if (s.label === 'Fuel Cost') {
          const variation = (Math.random() - 0.5) * 0.05;
          const next = Math.max(5.0, Math.min(8.0, s.value + variation));
          return {
            ...s,
            value: parseFloat(next.toFixed(2)),
          };
        }
        if (s.label === 'Grid Frequency') {
          const variation = (Math.random() - 0.5) * 0.02;
          const next = Math.max(49.95, Math.min(50.05, s.value + variation));
          return {
            ...s,
            value: parseFloat(next.toFixed(2)),
          };
        }
        return s;
      }));
    }, 24000);
    return () => clearInterval(interval);
  }, [simulateLive]);

  return (
    <div
      className={
        compact
          ? `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-2.5 lg:gap-2 xl:gap-2.5 w-full min-w-0 ${fillHeight ? 'h-full' : ''}`
          : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3'
      }
    >
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <div
            key={i}
            className={`group relative overflow-hidden flex transition-all duration-250 ${
              compact
                ? `flex-col justify-between text-left rounded-xl border border-border/30 bg-card hover:bg-muted/5 dark:hover:bg-white/[0.01] hover:border-primary/20 hover:shadow-sm min-w-0 ${
                    fillHeight
                      ? 'px-2 py-1.5 lg:px-2 lg:py-1 xl:px-2.5 xl:py-1.5 2xl:px-3 2xl:py-2 h-full'
                      : 'px-2.5 py-2'
                  }`
                : 'stat flex-col items-center justify-center text-center px-3 pt-6 pb-5'
            }`}
          >
            {/* Live SCADA Radar Ping */}
            <span className="absolute top-1.5 right-1.5 flex h-1.5 w-1.5 z-20">
              <ModernTooltip
                label={simulateLive ? t('energy.simulated') : t('energy.indicative')}
                alwaysShow
                variant="chrome"
                side="top"
              >
                <span className="relative flex h-1.5 w-1.5 cursor-help">
                  {simulateLive && (s.label === 'Current Demand' || s.label === 'Fuel Cost' || s.label === 'Grid Frequency') ? (
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500" />
                    </>
                  ) : (
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-muted-foreground/20 dark:bg-muted-foreground/10" />
                  )}
                </span>
              </ModernTooltip>
            </span>

            {compact ? (
              <div className="flex flex-col w-full min-w-0 h-full justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-3.5 lg:w-3.5 xl:h-4 xl:w-4 2xl:h-4.5 2xl:w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${s.iconClass ?? 'text-primary'}`} />
                  <div className="font-semibold uppercase tracking-wider text-muted-foreground/75 group-hover:text-foreground transition-colors duration-150 select-none text-[8.5px] xs:text-[9px] sm:text-[9.5px] lg:text-[8px] xl:text-[9px] 2xl:text-[9.5px] leading-none whitespace-nowrap overflow-hidden text-ellipsis">
                    {localizeEnergyStatLabel(s.label, locale)}
                  </div>
                </div>
                <div className="font-bold tabular-nums text-foreground/95 group-hover:text-primary transition-colors duration-150 leading-none text-[11.5px] xs:text-xs sm:text-[13px] lg:text-[11.5px] xl:text-xs 2xl:text-[14.5px] mt-1 lg:mt-0.5 xl:mt-1 whitespace-nowrap">
                  {s.isDecimal ? s.value.toFixed(1) : formatNumber(Math.round(s.value))}
                  <span className="font-bold text-muted-foreground/50 uppercase tracking-wider pl-0.5 text-[8.5px] xs:text-[9px] sm:text-[9.5px] lg:text-[8.5px] xl:text-[9px] 2xl:text-[9.5px] inline-block scale-90 origin-left">
                    {s.unit}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <Icon className={`shrink-0 transition-transform duration-200 group-hover:scale-105 h-6 w-6 mb-2 ${s.iconClass ?? 'text-primary'}`} />
                <div className="font-bold uppercase tracking-wider text-muted-foreground/75 group-hover:text-foreground transition-colors duration-150 text-center select-none leading-none max-w-full px-1 text-xs md:text-sm mb-1">
                  {localizeEnergyStatLabel(s.label, locale)}
                </div>
                <div className="font-bold tabular-nums text-foreground/90 group-hover:text-primary transition-colors duration-150 leading-none stat-value mt-1">
                  {s.isDecimal ? s.value.toFixed(1) : formatNumber(Math.round(s.value))}
                  <span className="font-bold text-muted-foreground/50 uppercase tracking-wider pl-0.5 ml-1 text-sm align-baseline font-normal text-muted-foreground">
                    {s.unit}
                  </span>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
