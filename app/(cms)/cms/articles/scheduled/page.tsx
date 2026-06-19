import { auth } from '@/lib/auth';
import { getArticles } from '@/lib/actions/articles';
import { can } from '@/lib/constants';
import { Clock } from 'lucide-react';
import { CmsCreateCapsule, CmsPageHeader, CmsListRow, CmsCard, CmsSectionStack, CmsScheduleList } from '@/components/cms/CmsUI';
import { StatusBadge } from '@/components/dashboard/StatusBadge';

export default async function CMSScheduledPage() {
  const session = await auth();
  const editorLead = can(session?.user?.role, 'article.review');

  const scheduled = await getArticles({
    authorId: editorLead ? undefined : session?.user?.id,
    status: 'SCHEDULED',
  });

  return (
    <CmsSectionStack>
      <CmsPageHeader
        title="Scheduled"
        description="Stories queued for a future go-live — published by cron or manual publish"
        icon={Clock}
      >
        <CmsCreateCapsule href="/cms/articles/new" label="Schedule new" />
      </CmsPageHeader>

      <CmsCard>
        <CmsScheduleList>
          {scheduled.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <CmsListRow
                  title={a.title}
                  href={`/cms/articles/${a.id}/edit`}
                  meta={a.category}
                />
              </div>
              <div className="text-right shrink-0">
                <StatusBadge status="SCHEDULED" />
                <div className="text-[11px] text-muted-foreground mt-1 tabular-nums">
                  {a.publishedAt ? new Date(a.publishedAt).toLocaleString() : 'No date set'}
                </div>
              </div>
            </div>
          ))}
          {scheduled.length === 0 && (
            <p className="text-[13px] text-muted-foreground py-4 text-center">
              Nothing scheduled. Set status to Scheduled with a go-live date, or use Publish now.
            </p>
          )}
        </CmsScheduleList>
      </CmsCard>
    </CmsSectionStack>
  );
}