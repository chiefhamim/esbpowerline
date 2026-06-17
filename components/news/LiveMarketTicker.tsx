'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TickerItem {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  prefix: string;
}

const initialItems: TickerItem[] = [
  { id: 'lng', name: 'LNG (Spot)', value: 11.85, unit: '/mmbtu', change: 1.4, prefix: '$' },
  { id: 'coal', name: 'Coal (API2)', value: 102.5, unit: '/t', change: -0.8, prefix: '$' },
  { id: 'fx', name: 'USD/BDT', value: 117.65, unit: '', change: 0.12, prefix: '৳' },
  { id: 'solar', name: 'Solar Module', value: 0.118, unit: '/W', change: -2.1, prefix: '$' },
  { id: 'tariff', name: 'Bulk Tariff', value: 8.95, unit: 'Tk/kWh', change: 0.0, prefix: '' },
  { id: 'gas', name: 'Petrobangla Gas', value: 1380, unit: 'MMcfd', change: -3.2, prefix: '' },
];

export function LiveMarketTicker({
  initialItems: propItems,
  variant = 'chrome',
  playing = true,
  compact = false,
  className,
}: {
  initialItems?: TickerItem[];
  variant?: 'chrome' | 'card' | 'embedded';
  playing?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const [items, setItems] = useState<TickerItem[]>(propItems || initialItems);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      if (document.hidden) return;
      setItems((prev) =>
        prev.map((item) => {
          if (Math.random() > 0.6) {
            const delta =
              (Math.random() - 0.5) *
              (item.id === 'fx' || item.id === 'tariff' ? 0.15 : item.value > 50 ? 1.2 : 0.008);
            const newVal = Math.max(0.01, parseFloat((item.value + delta).toFixed(item.value > 100 ? 1 : 2)));
            const newChange = parseFloat(
              (((newVal - item.value) / item.value) * 100 * (item.id === 'fx' ? 5 : 1)).toFixed(1)
            );
            return { ...item, value: newVal, change: newChange };
          }
          return item;
        })
      );
    }, 25000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div
        className={compact ? 'h-7' : 'h-8'}
        aria-hidden
      />
    );
  }

  const track = (
    <div
      className={`flex w-max items-center whitespace-nowrap ${compact ? 'gap-6' : 'gap-8'} animate-[marquee_32s_linear_infinite]`}
      style={{ animationPlayState: playing ? 'running' : 'paused' }}
    >
      {[...items, ...items].map((item, idx) => {
        const isPositive = item.change >= 0;
        const ChangeIcon = isPositive ? TrendingUp : TrendingDown;
        return (
          <div key={`${item.id}-${idx}`} className="flex shrink-0 items-center gap-1.5 text-muted-foreground">
            <span className={`font-medium text-foreground/90 ${compact ? 'text-[10px]' : ''}`}>{item.name}</span>
            <span className={`font-mono tabular-nums text-foreground ${compact ? 'text-[10px]' : ''}`}>
              {item.prefix}
              {item.value.toLocaleString()}
              {item.unit && <span className="ml-0.5 text-muted-foreground/80">{item.unit}</span>}
            </span>
            <span
              className={`inline-flex items-center gap-0.5 rounded px-1 py-px font-semibold ${compact ? 'text-[9px]' : 'text-[10px]'} ${isPositive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}
            >
              {isPositive ? '+' : ''}
              {item.change}%
              <ChangeIcon className={compact ? 'h-2.5 w-2.5' : 'h-3 w-3'} />
            </span>
          </div>
        );
      })}
    </div>
  );

  const label = (
    <div className={`flex shrink-0 items-center gap-1.5 text-muted-foreground ${compact ? 'pr-2.5' : 'border-r border-border/60 pr-3'}`}>
      <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-emerald-500" aria-hidden />
      <span className={`font-semibold uppercase tracking-[0.12em] ${compact ? 'text-[9px]' : 'text-[10px]'}`}>Markets</span>
    </div>
  );

  const marqueeRow = (
    <div className={`flex items-center ${compact ? 'h-7 text-[10px]' : 'h-8 text-[11px]'}`}>
      {label}
      <div className={`relative min-w-0 flex-1 overflow-hidden mask-fade ${compact ? 'ml-2' : 'ml-3'}`}>{track}</div>
    </div>
  );

  if (variant === 'embedded') {
    return marqueeRow;
  }

  return (
    <div
      className={cn(
        variant === 'chrome' ? 'w-full border-t border-border/40 bg-[var(--bg)]' : 'w-full py-1.5',
        className,
      )}
    >
      <div className="container px-4">
        {variant === 'chrome' ? (
          marqueeRow
        ) : (
          <div className="overflow-hidden rounded-xl border border-border/40 bg-[var(--bg-elev)]/60 backdrop-blur-sm">
            <div className="px-4">{marqueeRow}</div>
          </div>
        )}
      </div>
    </div>
  );
}