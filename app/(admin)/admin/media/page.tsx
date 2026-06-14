import { PageHeader } from '@/components/dashboard/PageHeader';
import { MediaUpload } from '@/components/shared/MediaUpload';
import { getMedia } from '@/lib/actions/media';

export default async function AdminMediaPage() {
  const items = await getMedia();
  return (
    <div>
      <PageHeader title="Media Library" description="Images, PDFs, and assets used across the platform" />
      <MediaUpload items={items} />
    </div>
  );
}