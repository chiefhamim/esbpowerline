'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { formatNumber } from '@/lib/utils';
import { FileText, Users, Eye, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#1e40af', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#0ea5e9'];

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/analytics').then((r) => r.json()).then(setStats).catch(() => {});
  }, []);

  if (!stats) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading analytics…</div>;
  }

  const roleData = (stats.usersByRole ?? []).map((r: any) => ({ name: r.role, value: r._count }));

  return (
    <div>
      <PageHeader title="Analytics" description="Views, popular content, and user activity" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Articles" value={formatNumber(stats.articleCount)} icon={FileText} />
        <StatCard title="Users" value={formatNumber(stats.userCount)} icon={Users} />
        <StatCard title="Total Views" value={formatNumber(stats.totalViews)} icon={Eye} />
        <StatCard title="Published" value={formatNumber(stats.publishedCount)} icon={TrendingUp} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Top Articles by Views</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.topArticles?.slice(0, 8) ?? []}>
              <XAxis dataKey="title" tick={false} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#1e40af" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Users by Role</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {roleData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}