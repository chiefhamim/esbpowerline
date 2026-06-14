import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ArticleForm } from '@/components/editor/ArticleForm';
import { getArticle } from '@/lib/actions/articles';

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) notFound();

  return (
    <div>
      <PageHeader title="Edit Article" description={article.title} />
      <ArticleForm mode="edit" article={article} />
    </div>
  );
}