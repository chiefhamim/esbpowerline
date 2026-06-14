import { PageHeader } from '@/components/dashboard/PageHeader';
import { UserForm } from '@/components/admin/UserForm';

export default function NewUserPage() {
  return (
    <div>
      <PageHeader title="Add User" description="Create a new platform user with role and permissions" />
      <UserForm mode="create" />
    </div>
  );
}