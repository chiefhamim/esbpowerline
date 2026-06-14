import { PageHeader } from '@/components/dashboard/PageHeader';
import { getArticles } from '@/lib/actions/articles';
import { ArticleTable } from '@/components/dashboard/ArticleTable';

export default async function AdminArticlesPage() {
  const articles = await getArticles();

  const rows = articles.map((a: any) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    author: a.author,
    category: a.category,
    status: a.status,
    views: a.views,
    updatedAt: a.updatedAt,
  }));

  return (
    <div>
      <PageHeader title="Content Management" description="Moderate all articles across the platform. Search and filter by status." />
      <ArticleTable articles={rows} showAuthor={true} editBase="/cms/articles" />
    </div>
  );
}