import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ArticleForm } from '@/components/editor/ArticleForm';
import { getArticle } from '@/lib/actions/articles';
import { getCategories } from '@/lib/actions/categories';
import { can } from '@/lib/constants';

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [session, article, categories] = await Promise.all([auth(), getArticle(id), getCategories()]);
  if (!article || !session?.user) notFound();

  const canEdit = article.authorId === session.user.id
    ? can(session.user.role, 'article.edit_own')
    : can(session.user.role, 'article.edit_any');
  if (!canEdit) notFound();

  const permissions = {
    canPublish: can(session.user.role, 'article.publish'),
    canFeature: can(session.user.role, 'article.feature'),
    canBreaking: can(session.user.role, 'article.breaking'),
    canPin: can(session.user.role, 'article.feature'),
  };

  return (
    <div>
      <PageHeader title="Edit Article" description={article.title} />
      <ArticleForm mode="edit" article={article} categories={categories} permissions={permissions} />
    </div>
  );
}