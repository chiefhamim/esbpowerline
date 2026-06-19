'use client';

import { BarChart3, Zap } from 'lucide-react';
import { InterviewsSection } from '@/components/news/InterviewsSection';
import { EnergyDashboard } from '@/components/news/EnergyDashboard';
import { SectorCoverage } from '@/components/news/SectorCoverage';
import { normalizeInterviews } from '@/lib/interview-content';
import { useLocale } from '@/components/shared/LocaleProvider';
import { localizeSnapshotLabel } from '@/lib/i18n/homepage-copy';
import type { PublicArticleCard, PublicCategory } from '@/lib/category-types';
import type { ResolvedCoverageSlot } from '@/lib/coverage-types';

type HomeDeferredSectionsProps = {
  interviews?: unknown;
  snapshotStats?: unknown;
  snapshotLabel: string;
  categories: PublicCategory[];
  sectorArticles: PublicArticleCard[];
  coverageSlots: ResolvedCoverageSlot[];
  pinnedArticles: PublicArticleCard[];
};

export function HomeDeferredSections({
  interviews,
  snapshotStats,
  snapshotLabel,
  categories,
  sectorArticles,
  coverageSlots,
  pinnedArticles,
}: HomeDeferredSectionsProps) {
  const { locale, t } = useLocale();
  const localizedSnapshotLabel = localizeSnapshotLabel(snapshotLabel, locale);

  return (
    <>
      <InterviewsSection initialInterviews={normalizeInterviews(interviews)} />

      <div className="container py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight">{t('home.systemSnapshot')}</h2>
          </div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
            {localizedSnapshotLabel}
          </span>
        </div>
        <EnergyDashboard initialStats={snapshotStats as never} />
      </div>

      <div className="container py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight">{t('home.powerSector')}</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{t('home.powerSectorSub')}</p>
        </div>
        <SectorCoverage
          hideHeader
          categories={categories}
          articles={sectorArticles}
          coverageSlots={coverageSlots}
          pinnedArticles={pinnedArticles}
        />
      </div>
    </>
  );
}