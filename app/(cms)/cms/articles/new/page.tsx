import { PageHeader } from '@/components/dashboard/PageHeader';
import { ArticleForm } from '@/components/editor/ArticleForm';

export default function NewArticlePage() {
  return (
    <div>
      <PageHeader title="New Article" description="Write and publish energy sector news" />
      <ArticleForm mode="create" />
    </div>
  );
}