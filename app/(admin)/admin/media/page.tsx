import { AdminPageHeader } from '@/components/admin/AdminUI';
import { MediaUpload } from '@/components/shared/MediaUpload';
import { getMedia } from '@/lib/actions/media';
import { Image } from 'lucide-react';

export default async function AdminMediaPage() {
  const items = await getMedia();
  return (
    <div>
      <AdminPageHeader
        icon={Image}
        title="Media Library"
        description="Images, PDFs, and assets used across the platform."
      />
      <MediaUpload items={items} />
    </div>
  );
}