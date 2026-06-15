import {
  AdminPageHeader, AdminStatCard, AdminCard, AdminActionPill,
  AdminListRow, AdminActivityItem, AdminMetricRow,
} from '@/components/admin/AdminUI';
import { getAdminOverview } from '@/lib/actions/analytics';
import { formatNumber } from '@/lib/utils';
import {
  FileText, Users, Eye, CheckCircle, Zap, BarChart3,
  UserPlus, Settings, Tag, Layers,
} from 'lucide-react';
import Link from 'next/link';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { publicArticleUrl, publicPathUrl } from '@/lib/public-site-url';
import { auth } from '@/lib/auth';
import { can } from '@/lib/constants';

export default async function AdminDashboardPage() {
  const [stats, session] = await Promise.all([getAdminOverview(), auth()]);
  const role = session?.user?.role;

  return (
    <div>
      <AdminPageHeader
        icon={BarChart3}
        title="Admin Overview"
        description="Platform health, content pipeline, and user activity at a glance."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <AdminStatCard title="Total Articles" value={formatNumber(stats.articleCount)} icon={FileText} accent="rose" change={`${stats.publishedCount} published`} />
        <AdminStatCard title="Total Users" value={formatNumber(stats.userCount)} icon={Users} accent="violet" />
        <AdminStatCard title="Total Views" value={formatNumber(stats.totalViews)} icon={Eye} accent="sky" />
        <AdminStatCard title="Published Live" value={formatNumber(stats.publishedCount)} icon={CheckCircle} accent="emerald" change="Visible on public site" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-8">
        <AdminCard title="Top Content by Views" icon={BarChart3} className="lg:col-span-2">
          <div className="space-y-0.5">
            {stats.topArticles.map((a: { id: string; slug: string; title: string; views: number }, i: number) => (
              <AdminListRow
                key={a.id}
                rank={i + 1}
                title={a.title}
                href={publicArticleUrl(a.slug)}
                value={formatNumber(a.views)}
              />
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Sector Snapshot" icon={Zap}>
          <div className="space-y-0.5">
            {stats.dashboardStats.length > 0 ? stats.dashboardStats.map((s) => (
              <AdminMetricRow
                key={s.id}
                label={s.statName}
                value={`${s.value}${s.unit ? ` ${s.unit}` : ''}`}
              />
            )) : (
              <>
                <AdminMetricRow label="Published live" value={formatNumber(stats.publishedCount)} />
                <AdminMetricRow label="Total views" value={formatNumber(stats.totalViews)} />
              </>
            )}
            <AdminMetricRow label="Articles this month" value={formatNumber(stats.publishedThisMonth)} highlight />
          </div>
          <a href={publicPathUrl('/data-reports/power-grid')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-4 text-[12px] font-medium text-rose-400 hover:text-rose-300 transition-colors">
            Open live grid data →
          </a>
        </AdminCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <AdminCard title="Recent Activity" icon={Layers}>
          <div>
            {stats.recentLogs.length > 0 ? stats.recentLogs.map((log) => (
              <AdminActivityItem
                key={log.id}
                badge={<StatusBadge status={log.type.split('.')[1]?.toUpperCase() ?? 'ACTIVITY'} />}
                date={new Date(log.timestamp).toLocaleDateString()}
                message={log.message}
              />
            )) : (
              <p className="text-[13px] text-muted-foreground py-2">No recent activity logged.</p>
            )}
          </div>
        </AdminCard>

        <AdminCard title="Quick Actions" icon={Zap}>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {can(role, 'user.create') && (
              <AdminActionPill href="/admin/users/new" label="Create user" icon={UserPlus} description="Add platform member" />
            )}
            <AdminActionPill href="/admin/articles" label="Review content" icon={FileText} description="Moderate articles" />
            {can(role, 'category.manage') && (
              <AdminActionPill href="/admin/categories" label="Categories" icon={Tag} description="Organize topics" />
            )}
            {can(role, 'settings.view') && (
              <AdminActionPill href="/admin/settings" label="Settings" icon={Settings} description="Platform config" />
            )}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}