import { auth } from '@/lib/auth';
import { getArticles, getAdminArticles } from '@/lib/actions/articles';
import { AdminArticleManager } from '@/components/admin/AdminArticleManager';
import { can } from '@/lib/constants';
import { FileText } from 'lucide-react';
import { CmsCreateCapsule, CmsPageHeader, CmsSectionStack } from '@/components/cms/CmsUI';

function serializeArticles(articles: Awaited<ReturnType<typeof getArticles>>) {
  return articles.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    author: a.author ? { id: a.author.id, name: a.author.name } : undefined,
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
}

export default async function CMSArticlesPage() {
  const session = await auth();
  const editorLead = can(session?.user?.role, 'article.review');
  const canEditAny = can(session?.user?.role, 'article.edit_any');

  const articles = editorLead
    ? await getAdminArticles()
    : await getArticles({ authorId: session?.user?.id, includeTrash: true });

  return (
    <CmsSectionStack>
      <CmsPageHeader
        title={editorLead ? 'All Articles' : 'My Articles'}
        description={
          editorLead
            ? 'Search, filter, bulk-edit, and publish stories across the newsroom.'
            : 'Manage your drafts, published, and scheduled content.'
        }
        icon={FileText}
      >
        <CmsCreateCapsule href="/cms/articles/new" label="New article" />
      </CmsPageHeader>

      <AdminArticleManager
        articles={serializeArticles(articles)}
        editBase="/cms/articles"
        options={{
          currentUserId: session?.user?.id,
          canEditAny,
          ...(editorLead
            ? { showRevisionRequest: true, useOwnBulkActions: !canEditAny }
            : {
                showAuthorColumn: false,
                showAuthorFilter: false,
                showRevisionRequest: false,
                showBulkFlags: can(session?.user?.role, 'article.feature'),
                useOwnBulkActions: true,
              }),
        }}
      />
    </CmsSectionStack>
  );
}