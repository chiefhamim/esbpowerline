import { auth } from '@/lib/auth';
import { adminPanelUrl } from '@/lib/workspace-urls';
import { getCategoriesWithCounts } from '@/lib/actions/categories';
import { FolderOpen, PenLine } from 'lucide-react';
import { CmsPageHeader, CmsCard, CmsListRow, CmsSectionStack, CmsListStack, CmsCardFooter } from '@/components/cms/CmsUI';
import { can } from '@/lib/constants';
import { formatNumber } from '@/lib/utils';

export default async function CMSCategoriesPage() {
  const session = await auth();
  const categories = await getCategoriesWithCounts();
  const canManage = can(session?.user?.role, 'category.manage');

  return (
    <CmsSectionStack>
      <CmsPageHeader
        icon={FolderOpen}
        title="Categories"
        description="Sector beats for ESB PowerLine — assign the right category when publishing."
      />

      <CmsCard title={`${categories.length} categories`} icon={FolderOpen}>
        <CmsListStack>
          {categories.map((c) => (
            <CmsListRow
              key={c.id}
              title={c.name}
              meta={c.description ?? undefined}
              value={`${formatNumber(c.articleCount)} articles`}
            />
          ))}
        </CmsListStack>
        {canManage ? (
          <CmsCardFooter>
            Need to add or rename a category?{' '}
            <a href={adminPanelUrl('/admin/categories')} className="admin-card-footer--link">
              Manage in admin panel →
            </a>
          </CmsCardFooter>
        ) : (
          <CmsCardFooter className="flex items-center gap-1.5">
            <PenLine className="h-3.5 w-3.5 shrink-0" />
            Categories are managed by the editorial lead. Pick from the list when writing.
          </CmsCardFooter>
        )}
      </CmsCard>
    </CmsSectionStack>
  );
}