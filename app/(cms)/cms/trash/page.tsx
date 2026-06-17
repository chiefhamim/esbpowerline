import { Trash2 } from 'lucide-react';
import { getEditorTrash } from '@/lib/actions/editor-trash';
import { EditorialTrashPanel } from '@/components/cms/EditorialTrashPanel';
import { CmsPageHeader, CmsSectionStack } from '@/components/cms/CmsUI';

export default async function CMSTrashPage() {
  const { articles, notices } = await getEditorTrash();

  return (
    <CmsSectionStack>
      <CmsPageHeader
        title="Editor trash"
        description="Your private trash for stories and notices — visible only to you for 7 days"
        icon={Trash2}
      />
      <EditorialTrashPanel articles={articles} notices={notices} />
    </CmsSectionStack>
  );
}