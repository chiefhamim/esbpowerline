import { AdminPageHeader, AdminSectionStack, AdminCard, AdminTagCapsule } from '@/components/admin/AdminUI';
import { getAllTags } from '@/lib/actions/articles';
import { Tag } from 'lucide-react';

export default async function AdminTagsPage() {
  const tags = await getAllTags();
  return (
    <AdminSectionStack>
      <AdminPageHeader
        icon={Tag}
        title="Tags"
        description="All tags used across articles on the platform."
      />
      <AdminCard title={`${tags.length} tags`} icon={Tag}>
        <div className="admin-chip-grid">
          {tags.map((t) => (
            <AdminTagCapsule key={t}>{t}</AdminTagCapsule>
          ))}
          {tags.length === 0 && <p className="text-[13px] text-muted-foreground">No tags yet</p>}
        </div>
      </AdminCard>
    </AdminSectionStack>
  );
}