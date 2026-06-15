import Link from 'next/link';
import { ArrowRight, Zap, BarChart3, BookOpen, TrendingUp, Briefcase } from 'lucide-react';
import { EnergyDashboard } from '@/components/news/EnergyDashboard';
import { SectorCoverage } from '@/components/news/SectorCoverage';
import type { TickerItem } from '@/components/news/LiveMarketTicker';
import { FeaturedCarousel } from '@/components/news/FeaturedCarousel';
import { InterviewsSection } from '@/components/news/InterviewsSection';
import {
  getPublicSettingsMap,
  getCarouselItems,
  getSnapshotLabel,
  getProfessionalsCta,
  getCoverageSlotsFromSettings,
} from '@/lib/homepage-content';
import { resolveCoverageSlots } from '@/lib/coverage-content';
import {
  getPublicCategories,
  getPublishedArticlesForPublic,
  getTrendingPublishedArticles,
  getLatestMagazineIssue,
} from '@/lib/category-content';

export const metadata = {
  title: 'ESB PowerLine — Bangladesh Energy & Power News',
  description: "Bangladesh's premier source for power sector news, renewable energy, policy, projects & tenders, grid explorer, and the monthly magazine.",
  openGraph: {
    title: 'ESB PowerLine — Bangladesh Energy & Power News',
    description: 'Authoritative coverage of generation, renewables, policy, grid infrastructure and the projects shaping the sector.',
  },
};

export default async function Home() {
  const settings = await getPublicSettingsMap();
  const coverageSlotConfig = getCoverageSlotsFromSettings(settings);
  const [trending, magazineRow, categories, sectorArticles, carouselItems, coverageSlots] = await Promise.all([
    getTrendingPublishedArticles(5),
    getLatestMagazineIssue(),
    getPublicCategories(),
    getPublishedArticlesForPublic(40),
    getCarouselItems(settings),
    resolveCoverageSlots(coverageSlotConfig),
  ]);
  const magazine = magazineRow ?? {
    title: 'ESB PowerLine Monthly',
    summary: 'In-depth analysis on Bangladesh power sector policy, projects and data.',
    coverUrl: '/images/demo_magazine_cover.jpg',
    issueDate: new Date(),
  };
  const magazineLabel = magazineRow
    ? magazineRow.issueDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Latest';
  const snapshotLabel = getSnapshotLabel(settings);
  const professionalsCta = getProfessionalsCta(settings);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <FeaturedCarousel
          items={carouselItems}
          tickerItems={settings.ticker as TickerItem[] | undefined}
        />

        <InterviewsSection initialInterviews={settings.interviews as Parameters<typeof InterviewsSection>[0]['initialInterviews']} />

        <div className="container py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight">Live System Snapshot</h2>
            </div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{snapshotLabel}</span>
          </div>
          <EnergyDashboard initialStats={settings.snapshot as Parameters<typeof EnergyDashboard>[0]['initialStats']} />
        </div>

        <div className="container py-8">
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight">Power Sector</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Browse coverage across all sectors or filter to a specific one.</p>
          </div>

          <SectorCoverage hideHeader categories={categories} articles={sectorArticles} coverageSlots={coverageSlots} />
        </div>

        <div className="container py-8">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <h3 className="font-display font-bold text-xl md:text-2xl tracking-tight mb-5 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Trending this week
              </h3>
              <div className="space-y-4">
                {trending.map((a, i) => (
                  <Link key={a.slug} href={`/articles/${a.slug}`} className="group block">
                    <div className="flex gap-3">
                      <div className="text-[10px] text-muted-foreground tabular-nums w-4 mt-0.5">{(i + 1).toString().padStart(2, '0')}</div>
                      <div>
                        <div className="font-medium leading-snug group-hover:text-primary transition line-clamp-2">{a.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{a.category} · {a.views.toLocaleString()} views</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="card p-6 h-full flex flex-col justify-between bg-card hover:shadow-xl transition-all duration-300">
                <div>
                  <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400 mb-3">
                    <BookOpen className="h-4 w-4" />
                    <span className="uppercase tracking-[2px] text-[10px] font-bold">Monthly Magazine</span>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-lg leading-tight tracking-tight mb-2 line-clamp-3">{magazine.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-4 leading-relaxed">{magazine.summary}</p>
                    </div>
                    <div className="w-20 sm:w-24 shrink-0 relative group/cover">
                      <div className="aspect-[3/4] rounded shadow-[4px_6px_12px_rgba(0,0,0,0.3)] dark:shadow-[4px_6px_16px_rgba(0,0,0,0.55)] border border-border/40 overflow-hidden bg-muted transition-transform duration-300 group-hover/cover:-translate-y-1 group-hover/cover:rotate-2">
                        <img src={magazine.coverUrl} alt={magazine.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-r from-black/35 via-transparent to-transparent opacity-90 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <Link href="/magazine" className="mt-5 inline-flex items-center text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                  Read {magazineLabel} Issue <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="card p-6 h-full flex flex-col justify-between bg-card">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[2px] text-muted-foreground font-bold mb-3">
                    <Briefcase className="h-4 w-4 text-primary" />
                    {professionalsCta.label}
                  </div>
                  <div className="text-lg font-display font-semibold leading-snug mb-2">{professionalsCta.title}</div>
                </div>
                <div className="flex flex-col gap-2 mt-6">
                  <Link href={professionalsCta.primaryHref} className="btn btn-secondary w-full justify-center text-sm">
                    {professionalsCta.primaryLabel}
                  </Link>
                  <Link href={professionalsCta.secondaryHref} className="btn btn-primary w-full justify-center text-sm opacity-90">
                    {professionalsCta.secondaryLabel}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}