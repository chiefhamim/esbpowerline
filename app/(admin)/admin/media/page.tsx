import { AdminPageHeader, AdminSectionStack } from '@/components/admin/AdminUI';
import { MediaUpload } from '@/components/shared/MediaUpload';
import { getMediaLibrary } from '@/lib/actions/media';
import { Image } from 'lucide-react';

export default async function AdminMediaPage() {
  const items = await getMediaLibrary();
  return (
    <AdminSectionStack>
      <AdminPageHeader
        icon={Image}
        title="Media Library"
        description="Images, PDFs, and assets used across the platform."
      />
      <MediaUpload items={items} />
    </AdminSectionStack>
  );
}