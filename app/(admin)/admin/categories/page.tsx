import { PageHeader } from '@/components/dashboard/PageHeader';
import { CategoryManager } from '@/components/admin/CategoryManager';
import { getCategories } from '@/lib/actions/categories';

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  return (
    <div>
      <PageHeader title="Categories" description="Manage the 10 core energy sector categories" />
      <CategoryManager categories={categories} />
    </div>
  );
}