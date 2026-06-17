import { AdminPageHeader, AdminSectionStack } from '@/components/admin/AdminUI';
import { CategoryManager } from '@/components/admin/CategoryManager';
import { getCategoriesWithCounts } from '@/lib/actions/categories';
import { Tag } from 'lucide-react';

export default async function AdminCategoriesPage() {
  const categories = await getCategoriesWithCounts();
  return (
    <AdminSectionStack>
      <AdminPageHeader
        icon={Tag}
        title="Categories"
        description="Rename, reorder, and edit categories — changes sync to the public site, navbar, and all linked articles."
      />
      <CategoryManager categories={categories} />
    </AdminSectionStack>
  );
}