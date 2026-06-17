'use client';

import dynamic from 'next/dynamic';

function ChartsSkeleton() {
  return (
    <div className="admin-analytics-charts-skeleton grid gap-5 lg:grid-cols-2" aria-busy="true" aria-label="Loading charts">
      <div className="admin-analytics-chart-placeholder h-[280px] rounded-xl border border-border/50 bg-muted/20 animate-pulse" />
      <div className="admin-analytics-chart-placeholder h-[280px] rounded-xl border border-border/50 bg-muted/20 animate-pulse" />
      <div className="admin-analytics-chart-placeholder h-[320px] rounded-xl border border-border/50 bg-muted/20 animate-pulse lg:col-span-2" />
    </div>
  );
}

export const AdminAnalyticsChartsLazy = dynamic(
  () => import('@/components/admin/AdminAnalyticsCharts').then((m) => m.AdminAnalyticsCharts),
  { loading: () => <ChartsSkeleton />, ssr: false },
);