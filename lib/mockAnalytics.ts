/**
 * Deterministic mock analytics for QA — mirrors shapes consumed by
 * AdminAnalyticsCharts and the /admin/analytics page without touching the DB.
 *
 * Enable via NEXT_PUBLIC_MOCK_ANALYTICS=true (see lib/analytics-data-source.ts).
 */

import { CATEGORIES, CATEGORY_DETAILS } from '@/lib/constants';
import type { AnalyticsPeriod } from '@/lib/analytics-period';
import { getMonthOptions, PERIOD_LABELS } from '@/lib/analytics-period';

/** Bangladesh readership regions — supplemental segment data for QA spot-checks */
export type RegionalTrafficSegment = {
  region: string;
  readers: number;
  share: number;
  color: string;
};

export type MockAnalyticsPayload = {
  generatedAt: string;
  filters: {
    period: AnalyticsPeriod;
    month: string | null;
    periodLabel: string;
    rangeLabel: string;
    compareLabel: string | null;
  };
  monthOptions: ReturnType<typeof getMonthOptions>;
  articleCount: number;
  userCount: number;
  totalViews: number;
  publishedCount: number;
  draftCount: number;
  scheduledCount: number;
  archivedCount: number;
  trashCount: number;
  featuredCount: number;
  breakingCount: number;
  pinnedCount: number;
  categoryCount: number;
  mediaCount: number;
  magazineCount: number;
  newsletterCount: number;
  pendingComments: number;
  approvedComments: number;
  spamComments: number;
  pendingNotices: number;
  nodeCount: number;
  edgeCount: number;
  recentLogs: { id: string; type: string; message: string; timestamp: string }[];
  topArticles: {
    id: string;
    title: string;
    slug: string;
    views: number;
    category: string;
    likes: number;
    color?: string;
  }[];
  categoryColors: Record<string, string>;
  usersByRole: { role: string; _count: number }[];
  topAuthors: { id: string; name: string; role: string; articles: number; views: number }[];
  contentPipeline: { status: string; count: number; color: string }[];
  publishingTrend: { label: string; count: number; views: number }[];
  monthlySnapshots: { label: string; published: number; subscribers: number; comments: number }[];
  periodComparison: {
    label: string;
    published: { current: number; previous: number; delta: number };
    subscribers: { current: number; previous: number; delta: number };
    comments: { current: number; previous: number; delta: number };
    newUsers: { current: number; previous: number; delta: number };
  } | null;
  categoriesByViews: { category: string; articles: number; views: number; color?: string }[];
  totalLikes: number;
  avgViewsPerArticle: number;
  avgReadTime: number;
  articlesMissingImage: number;
  periodMetrics: {
    published: number;
    subscribers: number;
    comments: number;
    newUsers: number;
    activeUsers: number;
    auditEvents: number;
    periodViews: number;
  };
  engagement: {
    totalLikes: number;
    avgViewsPerArticle: number;
    avgReadTime: number;
    commentTotal: number;
  };
  ads: {
    total: number;
    active: number;
    impressions: number;
    clicks: number;
    ctr: number;
    slots: {
      id: string;
      name: string;
      position: string;
      isActive: boolean;
      impressions: number;
      clicks: number;
      ctr: number;
    }[];
  };
  platform: {
    carouselMode: 'demo' | 'managed';
    homepageManaged: boolean;
  };
  /** Active reader count + regional breakdown for visual QA */
  activeReaders: number;
  regionalTraffic: RegionalTrafficSegment[];
};

const REGIONAL_COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#6366f1', '#14b8a6'];

const REGIONAL_TRAFFIC: RegionalTrafficSegment[] = [
  { region: 'Dhaka Metro', readers: 48200, share: 34.2, color: REGIONAL_COLORS[0] },
  { region: 'Chattogram', readers: 21800, share: 15.5, color: REGIONAL_COLORS[1] },
  { region: 'Rajshahi', readers: 12400, share: 8.8, color: REGIONAL_COLORS[2] },
  { region: 'Khulna', readers: 10900, share: 7.7, color: REGIONAL_COLORS[3] },
  { region: 'Sylhet', readers: 9800, share: 7.0, color: REGIONAL_COLORS[4] },
  { region: 'Barishal', readers: 7600, share: 5.4, color: REGIONAL_COLORS[5] },
  { region: 'Rangpur', readers: 7100, share: 5.0, color: REGIONAL_COLORS[6] },
];

/** Fixed 14-day trend — bar heights and line coordinates are predictable for screenshot diffing */
const PUBLISHING_TREND: MockAnalyticsPayload['publishingTrend'] = [
  { label: 'Jun 6', count: 3, views: 4200 },
  { label: 'Jun 7', count: 5, views: 6100 },
  { label: 'Jun 8', count: 2, views: 2800 },
  { label: 'Jun 9', count: 7, views: 9400 },
  { label: 'Jun 10', count: 4, views: 5200 },
  { label: 'Jun 11', count: 6, views: 7800 },
  { label: 'Jun 12', count: 8, views: 11200 },
  { label: 'Jun 13', count: 3, views: 3900 },
  { label: 'Jun 14', count: 9, views: 12800 },
  { label: 'Jun 15', count: 5, views: 6700 },
  { label: 'Jun 16', count: 4, views: 5100 },
  { label: 'Jun 17', count: 6, views: 8200 },
  { label: 'Jun 18', count: 7, views: 9600 },
  { label: 'Jun 19', count: 10, views: 14500 },
];

function buildCategoryBreakdown(): MockAnalyticsPayload['categoriesByViews'] {
  const weights = [18, 14, 12, 11, 10, 9, 8, 7, 6, 5];
  return CATEGORIES.map((category, i) => {
    const articles = weights[i];
    const views = articles * (1200 + i * 340);
    return {
      category,
      articles,
      views,
      color: CATEGORY_DETAILS[category].color,
    };
  }).sort((a, b) => b.views - a.views);
}

function buildTopArticles(): MockAnalyticsPayload['topArticles'] {
  const headlines = [
    'BERC approves revised bulk tariff for FY2026',
    'Rooppur Unit-1 reaches 95% generation capacity',
    'BPDB seeks emergency LNG cargo for peak summer',
    'PGCB completes 400kV Sylhet corridor upgrade',
    'Solar rooftop policy draft opens public comment',
    'DESCO reports 12% reduction in system losses',
    'Cross-border power import from India resumes',
    'National grid frequency stability hits 5-year high',
  ];
  const viewCounts = [18420, 15200, 12840, 10900, 9650, 8120, 7340, 6200];

  return headlines.map((title, i) => {
    const category = CATEGORIES[i % CATEGORIES.length];
    return {
      id: `mock-article-${i + 1}`,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      views: viewCounts[i],
      category,
      likes: Math.round(viewCounts[i] * 0.08),
      color: CATEGORY_DETAILS[category].color,
    };
  });
}

export type MockAnalyticsOptions = {
  period?: AnalyticsPeriod;
  month?: string | null;
};

/**
 * Returns a full analytics payload identical in shape to getAnalytics().
 * Values are fixed so chart bar heights, donut slices, and trend lines
 * render the same on every refresh — ideal for visual regression QA.
 */
export function getMockAnalytics(options?: MockAnalyticsOptions): MockAnalyticsPayload {
  const now = new Date('2026-06-19T12:00:00.000Z');
  const period = options?.period ?? 'monthly';
  const month = options?.month ?? null;
  const categoriesByViews = buildCategoryBreakdown();
  const periodViews = categoriesByViews.reduce((s, c) => s + c.views, 0);
  const publishedCount = 248;
  const totalViews = 1_412_800;
  const activeReaders = REGIONAL_TRAFFIC.reduce((s, r) => s + r.readers, 0);

  const categoryColors = Object.fromEntries(
    CATEGORIES.map((c) => [c, CATEGORY_DETAILS[c].color]),
  );

  return {
    generatedAt: now.toISOString(),
    filters: {
      period,
      month,
      periodLabel: month ? 'Calendar month' : PERIOD_LABELS[period],
      rangeLabel: month ?? 'Last 14 days',
      compareLabel: month ? 'vs May 2026' : 'Prior last 14 days',
    },
    monthOptions: getMonthOptions(12, now).map((o, i) => ({
      ...o,
      count: i < 4 ? 12 - i * 2 : 0,
      description: i < 4 ? `${12 - i * 2} posts · ${(8 - i) * 1.2}k views` : 'No publishes · daily trend only',
      dot: i < 4 ? `hsl(${148 + (i * 7) % 40} 65% 44%)` : 'hsl(var(--muted-foreground) / 0.35)',
    })),
    articleCount: 312,
    userCount: 1842,
    totalViews,
    publishedCount,
    draftCount: 34,
    scheduledCount: 12,
    archivedCount: 18,
    trashCount: 10,
    featuredCount: 6,
    breakingCount: 2,
    pinnedCount: 3,
    categoryCount: CATEGORIES.length,
    mediaCount: 428,
    magazineCount: 14,
    newsletterCount: 3260,
    pendingComments: 17,
    approvedComments: 842,
    spamComments: 23,
    pendingNotices: 4,
    nodeCount: 156,
    edgeCount: 204,
    recentLogs: [
      { id: 'log-1', type: 'ARTICLE_PUBLISHED', message: 'Published: BERC approves revised bulk tariff for FY2026', timestamp: '2026-06-19T09:14:00.000Z' },
      { id: 'log-2', type: 'COMMENT_MODERATED', message: 'Approved 3 pending comments on Rooppur coverage', timestamp: '2026-06-19T08:42:00.000Z' },
      { id: 'log-3', type: 'USER_ROLE_CHANGED', message: 'Editor role assigned to Mehedi Hasan Hamim', timestamp: '2026-06-18T16:20:00.000Z' },
      { id: 'log-4', type: 'SETTINGS_UPDATED', message: 'Homepage carousel switched to managed mode', timestamp: '2026-06-18T11:05:00.000Z' },
    ],
    topArticles: buildTopArticles(),
    categoryColors,
    usersByRole: [
      { role: 'SUBSCRIBER', _count: 1420 },
      { role: 'AUTHOR', _count: 186 },
      { role: 'EDITOR', _count: 42 },
      { role: 'CONTRIBUTOR', _count: 128 },
      { role: 'ADMIN', _count: 8 },
      { role: 'SUPER_ADMIN', _count: 2 },
    ],
    topAuthors: [
      { id: 'author-1', name: 'Mehedi Hasan Hamim', role: 'EDITOR', articles: 20, views: 0 },
    ],
    contentPipeline: [
      { status: 'Published', count: publishedCount, color: '#10b981' },
      { status: 'Draft', count: 34, color: '#f59e0b' },
      { status: 'Scheduled', count: 12, color: '#3b82f6' },
      { status: 'Archived', count: 18, color: '#8b5cf6' },
      { status: 'Trash', count: 10, color: '#64748b' },
    ],
    publishingTrend: PUBLISHING_TREND,
    monthlySnapshots: [
      { label: 'Jan', published: 18, subscribers: 142, comments: 86 },
      { label: 'Feb', published: 22, subscribers: 168, comments: 94 },
      { label: 'Mar', published: 20, subscribers: 155, comments: 102 },
      { label: 'Apr', published: 26, subscribers: 201, comments: 118 },
      { label: 'May', published: 24, subscribers: 189, comments: 109 },
      { label: 'Jun', published: 28, subscribers: 224, comments: 131 },
    ],
    periodComparison: {
      label: 'vs prior period',
      published: { current: 28, previous: 24, delta: 16.7 },
      subscribers: { current: 224, previous: 189, delta: 18.5 },
      comments: { current: 131, previous: 109, delta: 20.2 },
      newUsers: { current: 86, previous: 72, delta: 19.4 },
    },
    categoriesByViews,
    totalLikes: 112840,
    avgViewsPerArticle: Math.round(totalViews / publishedCount),
    avgReadTime: 4,
    articlesMissingImage: 7,
    periodMetrics: {
      published: 28,
      subscribers: 224,
      comments: 131,
      newUsers: 86,
      activeUsers: activeReaders,
      auditEvents: 42,
      periodViews,
    },
    engagement: {
      totalLikes: 112840,
      avgViewsPerArticle: Math.round(totalViews / publishedCount),
      avgReadTime: 4,
      commentTotal: 882,
    },
    ads: {
      total: 4,
      active: 3,
      impressions: 284000,
      clicks: 4260,
      ctr: 1.5,
      slots: [
        { id: 'ad-1', name: 'Homepage Leaderboard', position: 'homepage-top', isActive: true, impressions: 142000, clicks: 2480, ctr: 1.75 },
        { id: 'ad-2', name: 'Article Sidebar', position: 'article-rail', isActive: true, impressions: 86000, clicks: 1120, ctr: 1.3 },
        { id: 'ad-3', name: 'Newsletter Footer', position: 'footer', isActive: true, impressions: 42000, clicks: 540, ctr: 1.29 },
        { id: 'ad-4', name: 'Category Banner', position: 'category-header', isActive: false, impressions: 14000, clicks: 120, ctr: 0.86 },
      ],
    },
    platform: {
      carouselMode: 'managed',
      homepageManaged: true,
    },
    activeReaders,
    regionalTraffic: REGIONAL_TRAFFIC,
  };
}

/** Chart-only slice — pass directly to AdminAnalyticsCharts in Storybook / dev harness */
export function getMockChartProps(options?: MockAnalyticsOptions) {
  const data = getMockAnalytics(options);
  return {
    filters: data.filters,
    topArticles: data.topArticles,
    usersByRole: data.usersByRole,
    publishingTrend: data.publishingTrend,
    categoriesByViews: data.categoriesByViews,
    contentPipeline: data.contentPipeline,
    monthlySnapshots: data.monthlySnapshots,
    periodComparison: data.periodComparison,
  };
}