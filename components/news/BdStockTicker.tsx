'use client';

import { useEffect, useMemo, useState } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { DseTickerItem } from '@/lib/bd-stock-market';
import { DEFAULT_DSE_TICKER } from '@/lib/bd-stock-market';
import { useLocale } from '@/components/shared/LocaleProvider';
import { cn } from '@/lib/utils';

export function BdStockTicker({
  className,
  labelClassName,
}: {
  className?: string;
  labelClassName?: string;
}) {
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
    <div
      className={cn(
        'market-ticker__row flex w-full min-w-0 items-center h-full min-h-8 text-[12px] md:text-[13px]',
        className,
      )}
    >
      {labelClassName ? (
        <div className={cn('shrink-0', labelClassName)}>
          <span className="market-ticker-label__dot market-ticker-label__dot--dse" aria-hidden />
          <span className="market-ticker-label__text">
            <span className="md:hidden">DSE</span>
            <span className="hidden md:inline">{t('ticker.dseLive')}</span>
          </span>
        </div>
      ) : (
        <div className="flex shrink-0 items-center gap-1.5 border-r border-border/60 pr-3 text-muted-foreground">
          <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-sky-500" aria-hidden />
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] md:text-[11px]">
            {t('ticker.dseLive')}
          </span>
        </div>
      )}
      <div className="market-ticker__viewport pl-2 md:pl-3 -mr-3">
        <div
          className="market-ticker__track flex w-max items-center gap-7 whitespace-nowrap animate-[marquee_38s_linear_infinite]"
          style={{ animationPlayState: 'running' }}
        >
          {[...displayItems, ...displayItems].map((item, idx) => {
            const isPositive = item.change >= 0;
            const ChangeIcon = isPositive ? TrendingUp : TrendingDown;
            return (
              <div key={`${item.id}-${idx}`} className="flex shrink-0 items-center gap-2 text-muted-foreground">
                <span className="font-mono text-[10px] md:text-[11px] font-bold text-foreground">
                  {item.symbol}
                </span>
                <span className="font-medium text-foreground">{item.label}</span>
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