'use client';

import { BarChart3 } from 'lucide-react';
import { SnapshotSourcesLine } from '@/components/home/SnapshotSourcesLine';
import { EnergyDashboard } from '@/components/news/EnergyDashboard';
import { useLocale } from '@/components/shared/LocaleProvider';
import { localizeSnapshotLabel } from '@/lib/i18n/homepage-copy';

export function HomeSnapshotPanel({
  snapshotStats,
  snapshotLabel,
}: {
  snapshotStats?: unknown;
  snapshotLabel: string;
}) {
  const { locale, t } = useLocale();
  const localizedSnapshotLabel = localizeSnapshotLabel(snapshotLabel, locale);

  return (
    <section className="home-rail-panel home-block home-editorial__snapshot" aria-labelledby="home-snapshot-title">
      <div className="home-editorial__section-head flex items-end justify-between gap-3 mb-3.5 md:mb-4">
        <div className="min-w-0">
          <SnapshotSourcesLine label={localizedSnapshotLabel} className="mb-1.5" />
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary shrink-0" aria-hidden />
            <h2 id="home-snapshot-title" className="text-2xl md:text-3xl font-display font-bold tracking-tight">
              {t('home.systemSnapshot')}
            </h2>
          </div>
        </div>
      </div>
      <EnergyDashboard initialStats={snapshotStats as never} compact />
    </section>
  );
}