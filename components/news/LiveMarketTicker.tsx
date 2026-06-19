'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
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

  if (!mounted) {
    return <div className={compact ? 'h-8' : 'h-9'} aria-hidden />;
  }

  const textSize = compact ? 'text-[12px] md:text-[13px]' : 'text-[13px] md:text-sm';
  const badgeSize = compact ? 'text-[10px] md:text-[11px]' : 'text-[11px] md:text-xs';
  const labelSize = compact ? 'text-[10px] md:text-[11px]' : 'text-[11px] md:text-xs';

  const track = (
    <div
      className={cn(
        'market-ticker__track flex w-max items-center whitespace-nowrap gap-7 md:gap-8 animate-[marquee_32s_linear_infinite]',
        textSize,
      )}
      style={{ animationPlayState: playing ? 'running' : 'paused' }}
    >
      {[...items, ...items].map((item, idx) => {
        const isPositive = item.change >= 0;
        const ChangeIcon = isPositive ? TrendingUp : TrendingDown;
        return (
          <div key={`${item.id}-${idx}`} className="flex shrink-0 items-center gap-2 text-muted-foreground">
            <span className={cn('font-medium text-foreground/90', textSize)}>{item.name}</span>
            <span className={cn('font-mono tabular-nums text-foreground', textSize)}>
              {item.prefix}
              {item.value.toLocaleString(locale === 'bn' ? 'bn-BD' : 'en-US')}
              {item.unit && <span className="ml-0.5 text-muted-foreground/80">{item.unit}</span>}
            </span>
            <span
              className={cn(
                'inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-semibold',
                badgeSize,
                isPositive
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
              )}
            >
              {isPositive ? '+' : ''}
              {item.change}%
              <ChangeIcon className="h-3 w-3" />
            </span>
          </div>
        );
      })}
    </div>
  );

  const label = labelClassName ? (
    <div className={cn('shrink-0', labelClassName)}>
      <span
        className={cn(
          'market-ticker-label__dot',
          simulateLive ? 'market-ticker-label__dot--live' : 'market-ticker-label__dot--muted',
        )}
        aria-hidden
      />
      <span className="market-ticker-label__text">
        {simulateLive ? t('ticker.energyMarkets') : t('ticker.indicative')}
      </span>
    </div>
  ) : (
    <div
      className={cn(
        'flex shrink-0 items-center gap-1.5 text-muted-foreground',
        compact ? 'pr-2.5' : 'border-r border-border/60 pr-3',
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 shrink-0 rounded-full',
          simulateLive ? 'animate-pulse bg-emerald-500' : 'bg-muted-foreground/50',
        )}
        aria-hidden
      />
      <span className={cn('font-semibold uppercase tracking-[0.1em]', labelSize)}>
        {simulateLive ? t('ticker.energyMarkets') : t('ticker.indicative')}
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
    >
      {label}
      <div className={cn('market-ticker__viewport mask-fade', compact ? 'ml-2' : 'ml-3')}>{track}</div>
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