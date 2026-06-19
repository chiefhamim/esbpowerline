'use client';

import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import { SectorCoverage } from '@/components/news/SectorCoverage';
import { useLocale } from '@/components/shared/LocaleProvider';
import type { PublicArticleCard, PublicCategory } from '@/lib/category-types';
import type { ResolvedCoverageSlot } from '@/lib/coverage-types';

export function HomePowerSector({
  categories,
  sectorArticles,
  coverageSlots,
  pinnedArticles,
}: {
  categories: PublicCategory[];
  sectorArticles: PublicArticleCard[];
  coverageSlots: ResolvedCoverageSlot[];
  pinnedArticles: PublicArticleCard[];
}) {
  const { t } = useLocale();

  return (
    <section className="home-block" aria-labelledby="home-power-sector-title">
      <div className="home-section-head flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <div className="section-kicker text-primary/80 mb-1.5">
            {t('coverage.allCoverage').toUpperCase()}
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary shrink-0" aria-hidden />
            <h2 id="home-power-sector-title" className="text-2xl md:text-3xl font-display font-bold tracking-tight">
              {t('home.powerSector')}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{t('home.powerSectorSub')}</p>
        </div>
        <Link
          href="/articles"
          className="text-sm text-primary inline-flex items-center gap-1 hover:underline font-medium shrink-0"
        >
          {t('home.browseAllNews')}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
      <SectorCoverage
        hideHeader
        categories={categories}
        articles={sectorArticles}
        coverageSlots={coverageSlots}
        pinnedArticles={pinnedArticles}
      />
    </section>
  );
}