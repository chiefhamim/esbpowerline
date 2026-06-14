'use client';

import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid, Legend,
  ComposedChart, Line,
} from 'recharts';
import { AdminCard } from '@/components/admin/AdminUI';
import { useChartTheme } from '@/components/admin/analytics/useChartTheme';
import { BarChart3, PieChart as PieIcon, TrendingUp, Layers, CalendarRange } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/utils';
import { ROLES, type Role } from '@/lib/constants';
import { formatDelta, PERIOD_ACCENTS } from '@/lib/analytics-period';
import { LiveArticleTextLink } from '@/components/shared/LiveArticleLink';
import type { AnalyticsPeriod } from '@/lib/analytics-period';

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: '#ff3f5e',
  ADMIN: '#8b5cf6',
  EDITOR: '#3b82f6',
  AUTHOR: '#10b981',
  CONTRIBUTOR: '#f59e0b',
  SUBSCRIBER: '#6b7280',
};

const FALLBACK_COLORS = ['#f43f5e', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#06b6d4'];

const tooltipStyle = {
  borderRadius: '8px',
  border: '1px solid hsl(var(--border))',
  background: 'hsl(var(--card))',
  fontSize: '11px',
  padding: '6px 10px',
};

type ChartProps = {
  filters: {
    period: AnalyticsPeriod;
    month: string | null;
    periodLabel: string;
    rangeLabel: string;
    compareLabel: string | null;
  };
  topArticles: { title: string; slug: string; views: number; category: string; likes?: number; color?: string }[];
  usersByRole: { role: string; _count: number }[];
  publishingTrend: { label: string; count: number; views: number }[];
  categoriesByViews: { category: string; articles: number; views: number; color?: string }[];
  contentPipeline: { status: string; count: number; color: string }[];
  monthlySnapshots: { label: string; published: number; subscribers: number; comments: number }[];
  periodComparison: {
    label: string;
    published: { current: number; previous: number; delta: number };
    subscribers: { current: number; previous: number; delta: number };
    comments: { current: number; previous: number; delta: number };
    newUsers: { current: number; previous: number; delta: number };
  } | null;
};

function roleLabel(role: string) {
  return ROLES[role as Role]?.name ?? role.replace(/_/g, ' ');
}

function roleColor(role: string, index: number) {
  return ROLE_COLORS[role] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

function DeltaBadge({ value }: { value: number }) {
  const up = value > 0;
  const flat = value === 0;
  return (
    <span
      className={`admin-analytics-delta ${flat ? 'admin-analytics-delta--flat' : up ? 'admin-analytics-delta--up' : 'admin-analytics-delta--down'}`}
    >
      {formatDelta(value)}
    </span>
  );
}

function truncateCat(name: string, max = 22) {
  return name.length > max ? `${name.slice(0, max)}…` : name;
}

function CategoryTrafficTooltip({
  active,
  payload,
  totalViews,
}: {
  active?: boolean;
  payload?: { payload?: { fullName?: string; articles?: number; views?: number; color?: string } }[];
  totalViews: number;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  if (!row?.fullName) return null;
  const color = row.color ?? FALLBACK_COLORS[0];
  const views = row.views ?? 0;
  const share = totalViews > 0 ? ((views / totalViews) * 100).toFixed(1) : '0';
  return (
    <div
      className="admin-analytics-category-tooltip"
      style={{ '--tip-accent': color } as React.CSSProperties}
    >
      <div className="admin-analytics-category-tooltip-head">
        <span className="admin-analytics-category-tooltip-dot" />
        <span className="admin-analytics-category-tooltip-name">{row.fullName}</span>
      </div>
      <div className="admin-analytics-category-tooltip-grid">
        <span><strong>{formatNumber(views)}</strong> views</span>
        <span><strong>{row.articles ?? 0}</strong> articles</span>
        <span><strong>{share}%</strong> of period</span>
      </div>
    </div>
  );
}

function PublishingTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { dataKey?: string; value?: number; color?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const posts = payload.find((p) => p.dataKey === 'count');
  const views = payload.find((p) => p.dataKey === 'views');
  return (
    <div className="admin-analytics-chart-tooltip">
      <div className="admin-analytics-chart-tooltip-label">{label}</div>
      <div className="admin-analytics-chart-tooltip-row">
        <span className="admin-analytics-chart-tooltip-dot" style={{ background: '#8b5cf6' }} />
        Published posts
        <strong>{formatNumber(Number(posts?.value ?? 0))}</strong>
      </div>
      <div className="admin-analytics-chart-tooltip-row">
        <span className="admin-analytics-chart-tooltip-dot admin-analytics-chart-tooltip-dot--line" style={{ background: 'currentColor' }} />
        Views on published
        <strong>{formatNumber(Number(views?.value ?? 0))}</strong>
      </div>
    </div>
  );
}

export function AdminAnalyticsCharts({
  filters,
  topArticles,
  usersByRole,
  publishingTrend,
  categoriesByViews,
  contentPipeline,
  monthlySnapshots,
  periodComparison,
}: ChartProps) {
  const chartTheme = useChartTheme();
  const periodAccent = PERIOD_ACCENTS[filters.period];
  const articles = topArticles.slice(0, 5);
  const maxArticleViews = articles[0]?.views ?? 1;

  const roleData = usersByRole
    .map((r) => ({ key: r.role, name: roleLabel(r.role), value: r._count }))
    .sort((a, b) => b.value - a.value);

  const totalUsers = roleData.reduce((sum, r) => sum + r.value, 0) || 1;
  const maxRoleCount = roleData[0]?.value ?? 1;

  const categories = categoriesByViews.slice(0, 8).map((c) => ({
    ...c,
    shortName: truncateCat(c.category),
    fullName: c.category,
  }));
  const totalCategoryViews = categories.reduce((sum, c) => sum + c.views, 0) || 1;

  const pipelineTotal = contentPipeline.reduce((s, p) => s + p.count, 0) || 1;
  const maxPipelineCount = Math.max(...contentPipeline.map((p) => p.count), 1);

  const trendTitle = filters.month
    ? `Published vs views · ${filters.rangeLabel}`
    : `Published vs views · ${filters.periodLabel}`;

  const maxPosts = Math.max(...publishingTrend.map((p) => p.count), 1);
  const maxViews = Math.max(...publishingTrend.map((p) => p.views), 1);

  const showMomChart = !filters.month && monthlySnapshots.length > 0;

  return (
    <div className="admin-analytics-charts">
      {(periodComparison || showMomChart) && (
        <div className={cn('admin-analytics-row admin-analytics-row--mom', !periodComparison && 'admin-analytics-row--mom-single')}>
          {periodComparison && (
            <AdminCard
              title="MoM comparison"
              icon={CalendarRange}
              className="admin-analytics-mom-card-wrap"
              bodyClassName="admin-card-body--dense"
              action={<span className="admin-analytics-summary">{periodComparison.label}</span>}
            >
              <p className="admin-analytics-mom-caption">Current period vs prior</p>
              <div className="admin-analytics-mom-grid admin-analytics-mom-grid--compact">
                {[
                  { label: 'Published', short: 'Posts', data: periodComparison.published, accent: '#8b5cf6' },
                  { label: 'Subscribers', short: 'Subs', data: periodComparison.subscribers, accent: '#3b82f6' },
                  { label: 'Comments', short: 'Cmts', data: periodComparison.comments, accent: '#10b981' },
                  { label: 'New users', short: 'Users', data: periodComparison.newUsers, accent: '#f59e0b' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="admin-analytics-mom-metric"
                    style={{ '--mom-accent': item.accent } as React.CSSProperties}
                  >
                    <span className="admin-analytics-mom-card-label">{item.short}</span>
                    <div className="admin-analytics-mom-card-main">
                      <span className="admin-analytics-mom-card-current">{formatNumber(item.data.current)}</span>
                      <DeltaBadge value={item.data.delta} />
                    </div>
                    <span className="admin-analytics-mom-card-prev">
                      Prior {formatNumber(item.data.previous)}
                    </span>
                  </div>
                ))}
              </div>
            </AdminCard>
          )}

          {showMomChart && (
            <AdminCard
              title="Month over month"
              icon={BarChart3}
              className="admin-analytics-mom-chart-wrap"
              bodyClassName="admin-card-body--dense"
              action={<span className="admin-analytics-summary">12-mo rolling</span>}
            >
              <div className="admin-analytics-chart-area admin-analytics-chart-area--mom">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySnapshots} margin={{ top: 10, right: 8, left: -12, bottom: 56 }}>
                    <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border) / 0.35)" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 8, fill: chartTheme.axisTick }}
                      interval={0}
                      angle={-40}
                      textAnchor="end"
                      height={44}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis allowDecimals={false} tick={{ fontSize: 8, fill: chartTheme.axisTick }} width={22} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 9, lineHeight: '12px', paddingTop: 14 }}
                    />
                    <Bar dataKey="published" name="Published" fill="#f43f5e" radius={[2, 2, 0, 0]} maxBarSize={10} />
                    <Bar dataKey="subscribers" name="Subs" fill="#3b82f6" radius={[2, 2, 0, 0]} maxBarSize={10} />
                    <Bar dataKey="comments" name="Comments" fill="#10b981" radius={[2, 2, 0, 0]} maxBarSize={10} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </AdminCard>
          )}
        </div>
      )}

      <div className="admin-analytics-row admin-analytics-row--articles">
        <AdminCard
          title="Top in period"
          icon={BarChart3}
          className="admin-analytics-card-fill"
          bodyClassName="admin-card-body--dense admin-card-body--fill"
          action={<span className="admin-analytics-summary">Lifetime views</span>}
        >
          {articles.length > 0 ? (
            <div className="flex-1 min-h-0">
              {articles.map((article, i) => {
                const color = article.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length];
                const barWidth = Math.max(4, Math.round((article.views / maxArticleViews) * 100));
                return (
                  <div key={article.slug} className="admin-analytics-article-row">
                    <span
                      className="admin-rank admin-rank--sm admin-rank--colored"
                      style={{ background: `${color}22`, color }}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="admin-analytics-article-head">
                        <LiveArticleTextLink
                          slug={article.slug}
                          title={article.title}
                          className="admin-analytics-article-title line-clamp-1 block"
                        />
                        <span className="admin-analytics-inline-stat" style={{ color }}>{formatNumber(article.views)}</span>
                      </div>
                      <div className="admin-analytics-article-sub">
                        <span
                          className="admin-tag-capsule admin-tag-capsule--xs"
                          style={{ borderColor: `${color}55`, color, background: `${color}12` }}
                        >
                          {article.category}
                        </span>
                      </div>
                      <div className="admin-analytics-bar-track admin-analytics-bar-track--sm">
                        <div className="admin-analytics-bar-fill" style={{ width: `${barWidth}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="admin-analytics-empty">No publishes in this period.</p>
          )}
        </AdminCard>

        <AdminCard
          title={trendTitle}
          icon={TrendingUp}
          className="admin-analytics-card-fill"
          bodyClassName="admin-card-body--dense admin-card-body--fill"
          action={<span className="admin-analytics-summary">Bars = published posts · line = views on those posts</span>}
        >
          <div className="admin-analytics-chart-area admin-analytics-chart-area--md">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={publishingTrend} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border) / 0.35)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 8, fill: chartTheme.axisTick }}
                  interval="preserveStartEnd"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="posts"
                  allowDecimals={false}
                  domain={[0, maxPosts]}
                  tick={{ fontSize: 8, fill: chartTheme.axisTick }}
                  width={22}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="views"
                  orientation="right"
                  allowDecimals={false}
                  domain={[0, maxViews]}
                  tick={{ fontSize: 8, fill: chartTheme.axisTick }}
                  width={28}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : String(v))}
                />
                <Tooltip content={<PublishingTooltip />} />
                <Legend wrapperStyle={{ fontSize: 9 }} iconSize={8} />
                <Bar
                  yAxisId="posts"
                  dataKey="count"
                  name="Published posts"
                  fill={periodAccent}
                  radius={[2, 2, 0, 0]}
                  maxBarSize={12}
                  opacity={0.92}
                />
                <Line
                  yAxisId="views"
                  type="monotone"
                  dataKey="views"
                  name="Views on published"
                  stroke={chartTheme.trendStroke}
                  strokeWidth={2}
                  dot={{ r: 2, fill: chartTheme.trendFill, strokeWidth: 0 }}
                  activeDot={{ r: 3, fill: chartTheme.trendFill, stroke: chartTheme.trendStroke, strokeWidth: 1 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </div>

      <AdminCard
        title="Category traffic"
        icon={Layers}
        bodyClassName="admin-card-body--dense"
        action={<span className="admin-analytics-summary">{formatNumber(totalCategoryViews)} views · {categories.length} sectors</span>}
      >
        {categories.length > 0 ? (
          <div className="admin-analytics-category-chart-wrap">
            <ResponsiveContainer width="100%" height={Math.max(120, categories.length * 28)}>
              <BarChart data={categories} layout="vertical" margin={{ top: 0, right: 12, left: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border) / 0.3)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 8 }} tickFormatter={(v) => formatNumber(v)} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="shortName" width={72} tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: chartTheme.hoverFill }}
                  content={<CategoryTrafficTooltip totalViews={totalCategoryViews} />}
                />
                <Bar dataKey="views" radius={[0, 3, 3, 0]} maxBarSize={14} activeBar={{ fillOpacity: 0.88 }}>
                  {categories.map((cat, i) => (
                    <Cell key={cat.category} fill={cat.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="admin-analytics-empty">No category data for period.</p>
        )}
      </AdminCard>

      <div className="admin-analytics-row admin-analytics-row--split">
        <AdminCard title="Users by role" icon={PieIcon} bodyClassName="admin-card-body--dense">
          {roleData.length > 0 ? (
            <div className="admin-analytics-role-compact">
              <div className="admin-analytics-donut-wrap admin-analytics-donut-wrap--sm">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={32} outerRadius={48} paddingAngle={1} stroke="transparent">
                      {roleData.map((entry, i) => (
                        <Cell key={entry.key} fill={roleColor(entry.key, i)} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="admin-analytics-donut-center">
                  <span className="admin-analytics-donut-total">{formatNumber(totalUsers)}</span>
                </div>
              </div>
              <div className="admin-analytics-role-list">
                {roleData.map((role, i) => {
                  const color = roleColor(role.key, i);
                  const barWidth = Math.max(3, Math.round((role.value / maxRoleCount) * 100));
                  return (
                    <div key={role.key} className="admin-analytics-role-compact-row">
                      <span className="admin-analytics-role-dot" style={{ backgroundColor: color }} />
                      <span className="admin-analytics-role-compact-name">{role.name}</span>
                      <div className="admin-analytics-bar-track admin-analytics-bar-track--sm flex-1">
                        <div className="admin-analytics-bar-fill" style={{ width: `${barWidth}%`, backgroundColor: color }} />
                      </div>
                      <span className="admin-analytics-role-compact-val">{role.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="admin-analytics-empty">No users.</p>
          )}
        </AdminCard>

        <AdminCard title="Pipeline" icon={BarChart3} bodyClassName="admin-card-body--dense">
          <div className="admin-analytics-pipeline-compact">
            {contentPipeline.map((item) => {
              const barHeight = Math.max(4, Math.round((item.count / maxPipelineCount) * 100));
              return (
                <div key={item.status} className="admin-analytics-pipeline-mini">
                  <span className="admin-analytics-pipeline-count">{item.count}</span>
                  <div className="admin-analytics-pipeline-vbar admin-analytics-pipeline-vbar--sm">
                    <div className="admin-analytics-pipeline-vfill" style={{ height: `${barHeight}%`, backgroundColor: item.color }} />
                  </div>
                  <span className="admin-analytics-pipeline-label">{item.status}</span>
                </div>
              );
            })}
          </div>
          <p className="admin-analytics-pipeline-foot">{formatNumber(pipelineTotal)} total · all-time</p>
        </AdminCard>
      </div>
    </div>
  );
}