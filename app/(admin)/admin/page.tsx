import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { getAnalytics } from '@/lib/actions/settings';
import { formatNumber } from '@/lib/utils';
import { FileText, Users, Eye, CheckCircle, Zap, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { StatusBadge } from '@/components/dashboard/StatusBadge';

export default async function AdminDashboardPage() {
  const stats = await getAnalytics();

  return (
    <div>
      <PageHeader 
        title="Admin Overview" 
        description="Platform health, content pipeline, and user activity" 
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Total Articles" value={formatNumber(stats.articleCount)} icon={FileText} change={`${stats.publishedCount} published`} />
        <StatCard title="Total Users" value={formatNumber(stats.userCount)} icon={Users} />
        <StatCard title="Total Views" value={formatNumber(stats.totalViews)} icon={Eye} />
        <StatCard title="Published Live" value={formatNumber(stats.publishedCount)} icon={CheckCircle} change="Visible on public site" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4" /> 
            <h2 className="font-semibold">Top Content by Views</h2>
          </div>
          <div className="space-y-3 text-sm">
            {stats.topArticles.map((a: any, i: number) => (
              <div key={a.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-muted-foreground w-5 tabular-nums">{i + 1}</span>
                  <Link href={`/articles/${a.slug}`} className="truncate hover:text-primary">{a.title}</Link>
                </div>
                <span className="text-muted-foreground tabular-nums shrink-0 ml-2">{formatNumber(a.views)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-3"><Zap className="h-4 w-4 text-[#10b981]" /><h2 className="font-semibold">Sector Snapshot</h2></div>
          <div className="text-xs space-y-2 text-[#94a3b8]">
            <div className="flex justify-between"><span>Power Generation</span><span className="text-foreground tabular-nums">28.4 GW</span></div>
            <div className="flex justify-between"><span>Renewables share</span><span className="text-foreground">4.8%</span></div>
            <div className="flex justify-between"><span>Active 400kV lines</span><span className="text-foreground">12</span></div>
            <div className="flex justify-between border-t border-border pt-2 mt-2"><span>Articles this month</span><span className="text-foreground font-medium">41</span></div>
          </div>
          <Link href="/data-reports/power-grid" className="text-xs mt-4 block text-[#3b82f6]">Open live grid data →</Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3 text-sm">
            {stats.recentLogs.length > 0 ? stats.recentLogs.map((log: any) => (
              <div key={log.id} className="border-b border-border pb-2 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <StatusBadge status={log.type.split('.')[1]?.toUpperCase() ?? 'ACTIVITY'} />
                  <span className="text-muted-foreground text-xs">{new Date(log.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="mt-1 text-muted-foreground">{log.message}</p>
              </div>
            )) : <p className="text-muted-foreground text-sm">No recent activity logged.</p>}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold mb-4">Quick Admin Actions</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link href="/admin/users/new" className="p-3 rounded border hover:bg-muted transition">Create new user</Link>
            <Link href="/admin/articles" className="p-3 rounded border hover:bg-muted transition">Review all content</Link>
            <Link href="/admin/categories" className="p-3 rounded border hover:bg-muted transition">Manage categories</Link>
            <Link href="/admin/settings" className="p-3 rounded border hover:bg-muted transition">Platform settings</Link>
          </div>
        </div>
      </div>
    </div>
  );
}