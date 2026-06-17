import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import { getEditorialCalendarEvents } from '@/lib/actions/articles';
import { can } from '@/lib/constants';
import { Calendar } from 'lucide-react';
import { CmsPageHeader, CmsSectionStack } from '@/components/cms/CmsUI';
import { EditorialCalendar } from '@/components/cms/EditorialCalendar';

type SearchParams = Promise<{ year?: string; month?: string }>;

export default async function CMSCalendarPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  const seeAll = can(session?.user?.role, 'article.review');
  const params = await searchParams;
  const now = new Date();
  const year = params.year ? Number(params.year) : now.getFullYear();
  const month = params.month ? Number(params.month) : now.getMonth();

  const events = await getEditorialCalendarEvents({
    authorId: session?.user?.id,
    allAuthors: seeAll,
    year,
    month,
  });

  return (
    <CmsSectionStack>
      <CmsPageHeader
        title="Editorial Calendar"
        description={
          seeAll
            ? 'Month view of scheduled, published, and draft activity across the newsroom'
            : 'Your scheduled, published, and draft activity at a glance'
        }
        icon={Calendar}
      />
      <Suspense fallback={<div className="text-[13px] text-muted-foreground py-8 text-center">Loading calendar…</div>}>
        <EditorialCalendar
          events={events}
          year={year}
          month={month}
          seeAll={seeAll}
        />
      </Suspense>
    </CmsSectionStack>
  );
}