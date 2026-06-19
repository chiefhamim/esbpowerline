'use client';

import { useEffect, useMemo, useState } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { DseTickerItem } from '@/lib/bd-stock-market';
import { DEFAULT_DSE_TICKER } from '@/lib/bd-stock-market';
import { useLocale } from '@/components/shared/LocaleProvider';
import { cn } from '@/lib/utils';

export function BdStockTicker({ className }: { className?: string }) {
  const { locale, t } = useLocale();
  const [items, setItems] = useState<DseTickerItem[]>(DEFAULT_DSE_TICKER);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch('/api/market/dse', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as { items?: DseTickerItem[] };
        if (!cancelled && data.items?.length) setItems(data.items);
      } catch {
        /* keep baseline */
      }
    }

    void load();
    const interval = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const displayItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        label: locale === 'bn' ? item.nameBn : item.name,
      })),
    [items, locale],
  );

  if (!mounted) {
    return <div className={cn('h-8', className)} aria-hidden />;
  }

  return (
    <div className={cn('flex items-center h-9 text-[12px] md:text-[13px]', className)}>
      <div className="flex shrink-0 items-center gap-1.5 border-r border-border/60 pr-3 text-muted-foreground">
        <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-sky-500" aria-hidden />
        <span className="font-semibold uppercase tracking-[0.1em] text-[10px] md:text-[11px]">
          {t('ticker.dseLive')}
        </span>
      </div>
      <div className="relative min-w-0 flex-1 overflow-hidden mask-fade ml-3">
        <div
          className="flex w-max items-center gap-7 whitespace-nowrap animate-[marquee_38s_linear_infinite]"
          style={{ animationPlayState: 'running' }}
        >
          {[...displayItems, ...displayItems].map((item, idx) => {
            const isPositive = item.change >= 0;
            const ChangeIcon = isPositive ? TrendingUp : TrendingDown;
            return (
              <div key={`${item.id}-${idx}`} className="flex shrink-0 items-center gap-2 text-muted-foreground">
                <span className="font-mono text-[10px] md:text-[11px] font-bold text-foreground/70">
                  {item.symbol}
                </span>
                <span className="font-medium text-foreground/90">{item.label}</span>
                <span className="font-mono tabular-nums text-foreground">
                  ৳{item.price.toLocaleString(locale === 'bn' ? 'bn-BD' : 'en-US')}
                </span>
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-semibold text-[10px] md:text-[11px]',
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
      </div>
    </div>
  );
}