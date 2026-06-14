import { auth } from '@/lib/auth';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ArticleForm } from '@/components/editor/ArticleForm';
import { getCategories } from '@/lib/actions/categories';
import { can } from '@/lib/constants';

export default async function NewArticlePage() {
  const [session, categories] = await Promise.all([auth(), getCategories()]);
  const role = session?.user?.role;
  const permissions = {
    canPublish: can(role, 'article.publish'),
    canFeature: can(role, 'article.feature'),
    canBreaking: can(role, 'article.breaking'),
    canPin: can(role, 'article.feature'),
  };

  return (
    <div>
      <PageHeader title="New Article" description="Write and publish energy sector news" />
      <ArticleForm mode="create" categories={categories} permissions={permissions} />
    </div>
  );
}