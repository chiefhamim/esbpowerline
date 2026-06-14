import Link from 'next/link';
import { auth } from '@/lib/auth';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { getArticles } from '@/lib/actions/articles';
import { ArticleTable } from '@/components/dashboard/ArticleTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function CMSArticlesPage() {
  const session = await auth();
  const articles = await getArticles({ authorId: session?.user?.id });

  return (
    <div>
      <PageHeader title="My Articles" description="Manage your drafts, published, and scheduled content">
        <Link href="/cms/articles/new"><Button><Plus className="h-4 w-4 mr-2" />New Article</Button></Link>
      </PageHeader>

      <ArticleTable articles={articles.map((a: any) => ({
        id: a.id, title: a.title, slug: a.slug, category: a.category, status: a.status, views: a.views, updatedAt: a.updatedAt
      }))} showAuthor={false} editBase="/cms/articles" />
    </div>
  );
}