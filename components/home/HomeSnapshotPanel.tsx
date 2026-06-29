'use client';

import Link from 'next/link';
import { ArrowUpRight, BarChart3 } from 'lucide-react';
import { EnergyDashboard } from '@/components/news/EnergyDashboard';
import { useLocale } from '@/components/shared/LocaleProvider';
import { formatSnapshotHeaderDate, localizeSnapshotLabel } from '@/lib/i18n/homepage-copy';

function SnapshotSegment({
  snapshotStats,
  snapshotLabel,
  snapshotDate,
  headerDate,
}: {
  snapshotStats?: unknown;
  snapshotLabel: string;
  snapshotDate?: string;
  headerDate: string;
}) {
  const { locale, t } = useLocale();
  const localizedSnapshotLabel = localizeSnapshotLabel(snapshotLabel, locale);
  const parts = localizedSnapshotLabel
    .split(/\s*•\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
  const [liveWord, ...agencies] = parts;
  const sourcesText = agencies.join(' • ');

  return (
    <section className="home-snapshot-segment" aria-labelledby="home-snapshot-title">
      <div className="home-snapshot-segment__card">
        <header className="home-snapshot-segment__head">
          <div className="home-snapshot-segment__title-block">
            <Link href="/data-reports/power-grid" className="home-snapshot-segment__title-link group">
              <BarChart3 className="home-snapshot-segment__icon" aria-hidden />
              <h2 id="home-snapshot-title" className="home-snapshot-segment__title">
                {t('home.systemSnapshot')}
              </h2>
              <ArrowUpRight
                className="home-snapshot-segment__title-arrow opacity-0 transition-opacity duration-200 group-hover:opacity-70"
                aria-hidden
              />
            </Link>
            <p className="home-snapshot-segment__kicker">
              {locale === 'bn' ? 'দৈনিক গ্রিড পরিসংখ্যান' : 'Daily grid telemetry'}
            </p>
          </div>
          <div className="home-snapshot-segment__meta">
            <span className="home-snapshot-segment__updated">
              {locale === 'bn' ? 'আপডেট ' : 'Updated '}
              <time dateTime={snapshotDate ?? headerDate}>{headerDate}</time>
            </span>
            <span className="home-snapshot-segment__live">
              <span className="home-snapshot-segment__live-dot" aria-hidden>
                <span className="home-snapshot-segment__live-ping" />
                <span className="home-snapshot-segment__live-core" />
              </span>
              {liveWord}
            </span>
          </div>
        </header>

        <div className="home-snapshot-segment__body">
          <EnergyDashboard
            initialStats={snapshotStats as never}
            compact
            fillHeight
            variant="segment"
          />
        </div>

        {sourcesText ? (
          <footer className="home-snapshot-segment__foot">
            <span className="home-snapshot-segment__sources-label">
              {locale === 'bn' ? 'সূত্র' : 'Sources'}
            </span>
            <span className="home-snapshot-segment__sources-text">{sourcesText}</span>
          </footer>
        ) : null}
      </div>
    </section>
  );
}

export function HomeSnapshotPanel({
  snapshotStats,
  snapshotLabel,
  snapshotDate,
  snapshotHeaderDate,
  layout = 'rail',
}: {
  snapshotStats?: unknown;
  snapshotLabel: string;
  snapshotDate?: string;
  snapshotHeaderDate?: string;
  layout?: 'rail' | 'segment';
}) {
  const { locale, t } = useLocale();
  const localizedSnapshotLabel = localizeSnapshotLabel(snapshotLabel, locale);
  const parts = localizedSnapshotLabel
    .split(/\s*•\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
  const [liveWord, ...agencies] = parts;
  const sourcesText = agencies.join(' • ');
  const headerDate =
    snapshotHeaderDate ?? formatSnapshotHeaderDate(snapshotDate, locale);

  if (layout === 'segment') {
    return (
      <SnapshotSegment
        snapshotStats={snapshotStats}
        snapshotLabel={snapshotLabel}
        snapshotDate={snapshotDate}
        headerDate={headerDate}
      />
    );
  }

  return (
    <section
      className="home-rail-panel home-block home-editorial__snapshot relative overflow-hidden bg-transparent flex flex-col gap-3"
      aria-labelledby="home-snapshot-title"
    >
      <div className="home-editorial__section-head flex items-center justify-between pb-3 border-b border-border/10 dark:border-border/20 shrink-0 relative z-10">
        <div className="flex items-center gap-2.5 min-w-0">
          <BarChart3 className="h-8 w-8 text-primary shrink-0" aria-hidden />
          <h2 id="home-snapshot-title" className="py-0.5 text-2xl md:text-3xl font-display font-extrabold tracking-tight text-foreground truncate leading-tight">
            {t('home.systemSnapshot')}
          </h2>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="text-[10px] md:text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground/60 dark:text-muted-foreground/50 select-none leading-none">
            {locale === 'bn' ? 'আপডেট: ' : 'UPDATED: '}{headerDate}
          </span>
          <span className="inline-flex items-center gap-1 rounded border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[9.5px] md:text-[10px] font-display font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400 select-none transition-colors duration-300 shadow-[0_1px_2px_rgba(244,63,94,0.03)] leading-none mt-1.5">
            <span className="relative flex h-1.5 w-1.5 mr-0.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500" />
            </span>
            {liveWord}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex-grow my-3">
        <EnergyDashboard initialStats={snapshotStats as never} compact fillHeight={false} />
      </div>

      {sourcesText && (
        <div className="flex-shrink-0 pt-3 border-t border-border/10 dark:border-border/20 relative z-10">
          <div className="flex flex-col items-end w-full gap-0.5 text-[10px] md:text-xs text-muted-foreground font-mono font-medium italic opacity-75 text-right">
            <div className="flex items-center justify-end gap-1 w-full whitespace-nowrap">
              <span className="font-semibold text-foreground/50 tracking-wider not-italic">{locale === 'bn' ? 'তথ্য সূত্র:' : 'DATA:'}</span>
              <span>{sourcesText}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}