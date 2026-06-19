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
    <div className="public-market-strip w-full">
      <div className="container container--shell">
        <div className="public-market-strip__grid">
          <div className="public-market-strip__lane public-market-strip__lane--energy">
            <LiveMarketTicker
              variant="embedded"
              compact
              labelClassName="market-ticker-label market-ticker-label--energy"
              initialItems={localizedEnergy}
            />
          </div>
          <div className="public-market-strip__lane public-market-strip__lane--dse">
            <BdStockTicker labelClassName="market-ticker-label market-ticker-label--dse" />
          </div>
        </div>
      </div>
    </div>
  );
}