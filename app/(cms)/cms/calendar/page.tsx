import Link from 'next/link';
import { auth } from '@/lib/auth';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { getCalendarArticles } from '@/lib/actions/articles';
import { can } from '@/lib/constants';

export default async function CMSCalendarPage() {
  const session = await auth();
  const seeAll = can(session?.user?.role, 'article.edit_any');
  const { scheduled, published } = await getCalendarArticles({
    authorId: session?.user?.id,
    allAuthors: seeAll,
  });

  return (
    <div>
      <PageHeader
        title="Editorial Calendar"
        description={seeAll ? 'All scheduled and recently published articles' : 'Your scheduled and recently published articles'}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Scheduled</h2>
          <div className="space-y-3">
            {scheduled.map((a) => (
              <div key={a.id} className="flex items-center justify-between text-sm border-b border-border pb-2">
                <div className="min-w-0 mr-3">
                  <Link href={`/cms/articles/${a.id}/edit`} className="font-medium hover:text-primary line-clamp-1">
                    {a.title}
                  </Link>
                  <div className="text-muted-foreground text-xs">{a.author.name}</div>
                </div>
                <div className="text-right shrink-0">
                  <StatusBadge status="SCHEDULED" />
                  <div className="text-xs text-muted-foreground mt-1">
                    {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : 'TBD'}
                  </div>
                </div>
              </div>
            ))}
            {scheduled.length === 0 && <p className="text-muted-foreground text-sm">No scheduled articles</p>}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold mb-4">Recently Published</h2>
          <div className="space-y-3">
            {published.map((a) => (
              <div key={a.id} className="flex items-center justify-between text-sm border-b border-border pb-2">
                <Link href={`/cms/articles/${a.id}/edit`} className="font-medium line-clamp-1 hover:text-primary min-w-0 mr-2">
                  {a.title}
                </Link>
                <div className="text-xs text-muted-foreground shrink-0">
                  {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : '—'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}