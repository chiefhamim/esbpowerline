import { PageHeader } from '@/components/dashboard/PageHeader';
import { MediaUpload } from '@/components/shared/MediaUpload';
import { getMedia } from '@/lib/actions/media';

export default async function CMSMediaPage() {
  const items = await getMedia();
  return (
    <div>
      <PageHeader title="Media Library" description="Upload and manage images for your articles" />
      <MediaUpload items={items} />
    </div>
  );
}