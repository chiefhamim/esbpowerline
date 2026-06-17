import { getMyNotices } from '@/lib/actions/notices';
import { EditorialNoticesPanel } from '@/components/cms/EditorialNoticesPanel';
import { CmsPageHeader, CmsSectionStack } from '@/components/cms/CmsUI';
import { Bell } from 'lucide-react';

export default async function CMSNoticesPage() {
  const notices = await getMyNotices();

  return (
    <CmsSectionStack>
      <CmsPageHeader
        title="Editorial notices"
        description="Revision requests, category changes, and notes from the editorial desk. Dismiss handled items to move them to archive."
        icon={Bell}
      />
      <EditorialNoticesPanel
        fullPage
        notices={notices.map((n) => ({
          ...n,
          createdAt: n.createdAt.toISOString(),
        }))}
      />
    </CmsSectionStack>
  );
}