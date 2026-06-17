import { auth } from '@/lib/auth';
import { ArticleForm } from '@/components/editor/ArticleForm';
import { getCategories } from '@/lib/actions/categories';
import { getMedia } from '@/lib/actions/media';
import { can } from '@/lib/constants';

export default async function NewArticlePage() {
  const [session, categories, media] = await Promise.all([auth(), getCategories(), getMedia()]);
  const role = session?.user?.role;
  const permissions = {
    canPublish: can(role, 'article.publish'),
    canFeature: can(role, 'article.feature'),
    canBreaking: can(role, 'article.breaking'),
    canPin: can(role, 'article.feature'),
  };

  return (
    <div className="cms-write-page">
      <ArticleForm
        mode="create"
        categories={categories}
        mediaItems={media.map((m) => ({ id: m.id, name: m.name, url: m.url, type: m.type }))}
        permissions={permissions}
        writeMeta={{
          title: 'New story',
          subtitle: 'Headline, body, media, SEO, and publish settings — one editorial flow.',
        }}
      />
    </div>
  );
}