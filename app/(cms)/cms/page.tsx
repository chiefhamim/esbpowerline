import Link from 'next/link';
import { auth } from '@/lib/auth';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { getAuthorArticleStats } from '@/lib/actions/articles';
import { getMyNotices } from '@/lib/actions/notices';
import { EditorialNoticesPanel } from '@/components/cms/EditorialNoticesPanel';
import { publicPathUrl } from '@/lib/public-site-url';
import { formatNumber } from '@/lib/utils';
import { FileText, Eye, PenLine, Clock, Plus, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/dashboard/StatusBadge';

export default async function CMSDashboardPage() {
  const session = await auth();
  const authorId = session?.user?.id;
  const [stats, notices] = await Promise.all([
    authorId ? getAuthorArticleStats(authorId) : Promise.resolve({ total: 0, published: 0, drafts: 0, totalViews: 0, recent: [] }),
    getMyNotices(),
  ]);
  const { total: articlesCount, published, drafts, totalViews, recent: articles } = stats;

  return (
    <div>
      <PageHeader title={`Welcome, ${session?.user?.name ?? 'Editor'}`} description="Your content dashboard — create, edit and publish power sector stories.">
        <Link href="/cms/articles/new"><Button><Plus className="h-4 w-4 mr-2" />New Article</Button></Link>
      </PageHeader>

      <EditorialNoticesPanel
        notices={notices.map((n) => ({
          ...n,
          createdAt: n.createdAt.toISOString(),
        }))}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="My Articles" value={articlesCount} icon={FileText} />
        <StatCard title="Published" value={published} icon={Clock} change={`${drafts} drafts`} />
        <StatCard title="Total Views" value={formatNumber(totalViews)} icon={Eye} />
        <StatCard title="Drafts" value={drafts} icon={PenLine} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><BookOpen className="h-4 w-4" /> Recent Articles</h2>
          <div className="space-y-2.5 text-sm">
            {articles.slice(0, 8).map((a) => (
              <div key={a.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                <Link href={`/cms/articles/${a.id}/edit`} className="hover:text-primary font-medium truncate mr-3">{a.title}</Link>
                <div className="flex items-center gap-2 shrink-0 text-xs">
                  <StatusBadge status={a.status} />
                  <span className="text-muted-foreground tabular-nums">{formatNumber(a.views)}</span>
                </div>
              </div>
            ))}
            {articlesCount === 0 && <p className="text-muted-foreground">No articles yet. <Link href="/cms/articles/new" className="text-primary">Create your first story</Link></p>}
          </div>
        </div>

        <div className="card p-6 space-y-3 text-sm">
          <h3 className="font-semibold">Quick actions</h3>
          <Link href="/cms/articles/new" className="block p-3 border rounded hover:bg-muted">Write new article</Link>
          <Link href="/cms/media" className="block p-3 border rounded hover:bg-muted">Upload media assets</Link>
          <Link href="/cms/calendar" className="block p-3 border rounded hover:bg-muted">Editorial calendar</Link>
          <a href={publicPathUrl('/')} target="_blank" rel="noreferrer" className="block p-3 border rounded hover:bg-muted text-[#3b82f6]">View public homepage →</a>
        </div>
      </div>
    </div>
  );
}