import { HomeBottomRow } from '@/components/home/HomeBottomRow';
import { HomePowerSector } from '@/components/home/HomePowerSector';
import { HomeSnapshotPanel } from '@/components/home/HomeSnapshotPanel';
import { HomeTrendingSection } from '@/components/home/HomeTrendingSection';
import type { TickerItem } from '@/components/news/LiveMarketTicker';
import { FeaturedCarousel } from '@/components/news/FeaturedCarousel';
import { InterviewsSection } from '@/components/news/InterviewsSection';
import { normalizeInterviews } from '@/lib/interview-content';
import {
  getPublicSettingsMap,
  getCarouselItems,
  getSnapshotLabel,
  getProfessionalsCta,
  getCoverageSlotsFromSettings,
  applyEditorialPlacementToCoverageSlots,
} from '@/lib/homepage-content';
import { getPinnedCoverageArticles, resolveCoverageSlots } from '@/lib/coverage-content';
import {
  getPublicCategories,
  getPublishedArticlesForPublic,
  getTrendingPublishedArticles,
  getLatestMagazineIssue,
} from '@/lib/category-content';
import { getLatestYoutubeInterviews } from '@/lib/youtube-channel';

export const revalidate = 60;

export const metadata = {
  title: 'ESB PowerLine — Bangladesh Energy & Power News',
  description:
    "Bangladesh's premier source for power sector news, renewable energy, policy, projects & tenders, grid explorer, and the monthly magazine.",
  openGraph: {
    title: 'ESB PowerLine — Bangladesh Energy & Power News',
    description:
      'Authoritative coverage of generation, renewables, policy, grid infrastructure and the projects shaping the sector.',
  },
};

export default async function Home() {
  const settingsPromise = getPublicSettingsMap();
  const [settings, trending, magazineRow, categories, sectorArticles, carouselItems, coverageSlots, pinnedArticles, interviews] =
    await Promise.all([
      settingsPromise,
      getTrendingPublishedArticles(5),
      getLatestMagazineIssue(),
      getPublicCategories(),
      getPublishedArticlesForPublic(24),
      settingsPromise.then((map) => getCarouselItems(map)),
      settingsPromise.then(async (map) => {
        const slots = getCoverageSlotsFromSettings(map);
        const withPlacement = await applyEditorialPlacementToCoverageSlots(slots);
        return resolveCoverageSlots(withPlacement);
      }),
      getPinnedCoverageArticles(),
      getLatestYoutubeInterviews(4),
    ]);

  const magazine = magazineRow ?? {
    title: 'ESB PowerLine Monthly',
    summary: 'In-depth analysis on Bangladesh power sector policy, projects and data.',
    coverUrl: '/images/banner.jpg',
    issueDate: new Date(),
  };
  const magazineLabel = magazineRow
    ? magazineRow.issueDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Latest';
  const snapshotLabel = getSnapshotLabel(settings);
  const professionalsCta = getProfessionalsCta(settings);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 home-page">
        <div className="container container--shell home-hero-band">
          <div className="home-hero-band__grid">
            <FeaturedCarousel
              items={carouselItems}
              tickerItems={settings.ticker as TickerItem[] | undefined}
              inBand
            />
            <HomeTrendingSection trending={trending} layout="hero-rail" />
          </div>
        </div>

        <div className="container container--shell home-editorial">
          <div className="home-editorial__grid">
            <div className="home-editorial__main">
              <InterviewsSection
                className="home-block home-editorial__interviews"
                initialInterviews={normalizeInterviews(interviews)}
              />
              <HomePowerSector
                categories={categories}
                sectorArticles={sectorArticles}
                coverageSlots={coverageSlots}
                pinnedArticles={pinnedArticles}
              />
            </div>

            <aside className="home-editorial__rail" aria-label="Sidebar">
              <HomeSnapshotPanel snapshotStats={settings.snapshot} snapshotLabel={snapshotLabel} />
            </aside>
          </div>

          <HomeBottomRow
            layout="split"
            magazine={magazine}
            magazineLabel={magazineLabel}
            professionalsCta={professionalsCta}
          />
        </div>
      </main>
    </div>
  );
}