'use client';

import { useEffect, useState } from 'react';
import { formatNumber } from '@/lib/utils';
import { Zap, Activity, Leaf, Gauge, Flame, Cable, Sun, TrendingUp } from 'lucide-react';

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
  color?: string;
}

const initial: Stat[] = [
  { label: 'Generation Capacity', value: 28420, unit: 'MW', icon: 'Zap', color: '#3b82f6' },
  { label: 'Current Demand', value: 15230, unit: 'MW', icon: 'Activity', color: '#ef4444' },
  { label: 'Renewable Share', value: 4.8, unit: '%', isDecimal: true, icon: 'Leaf', color: '#10b981' },
  { label: 'System Loss', value: 7.6, unit: '%', isDecimal: true, icon: 'Gauge', color: '#f59e0b' },
  { label: 'Gas Supply', value: 1380, unit: 'MMcfd', icon: 'Flame', color: '#8b5cf6' },
  { label: 'Peak Today', value: 16850, unit: 'MW', icon: 'TrendingUp', color: '#3b82f6' },
];

export function EnergyDashboard({ initialStats }: { initialStats?: any[] }) {
  const [stats, setStats] = useState<Stat[]>(() => {
    const raw = initialStats || initial;
    return raw.map(s => ({
      ...s,
      icon: typeof s.icon === 'string' ? (IconMap[s.icon] || Zap) : s.icon
    }));
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => prev.map((s, idx) => {
        const range = idx === 0 || idx === 1 || idx === 5 ? 160 : (idx === 4 ? 35 : 0.2);
        const variation = (Math.random() - 0.5) * range;
        const next = Math.max(idx === 2 || idx === 3 ? 0.5 : 100, s.value + variation);
        return { 
          ...s, 
          value: (idx === 2 || idx === 3) ? parseFloat(next.toFixed(1)) : Math.round(next) 
        };
      }));
    }, 24000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={i} className="stat group relative overflow-hidden flex flex-col items-center text-center pt-6 pb-5 px-3">
            {/* Live SCADA Radar Ping */}
            <span className="absolute top-2.5 right-2.5 flex h-1.5 w-1.5" title="Live Telemetry Feed">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 font-semibold"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <Icon className="h-6 w-6 mb-2 shrink-0" style={{ color: s.color }} />
            <div className="text-[11px] font-medium tracking-wide text-muted-foreground mb-1">
              {s.label}
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
