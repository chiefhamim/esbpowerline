import { PageHeader } from '@/components/dashboard/PageHeader';
import prisma from '@/lib/prisma';
import { StatusBadge } from '@/components/dashboard/StatusBadge';

export default async function CMSCalendarPage() {
  const scheduled = await prisma.article.findMany({
    where: { status: 'SCHEDULED' },
    orderBy: { publishedAt: 'asc' },
    include: { author: { select: { name: true } } },
  });

  const published = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    take: 10,
    include: { author: { select: { name: true } } },
  });

  return (
    <div>
      <PageHeader title="Editorial Calendar" description="Scheduled and recently published articles" />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Scheduled</h2>
          <div className="space-y-3">
            {scheduled.map((a) => (
              <div key={a.id} className="flex items-center justify-between text-sm border-b border-border pb-2">
                <div>
                  <div className="font-medium">{a.title}</div>
                  <div className="text-muted-foreground text-xs">{a.author.name}</div>
                </div>
                <div className="text-right">
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
                <div className="font-medium line-clamp-1">{a.title}</div>
                <div className="text-xs text-muted-foreground shrink-0 ml-2">
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