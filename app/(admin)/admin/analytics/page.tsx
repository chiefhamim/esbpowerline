import Link from 'next/link';
import { Suspense } from 'react';
import {
  AdminPageHeader, AdminCard, AdminListRow,
  AdminMetricRow, AdminActivityItem, AdminActionPill,
} from '@/components/admin/AdminUI';
import { AdminAnalyticsCharts } from '@/components/admin/AdminAnalyticsCharts';
import { AdminAnalyticsToolbar } from '@/components/admin/AdminAnalyticsToolbar';
import { getAnalytics } from '@/lib/actions/analytics';
import { formatNumber } from '@/lib/utils';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import type { AnalyticsPeriod } from '@/lib/analytics-period';
import {
  BarChart3, Eye, FileText, Users, Megaphone,
  Image, BookOpen, AlertTriangle, Zap, Layers, Clock,
  CheckCircle, PenLine,
} from 'lucide-react';

type PageProps = {
  searchParams: Promise<{ period?: string; month?: string }>;
};

function pct(n: number, total: number) {
  if (total <= 0) return '0%';
  return `${((n / total) * 100).toFixed(1)}%`;
}

export default async function AdminAnalyticsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const stats = await getAnalytics({ period: params.period, month: params.month ?? null });

  const updated = new Date(stats.generatedAt).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });

  const pm = stats.periodMetrics;

  const primaryKpis = [
    { label: 'Views', value: formatNumber(stats.totalViews), hint: `${formatNumber(stats.avgViewsPerArticle)} / article`, icon: Eye },
    { label: 'Published', value: formatNumber(pm.published), hint: stats.filters.month ? stats.filters.rangeLabel : `${stats.filters.periodLabel} window`, icon: CheckCircle },
    { label: 'Active logins', value: formatNumber(pm.activeUsers), hint: 'In selected range', icon: Users },
    { label: 'Queue', value: formatNumber(stats.pendingComments + stats.pendingNotices), hint: `${stats.pendingComments} comments · ${stats.pendingNotices} notices`, icon: AlertTriangle },
  ];

  const secondaryKpis = [
    { label: 'Subs', value: formatNumber(pm.subscribers) },
    { label: 'Comments', value: formatNumber(pm.comments) },
    { label: 'New users', value: formatNumber(pm.newUsers) },
    { label: 'Likes', value: formatNumber(stats.totalLikes) },
    { label: 'Ads CTR', value: pct(stats.ads.clicks, stats.ads.impressions) },
    { label: 'Drafts', value: formatNumber(stats.draftCount) },
  ];

  const healthItems = [
    { label: 'Pending comments', value: stats.pendingComments, warn: stats.pendingComments > 0 },
    { label: 'Editorial notices', value: stats.pendingNotices, warn: stats.pendingNotices > 0 },
    { label: 'Missing images', value: stats.articlesMissingImage, warn: stats.articlesMissingImage > 0 },
    { label: 'Scheduled', value: stats.scheduledCount, warn: false },
  ];

  return (
    <div className="admin-analytics-page">
      <AdminPageHeader
        icon={BarChart3}
        title="Analytics"
        description="Operational metrics · filter by day, week, month, year, or focus a calendar month."
        className="admin-analytics-header"
      >
        <span className="admin-analytics-updated">Updated {updated}</span>
      </AdminPageHeader>

      <Suspense fallback={null}>
        <AdminAnalyticsToolbar
          period={stats.filters.period as AnalyticsPeriod}
          month={stats.filters.month}
          monthOptions={stats.monthOptions}
          rangeLabel={stats.filters.rangeLabel}
        />
      </Suspense>

      <div className="admin-analytics-quick-grid admin-analytics-quick-grid--top">
        <AdminActionPill href="/admin/articles" label="Articles" icon={FileText} description={`${stats.draftCount} drafts`} />
        <AdminActionPill href="/admin/media" label="Media" icon={Image} description={`${stats.mediaCount} files`} />
        <AdminActionPill href="/admin/magazine" label="Magazine" icon={BookOpen} description={`${stats.magazineCount} issues`} accent="emerald" />
        <AdminActionPill href="/admin/logs" label="Logs" icon={Clock} description="Audit trail" />
      </div>

      <div className="admin-analytics-kpi-primary">
        {primaryKpis.map((kpi) => (
          <div key={kpi.label} className="admin-analytics-kpi-primary-cell">
            <div className="admin-analytics-kpi-primary-top">
              <kpi.icon className="h-3 w-3 opacity-50" strokeWidth={2} />
              <span className="admin-analytics-kpi-primary-label">{kpi.label}</span>
            </div>
            <span className="admin-analytics-kpi-primary-value">{kpi.value}</span>
            <span className="admin-analytics-kpi-primary-hint">{kpi.hint}</span>
          </div>
        ))}
      </div>

      <div className="admin-analytics-kpi-secondary">
        {secondaryKpis.map((kpi) => (
          <div key={kpi.label} className="admin-analytics-kpi-secondary-cell">
            <span className="admin-analytics-kpi-secondary-label">{kpi.label}</span>
            <span className="admin-analytics-kpi-secondary-value">{kpi.value}</span>
          </div>
        ))}
      </div>

      <div className="admin-analytics-insight-grid">
        <AdminCard title="Editorial" icon={AlertTriangle} bodyClassName="admin-card-body--dense">
          {healthItems.map((item) => (
            <AdminMetricRow key={item.label} label={item.label} value={formatNumber(item.value)} highlight={item.warn} />
          ))}
          <div className="admin-analytics-flag-row">
            <span>{stats.featuredCount} feat</span>
            <span>{stats.breakingCount} break</span>
            <span>{stats.pinnedCount} pin</span>
          </div>
        </AdminCard>

        <AdminCard title="Platform" icon={Zap} bodyClassName="admin-card-body--dense">
          <AdminMetricRow label="Carousel" value={stats.platform.carouselMode === 'managed' ? 'DB' : 'Demo'} highlight={stats.platform.carouselMode === 'managed'} />
          <AdminMetricRow label="Live articles" value={formatNumber(stats.publishedCount)} />
          <AdminMetricRow label="Magazine" value={formatNumber(stats.magazineCount)} />
          <AdminMetricRow label="Grid nodes" value={formatNumber(stats.nodeCount)} />
          <Link href="/admin/settings" className="admin-analytics-link">Settings →</Link>
        </AdminCard>

        <AdminCard title="Authors" icon={PenLine} bodyClassName="admin-card-body--dense">
          {stats.topAuthors.length > 0 ? stats.topAuthors.map((author, i) => (
            <AdminListRow key={author.id} rank={i + 1} title={author.name} meta={`${author.articles}p`} value={formatNumber(author.views)} />
          )) : (
            <p className="admin-analytics-empty">No authors in period.</p>
          )}
        </AdminCard>
      </div>

      <AdminAnalyticsCharts
        filters={stats.filters}
        topArticles={stats.topArticles}
        usersByRole={stats.usersByRole}
        publishingTrend={stats.publishingTrend}
        categoriesByViews={stats.categoriesByViews}
        contentPipeline={stats.contentPipeline}
        monthlySnapshots={stats.monthlySnapshots}
        periodComparison={stats.periodComparison}
      />

      <div className="admin-analytics-footer-grid">
        <AdminCard title="Ads" icon={Megaphone} bodyClassName="admin-card-body--dense">
          {stats.ads.slots.length > 0 ? stats.ads.slots.map((ad) => (
            <AdminListRow
              key={ad.id}
              title={ad.name}
              meta={`${ad.position} · ${ad.ctr.toFixed(1)}%`}
              value={formatNumber(ad.impressions)}
            />
          )) : (
            <p className="admin-analytics-empty">No ad slots.</p>
          )}
        </AdminCard>

        <AdminCard title="Activity" icon={Layers} bodyClassName="admin-card-body--dense">
          {stats.recentLogs.length > 0 ? stats.recentLogs.map((log) => (
            <AdminActivityItem
              key={log.id}
              badge={<StatusBadge status={log.type.split('.')[1]?.toUpperCase() ?? 'LOG'} />}
              date={new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              message={log.message}
            />
          )) : (
            <p className="admin-analytics-empty">No events in range.</p>
          )}
        </AdminCard>
      </div>
    </div>
  );
}