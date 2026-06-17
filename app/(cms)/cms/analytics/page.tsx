import Link from 'next/link';
import { getAuthorAnalytics } from '@/lib/actions/analytics';
import { auth } from '@/lib/auth';
import { can } from '@/lib/constants';
import { formatNumber } from '@/lib/utils';
import { publicArticleUrl } from '@/lib/public-site-url';
import {
  CmsPageHeader, CmsStatCard, CmsCard, CmsListRow, CmsMetricRow,
  CmsSectionStack, CmsStatGrid, CmsCardGrid, CmsListStack, CmsScheduleList,
} from '@/components/cms/CmsUI';
import { BarChart3, Eye, FileText, Heart, CheckCircle, Clock, Users, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function CMSAnalyticsPage() {
  const session = await auth();
  if (!session?.user || !can(session.user.role, 'analytics.view_own')) {
    return (
      <CmsSectionStack>
        <CmsPageHeader
          icon={BarChart3}
          title="Performance"
          description="Analytics are not available for your role."
        />
        <CmsCard title="Access restricted" icon={BarChart3}>
          <p className="text-[13px] text-muted-foreground">
            Contact your editorial lead if you need performance metrics for your stories.
          </p>
        </CmsCard>
      </CmsSectionStack>
    );
  }

  let stats: Awaited<ReturnType<typeof getAuthorAnalytics>>;
  try {
    stats = await getAuthorAnalytics();
  } catch {
    return (
      <CmsSectionStack>
        <CmsPageHeader
          icon={BarChart3}
          title="Performance"
          description="Could not load analytics right now."
        />
        <CmsCard title="Something went wrong" icon={BarChart3}>
          <p className="text-[13px] text-muted-foreground">
            Try refreshing the page. If this keeps happening, the database may still be starting up.
          </p>
        </CmsCard>
      </CmsSectionStack>
    );
  }
  const { totals, benchmarks } = stats;

  const updated = new Date(stats.generatedAt).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });

  const vsNewsroom = benchmarks.viewsVsNewsroom;
  const vsLabel = vsNewsroom === 0
    ? 'On par with newsroom average'
    : vsNewsroom > 0
      ? `${vsNewsroom}% above newsroom avg`
      : `${Math.abs(vsNewsroom)}% below newsroom avg`;

  return (
    <CmsSectionStack>
      <CmsPageHeader
        icon={BarChart3}
        title="Performance"
        description="How your stories compare across the newsroom."
      >
        <span className="text-[12px] text-muted-foreground">Updated {updated}</span>
      </CmsPageHeader>

      <CmsStatGrid>
        <CmsStatCard title="Total Views" value={formatNumber(totals.views)} icon={Eye} accent="sky" change={`${formatNumber(totals.avgViewsPerArticle)} / article`} />
        <CmsStatCard title="Published" value={formatNumber(totals.published)} icon={CheckCircle} accent="emerald" change={`${totals.publishedThisMonth} this month`} />
        <CmsStatCard
          title="Newsroom rank"
          value={benchmarks.rank ? `#${benchmarks.rank}` : '—'}
          icon={TrendingUp}
          accent="amber"
          change={benchmarks.totalEditors > 0 ? `of ${benchmarks.totalEditors} editors` : undefined}
        />
        <CmsStatCard title="Likes" value={formatNumber(totals.likes)} icon={Heart} accent="violet" change={`${benchmarks.yourViewsShare}% of newsroom views`} />
      </CmsStatGrid>

      <CmsCardGrid cols={3}>
        <CmsCard title="Editor leaderboard" icon={Users} className="lg:col-span-2">
          <p className="text-[12px] text-muted-foreground admin-card-lead">
            Published stories ranked by total views. {vsLabel}.
          </p>
          <CmsListStack>
            {stats.peers.map((peer, i) => (
              <div
                key={peer.authorId}
                className={cn(
                  'admin-leaderboard-row',
                  peer.isYou && 'admin-leaderboard-row--you',
                )}
              >
                <div className="admin-leaderboard-row__main">
                  <span className="admin-leaderboard-row__rank">{i + 1}</span>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{peer.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {peer.published} published · {formatNumber(peer.avgViews)} avg views
                    </div>
                  </div>
                </div>
                <div className="admin-leaderboard-row__stats">
                  <div className="font-semibold">{formatNumber(peer.views)}</div>
                  <div className="text-[10px] text-muted-foreground">{formatNumber(peer.likes)} likes</div>
                </div>
              </div>
            ))}
            {stats.peers.length === 0 && (
              <p className="text-[13px] text-muted-foreground py-2">No published editors yet.</p>
            )}
          </CmsListStack>
        </CmsCard>

        <CmsCard title="Benchmarks" icon={BarChart3}>
          <CmsListStack>
            <CmsMetricRow label="Your avg views" value={formatNumber(benchmarks.yourAvgViews)} />
            <CmsMetricRow label="Newsroom avg" value={formatNumber(benchmarks.newsroomAvgViews)} />
            <CmsMetricRow label="Views share" value={`${benchmarks.yourViewsShare}%`} />
            <CmsMetricRow label="Scheduled" value={formatNumber(totals.scheduled)} />
            <CmsMetricRow label="Drafts" value={formatNumber(totals.drafts)} />
          </CmsListStack>
        </CmsCard>
      </CmsCardGrid>

      <CmsCardGrid cols={3}>
        <CmsCard title="Top Articles" icon={BarChart3} className="lg:col-span-2">
          <CmsListStack>
            {stats.topArticles.map((a, i) => (
              <CmsListRow
                key={a.id}
                rank={i + 1}
                title={a.title}
                href={publicArticleUrl(a.slug)}
                meta={a.category}
                value={`${formatNumber(a.views)} views`}
              />
            ))}
            {stats.topArticles.length === 0 && (
              <p className="text-[13px] text-muted-foreground py-2">No published articles yet.</p>
            )}
          </CmsListStack>
        </CmsCard>

        <CmsCard title="Content Mix" icon={FileText}>
          <CmsListStack>
            {stats.categoryBreakdown.slice(0, 8).map((c) => (
              <CmsMetricRow key={c.category} label={c.category} value={`${c.count} · ${formatNumber(c.views)} views`} />
            ))}
            {stats.categoryBreakdown.length === 0 && (
              <p className="text-[13px] text-muted-foreground py-2">No category data yet.</p>
            )}
          </CmsListStack>
        </CmsCard>
      </CmsCardGrid>

      <CmsCard title="Recently Published" icon={Clock}>
        <CmsScheduleList>
          {stats.recentPublished.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-2 text-[13px]">
              <Link href={`/cms/articles/${a.id}/edit`} className="font-medium hover:text-sky-400 line-clamp-1 min-w-0">
                {a.title}
              </Link>
              <span className="text-muted-foreground shrink-0 tabular-nums text-[12px]">
                {formatNumber(a.views)} views
              </span>
            </div>
          ))}
        </CmsScheduleList>
      </CmsCard>
    </CmsSectionStack>
  );
}