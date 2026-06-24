'use client';

import { useEffect, useState } from 'react';
import { formatNumber } from '@/lib/utils';
import { Zap, Activity, Leaf, Gauge, Flame, Cable, Sun, TrendingUp } from 'lucide-react';
import { isSimulatedTelemetryEnabled } from '@/lib/telemetry-mode';
import { useLocale } from '@/components/shared/LocaleProvider';
import { localizeEnergyStatLabel } from '@/lib/i18n/homepage-copy';

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
}

const ICON_COLOR_CLASS: Record<string, string> = {
  Zap: 'text-primary',
  Activity: 'text-destructive',
  Leaf: 'text-accent',
  Gauge: 'text-amber-500',
  Flame: 'text-violet-500',
  Cable: 'text-cyan-500',
  Sun: 'text-amber-400',
  TrendingUp: 'text-primary',
};

const initial: Stat[] = [
  { label: 'Generation Capacity', value: 28420, unit: 'MW', icon: 'Zap' },
  { label: 'Current Demand', value: 16154, unit: 'MW', icon: 'Activity' }, // Evening Peak Generation (16,154.41 MW)
  { label: 'Renewable Share', value: 7.2, unit: '%', isDecimal: true, icon: 'Leaf' }, // SREDA renewable capacity share (~7.2%)
  { label: 'System Loss', value: 7.6, unit: '%', isDecimal: true, icon: 'Gauge' },
  { label: 'Gas Supply', value: 907, unit: 'MMcfd', icon: 'Flame' }, // Gas supplied to power grid (907.35 MMCFD)
  { label: 'Peak Today', value: 16854, unit: 'MW', icon: 'TrendingUp' }, // Evening Peak Demand (16,854.11 MW)
  { label: 'India Grid Import', value: 2584, unit: 'MW', icon: 'Cable' }, // Peak import flow (2,583.55 MW)
  { label: 'Solar Installed', value: 1512, unit: 'MW', icon: 'Sun' }, // SREDA installed solar (1,511.70 MW)
];

function mergeSnapshotStats(incoming?: Stat[]): Stat[] {
  const raw = incoming?.length ? [...incoming] : [...initial];
  const labels = new Set(raw.map((s) => s.label));
  for (const stat of initial) {
    if (!labels.has(stat.label)) raw.push(stat);
  }
  return raw;
}

export function EnergyDashboard({
  initialStats,
  compact = false,
}: {
  initialStats?: Stat[];
  compact?: boolean;
}) {
  const { locale, t } = useLocale();
  const [stats, setStats] = useState<Stat[]>(() => {
    const raw = mergeSnapshotStats(initialStats);
    return raw.map(s => {
      const iconKey = typeof s.icon === 'string' ? s.icon : 'Zap';
      return {
        ...s,
        icon: typeof s.icon === 'string' ? (IconMap[s.icon] || Zap) : s.icon,
        iconClass: s.iconClass ?? ICON_COLOR_CLASS[iconKey] ?? 'text-primary',
      };
    });
  });

  const simulateLive = isSimulatedTelemetryEnabled();

  useEffect(() => {
    if (!simulateLive) return;

    const interval = setInterval(() => {
      setStats(prev => prev.map((s) => {
        if (s.label !== 'Current Demand') return s;
        const variation = (Math.random() - 0.5) * 160;
        const next = Math.max(100, s.value + variation);
        return {
          ...s,
          value: Math.round(next),
        };
      }));
    }, 24000);
    return () => clearInterval(interval);
  }, [simulateLive]);

  return (
    <div
      className={
        compact
          ? 'grid grid-cols-2 gap-2.5'
          : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3'
      }
    >
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <div
            key={i}
            className={`stat group relative overflow-hidden flex flex-col items-center text-center px-3 ${
              compact ? 'pt-4 pb-4' : 'pt-6 pb-5'
            }`}
          >
            {/* Live SCADA Radar Ping */}
            <span
              className="absolute top-2.5 right-2.5 flex h-1.5 w-1.5"
              title={simulateLive ? t('energy.simulated') : t('energy.indicative')}
            >
              {simulateLive ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 font-semibold" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-muted-foreground/40" />
              )}
            </span>
            <Icon className={`h-6 w-6 mb-2 shrink-0 ${s.iconClass ?? 'text-primary'}`} />
            <div className="text-xs md:text-sm font-medium tracking-wide text-muted-foreground mb-1">
              {localizeEnergyStatLabel(s.label, locale)}
            </div>
            <div className="stat-value tabular-nums leading-none">
              {s.isDecimal ? s.value.toFixed(1) : formatNumber(Math.round(s.value))}
              <span className="ml-1 text-sm align-baseline font-normal text-muted-foreground">{s.unit}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
