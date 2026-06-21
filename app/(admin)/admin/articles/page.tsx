import { AdminPageHeader, AdminSectionStack } from '@/components/admin/AdminUI';
import { AdminArticleManager } from '@/components/admin/AdminArticleManager';
import { getAdminArticles } from '@/lib/actions/articles';
import { FileText } from 'lucide-react';

export default async function AdminArticlesPage() {
  const articles = await getAdminArticles();

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
      <AdminArticleManager articles={rows} editBase="/cms/articles" />
    </AdminSectionStack>
  );
}