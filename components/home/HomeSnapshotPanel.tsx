'use client';

import { BarChart3 } from 'lucide-react';
import { SnapshotSourcesLine } from '@/components/home/SnapshotSourcesLine';
import { EnergyDashboard } from '@/components/news/EnergyDashboard';
import { useLocale } from '@/components/shared/LocaleProvider';
import { localizeSnapshotLabel } from '@/lib/i18n/homepage-copy';

export function HomeSnapshotPanel({
  snapshotStats,
  snapshotLabel,
  layout = 'rail',
}: {
  snapshotStats?: unknown;
  snapshotLabel: string;
  layout?: 'rail' | 'hero-rail';
}) {
  const { locale, t } = useLocale();
  const localizedSnapshotLabel = localizeSnapshotLabel(snapshotLabel, locale);
  const parts = localizedSnapshotLabel
    .split(/\s*•\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
  const [liveWord, ...agencies] = parts;
  const sourcesText = agencies.join(' • ');
  const isHeroRail = layout === 'hero-rail';

  const formattedDate = new Date().toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const headerDate = new Date().toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (isHeroRail) {
    return (
      <section
        className="home-snapshot-hero-shell flex flex-col h-full bg-transparent lg:min-h-[var(--home-hero-band-card-h)] lg:h-[var(--home-hero-band-card-h)] lg:max-h-[var(--home-hero-band-card-h)] overflow-hidden relative"
        aria-labelledby="home-snapshot-title"
      >
        <div className="flex flex-col h-full justify-between relative z-10">
          <div className="flex-shrink-0 pb-3 border-b border-border/10 dark:border-border/20 mb-2">
            <div className="flex items-center justify-between gap-2 w-full">
              <div className="flex items-center gap-1.5 min-w-0">
                <BarChart3 className="h-6 w-6 text-primary shrink-0 animate-pulse" style={{ animationDuration: '3s' }} aria-hidden />
                <h2 id="home-snapshot-title" className="m-0 p-0 py-0.5 text-lg md:text-xl font-display font-extrabold tracking-tight text-foreground truncate leading-tight">
                  {t('home.systemSnapshot')}
                </h2>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground/60 dark:text-muted-foreground/50 select-none leading-none">
                  {locale === 'bn' ? 'আপডেট: ' : 'UPDATED: '}{headerDate}
                </span>
                <span className="inline-flex items-center gap-1 rounded border border-rose-500/20 bg-rose-500/10 px-1.5 py-0.5 text-[9px] md:text-[9.5px] font-display font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400 select-none transition-colors duration-300 shadow-[0_1px_2px_rgba(244,63,94,0.03)] leading-none mt-1.5">
                  <span className="relative flex h-1 w-1 mx-0.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1 w-1 bg-rose-500" />
                  </span>
                  {liveWord}
                </span>
              </div>
            </div>
          </div>
          <div className="flex-grow min-h-0 flex flex-col justify-center">
            <EnergyDashboard initialStats={snapshotStats as never} compact fillHeight />
          </div>
          {sourcesText && (
            <div className="flex-shrink-0 pt-3 border-t border-border/10 dark:border-border/20 mt-2">
              <div className="flex flex-col items-end w-full gap-0.5 text-[9px] xs:text-[10px] md:text-[11px] text-muted-foreground font-mono font-medium italic opacity-75 text-right">
                <div className="flex items-center justify-end gap-1 w-full whitespace-nowrap">
                  <span className="font-semibold text-foreground/50 tracking-wider not-italic">{locale === 'bn' ? 'তথ্য সূত্র:' : 'DATA:'}</span>
                  <span>{sourcesText}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
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