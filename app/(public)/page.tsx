import Link from 'next/link';
import { ArrowRight, Zap, BarChart3, BookOpen, TrendingUp, Users, Briefcase } from 'lucide-react';
import { ArticleCard } from '@/components/news/ArticleCard';
import { EnergyDashboard } from '@/components/news/EnergyDashboard';
import { SectorCoverage } from '@/components/news/SectorCoverage';
import { FeaturedCarousel } from '@/components/news/FeaturedCarousel';
import { LiveMarketTicker } from '@/components/news/LiveMarketTicker';
import { InterviewsSection } from '@/components/news/InterviewsSection';
import { getTrendingArticles, getLatestMagazine } from '@/lib/data';

export const metadata = {
  title: 'ESB PowerLine — Bangladesh Energy & Power News',
  description: "Bangladesh's premier source for power sector news, renewable energy, policy, projects & tenders, grid explorer, and the monthly magazine.",
  openGraph: {
    title: 'ESB PowerLine — Bangladesh Energy & Power News',
    description: 'Authoritative coverage of generation, renewables, policy, grid infrastructure and the projects shaping the sector.',
  },
};

import prisma from '@/lib/prisma';

export default async function Home() {
  const trending = getTrendingArticles(5);
  const magazine = getLatestMagazine();

  // Load dynamic settings from database
  const settingsRecords = await prisma.siteSetting.findMany();
  const settings: Record<string, any> = {};
  for (const s of settingsRecords) {
    settings[s.key] = s.value;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Animated Professional Featured News Carousel */}
        <FeaturedCarousel />

        {/* Live Market Update (from BD_PWR_Tree inspiration) */}
        <LiveMarketTicker initialItems={settings.ticker} />

        {/* In Conversation / Latest Interviews — right under Live Market */}
        <InterviewsSection initialInterviews={settings.interviews} />

        {/* Live System Snapshot + Pricing */}
        <div className="container py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight">Live System Snapshot</h2>
            </div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Live • BPDB • PGCB • SREDA • Petrobangla</span>
          </div>
          <EnergyDashboard initialStats={settings.snapshot} />

          {/* Moving informative market/pricing line (no heavy ruler) */}
          <div className="mt-3 text-[11px] text-muted-foreground flex items-center gap-2 overflow-hidden">
            <span className="shrink-0 font-medium text-emerald-400/90">MARKET PULSE:</span> 
            <div className="flex-1 overflow-hidden">
              <div className="animate-[marquee_25s_linear_infinite] flex gap-8 whitespace-nowrap text-[11px]">
                LNG spot firming • Solar module prices -2.1% WoW • BDT volatility impacting IPP margins • Coal API2 steady at $102 • New 8.95 Tk/kWh bulk tariff in effect
              </div>
            </div>
          </div>
        </div>

        {/* Power Sector Section - tabs for All Coverage + the 10 categories (no separate horizontal category list) */}
        <div className="container py-8">
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight">Power Sector</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Browse coverage across all sectors or filter to a specific one.</p>
          </div>

          <SectorCoverage hideHeader />
        </div>

        {/* Bottom Content: Trending + Magazine + CTA (even gap) */}
        <div className="container py-8">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Trending */}
            <div className="lg:col-span-5">
              <h3 className="font-display font-bold text-xl md:text-2xl tracking-tight mb-5 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Trending this week
              </h3>
              <div className="space-y-4">
                {trending.map((a, i) => (
                  <Link key={i} href={`/articles/${a.slug}`} className="group block">
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

            {/* Magazine Teaser */}
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
                    {/* Skeuomorphic Cover Image */}
                    <div className="w-20 sm:w-24 shrink-0 relative group/cover">
                      <div className="aspect-[3/4] rounded shadow-[4px_6px_12px_rgba(0,0,0,0.3)] dark:shadow-[4px_6px_16px_rgba(0,0,0,0.55)] border border-border/40 overflow-hidden bg-muted transition-transform duration-300 group-hover/cover:-translate-y-1 group-hover/cover:rotate-2">
                        <img src={magazine.coverUrl} alt={magazine.title} className="w-full h-full object-cover" />
                      </div>
                      {/* Spine shading for realistic bound feel */}
                      <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-r from-black/35 via-transparent to-transparent opacity-90 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <Link href="/magazine" className="mt-5 inline-flex items-center text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                  Read June 2026 Issue <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </div>
            </div>

            {/* Quick professional CTA */}
            <div className="lg:col-span-3">
              <div className="card p-6 h-full flex flex-col justify-between bg-card">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[2px] text-muted-foreground font-bold mb-3">
                    <Briefcase className="h-4 w-4 text-primary" />
                    FOR PROFESSIONALS
                  </div>
                  <div className="text-lg font-display font-semibold leading-snug mb-2">Access detailed data reports, tenders &amp; the full archive.</div>
                </div>
                <div className="flex flex-col gap-2 mt-6">
                  <Link href="/data-reports/power-grid" className="btn btn-secondary w-full justify-center text-sm">
                    Open Grid Explorer
                  </Link>
                  <Link href="/login" className="btn btn-primary w-full justify-center text-sm opacity-90">
                    Institutional Login
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
