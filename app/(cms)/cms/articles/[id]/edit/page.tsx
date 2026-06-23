import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { ArticleForm } from '@/components/editor/ArticleForm';
import { RevisionHistory } from '@/components/cms/RevisionHistory';
import { getArticle, getArticleRevisions } from '@/lib/actions/articles';
import { getCategories } from '@/lib/actions/categories';
import { getMedia } from '@/lib/actions/media';
import { can } from '@/lib/constants';

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [session, article, categories, media, revisions] = await Promise.all([
    auth(),
    getArticle(id),
    getCategories(),
    getMedia(),
    getArticleRevisions(id),
  ]);
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
    <div className="cms-write-page">
      <ArticleForm
        mode="edit"
        article={article}
        categories={categories}
        mediaItems={media.map((m) => ({ id: m.id, name: m.name, url: m.url, type: m.type }))}
        permissions={permissions}
        writeMeta={{
          title: 'Edit story',
          subtitle: article.title,
          status: article.status,
          showLiveLink: article.status === 'PUBLISHED',
          showBackLink: true,
        }}
      />

      <div className="mt-6 cms-revision-history-section">
        <RevisionHistory
          articleId={id}
          revisions={revisions.map((r) => ({
            id: r.id,
            content: r.content,
            note: r.note,
            createdAt: r.createdAt,
          }))}
        />
      </div>
    </div>
  );
}