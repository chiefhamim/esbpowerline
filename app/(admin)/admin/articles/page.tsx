import { AdminPageHeader, AdminSectionStack } from '@/components/admin/AdminUI';
import { AdminArticleManager } from '@/components/admin/AdminArticleManager';
import { getAdminArticles } from '@/lib/actions/articles';
import { FileText } from 'lucide-react';
import { auth } from '@/lib/auth';
import { can } from '@/lib/constants';

export default async function AdminArticlesPage() {
  const [articles, session] = await Promise.all([
    getAdminArticles(),
    auth(),
  ]);

  const canEditAny = can(session?.user?.role, 'article.edit_any');

  const rows = articles.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    author: a.author,
    category: a.category,
    status: a.status,
    views: a.views,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
    publishedAt: a.publishedAt,
    isPinned: a.isPinned,
    isFeatured: a.isFeatured,
    isBreaking: a.isBreaking,
    postAsNewsDesk: a.postAsNewsDesk,
  }));

  return (
    <AdminSectionStack>
      <AdminPageHeader
        icon={FileText}
        title="Content Management"
        description="Sort, filter, and batch-manage all articles — publish, archive, trash, restore, and flag content."
      />
      <AdminArticleManager
        articles={rows}
        editBase="/cms/articles"
        options={{
          currentUserId: session?.user?.id,
          canEditAny,
        }}
      />
    </AdminSectionStack>
  );
}