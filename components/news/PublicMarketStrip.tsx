'use client';

import { useMemo } from 'react';
import { LiveMarketTicker, type TickerItem } from '@/components/news/LiveMarketTicker';
import { BdStockTicker } from '@/components/news/BdStockTicker';
import { localizeTickerItem } from '@/lib/i18n/homepage-copy';
import { useLocale } from '@/components/shared/LocaleProvider';

export function PublicMarketStrip({ energyItems }: { energyItems?: TickerItem[] }) {
  const { locale } = useLocale();

  const localizedEnergy = useMemo(
    () => (energyItems ?? []).map((item) => localizeTickerItem(item, locale)),
    [energyItems, locale],
  );

  return (
    <div className="public-market-strip w-full border-b border-border/45 bg-[var(--bg)]/95 backdrop-blur-sm">
      <div className="container px-4">
        <div className="border-b border-border/30 py-1">
          <LiveMarketTicker variant="embedded" compact initialItems={localizedEnergy} />
        </div>
        <div className="py-1">
          <BdStockTicker />
        </div>
      </div>
    </div>
  );
}