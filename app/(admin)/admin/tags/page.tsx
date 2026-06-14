import { PageHeader } from '@/components/dashboard/PageHeader';
import { getAllTags } from '@/lib/actions/articles';
import { Badge } from '@/components/ui/badge';

export default async function AdminTagsPage() {
  const tags = await getAllTags();
  return (
    <div>
      <PageHeader title="Tags" description="All tags used across articles" />
      <div className="card p-6">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">{tag}</Badge>
          ))}
          {tags.length === 0 && <p className="text-muted-foreground">No tags yet</p>}
        </div>
      </div>
    </div>
  );
}