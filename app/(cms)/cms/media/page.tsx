import { MediaUpload } from '@/components/shared/MediaUpload';
import { getMediaLibrary } from '@/lib/actions/media';
import { Image as ImageIcon } from 'lucide-react';
import { CmsPageHeader, CmsSectionStack } from '@/components/cms/CmsUI';

export default async function CMSMediaPage() {
  const items = await getMediaLibrary();
  return (
    <CmsSectionStack>
      <CmsPageHeader title="Media Library" description="Upload and manage images for your articles" icon={ImageIcon} />
      <div className="admin-form-card">
        <MediaUpload items={items} />
      </div>
    </CmsSectionStack>
  );
}