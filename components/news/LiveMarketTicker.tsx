'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isSimulatedTelemetryEnabled } from '@/lib/telemetry-mode';
import { useLocale } from '@/components/shared/LocaleProvider';
import { localizeTickerItem } from '@/lib/i18n/homepage-copy';

export interface TickerItem {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  prefix: string;
}

const defaultItems: TickerItem[] = [
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
  labelClassName,
}: {
  initialItems?: TickerItem[];
  variant?: 'chrome' | 'card' | 'embedded';
  playing?: boolean;
  compact?: boolean;
  className?: string;
  labelClassName?: string;
}) {
  const { locale, t } = useLocale();
  const sourceItems = propItems?.length ? propItems : defaultItems;
  const localizedSeed = useMemo(
    () => sourceItems.map((item) => localizeTickerItem(item, locale)),
    [sourceItems, locale],
  );

  const [items, setItems] = useState<TickerItem[]>(localizedSeed);
  const [mounted, setMounted] = useState(false);

  const simulateLive = isSimulatedTelemetryEnabled();

  useEffect(() => {
    setItems(localizedSeed);
  }, [localizedSeed]);

  useEffect(() => {
    setMounted(true);
    if (!simulateLive) return;

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
              (((newVal - item.value) / item.value) * 100 * (item.id === 'fx' ? 5 : 1)).toFixed(1),
            );
            return { ...item, value: newVal, change: newChange };
          }
          return item;
        }),
      );
    }, 25000);

    return () => clearInterval(interval);
  }, [simulateLive]);

  const trackRef = React.useRef<HTMLDivElement>(null);
  const animationRef = React.useRef<Animation | null>(null);

  useEffect(() => {
    if (!mounted || !trackRef.current) return;

    const anim = trackRef.current.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-25%)' }
      ],
      {
        duration: 30000,
        iterations: Infinity,
        easing: 'linear'
      }
    );

    animationRef.current = anim;

    if (!playing) {
      anim.pause();
    }

    return () => {
      anim.cancel();
    };
  }, [mounted, playing, items, locale]);

  const handleMouseEnter = () => {
    if (animationRef.current) {
      animationRef.current.playbackRate = 0.25;
    }
  };

  const handleMouseLeave = () => {
    if (animationRef.current) {
      animationRef.current.playbackRate = 1.0;
    }
  };

  if (!mounted) {
    return <div className={compact ? 'h-8' : 'h-9'} aria-hidden />;
  }

  const textSize = compact ? 'text-[12px] md:text-[13px]' : 'text-[13px] md:text-sm';
  const badgeSize = compact ? 'text-[10px] md:text-[11px]' : 'text-[11px] md:text-xs';
  const labelSize = compact ? 'text-[10px] md:text-[11px]' : 'text-[11px] md:text-xs';

  const track = (
    <div
      ref={trackRef}
      className={cn(
        'market-ticker__track flex w-max items-center whitespace-nowrap gap-6 md:gap-7 pr-6 md:pr-7',
        textSize,
      )}
    >
      {[...items, ...items, ...items, ...items].map((item, idx) => {
        const isPositive = item.change >= 0;
        return (
          <div key={`${item.id}-${idx}`} className="flex shrink-0 items-center gap-2 text-neutral-800 dark:text-neutral-200 transition-colors duration-150 hover:text-neutral-950 dark:hover:text-white">
            <span className={cn('font-semibold text-neutral-900 dark:text-neutral-50', textSize)}>{item.name}</span>
            <span className={cn('font-mono font-bold tabular-nums text-neutral-900 dark:text-neutral-50', textSize)}>
              {item.prefix}
              {item.value.toLocaleString(locale === 'bn' ? 'bn-BD' : 'en-US')}
              {item.unit && <span className="ml-0.5 text-neutral-500 dark:text-neutral-400 font-normal">{item.unit}</span>}
            </span>
            <span
              className={cn(
                'inline-flex items-center rounded-sm px-1 py-[0.5px] text-[9px] md:text-[9.5px] font-sans font-bold tracking-tight',
                isPositive
                  ? 'bg-emerald-500/8 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15'
                  : 'bg-rose-500/8 text-rose-600 dark:text-rose-400 border border-rose-500/15',
              )}
            >
              <span className="text-[7px] md:text-[7.5px] mr-[2px]">{isPositive ? '▲' : '▼'}</span>
              {Math.abs(item.change)}%
            </span>
            <span className="ml-4 text-neutral-300 dark:text-neutral-700 select-none">•</span>
          </div>
        );
      })}
    </div>
  );

  const label = labelClassName ? (
    <div className={cn('shrink-0 flex items-center gap-2', labelClassName)}>
      <Zap className="h-3.5 w-3.5 shrink-0 text-amber-500 fill-amber-500/10" />
      <span className="market-ticker-label__text">
        <span className="md:hidden">COMMODITIES</span>
        <span className="hidden md:inline">{t('ticker.commodities')}</span>
      </span>
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
      </span>
    </div>
  ) : (
    <div
      className={cn(
        'flex shrink-0 items-center gap-1.5 text-muted-foreground',
        compact ? 'pr-2.5' : 'border-r border-border/60 pr-3',
      )}
    >
      <Zap className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
      <span className={cn('font-semibold uppercase tracking-[0.1em]', labelSize)}>
        {t('ticker.commodities')}
      </span>
    </div>
  );

  const marqueeRow = (
    <div
      className={cn(
        'market-ticker__row flex w-full min-w-0 items-center',
        compact ? 'h-8' : 'h-9 md:h-10',
        textSize,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {label}
      <div className={cn('market-ticker__viewport mask-fade', compact ? 'pl-2 -mr-3' : 'pl-3 -mr-3')}>{track}</div>
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