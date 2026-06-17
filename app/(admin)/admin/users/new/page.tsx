import { AdminPageHeader, AdminSectionStack } from '@/components/admin/AdminUI';
import { UserForm } from '@/components/admin/UserForm';
import { UserPlus } from 'lucide-react';

export default function NewUserPage() {
  return (
    <AdminSectionStack>
      <AdminPageHeader
        icon={UserPlus}
        title="Add User"
        description="Create a new platform user with role and permissions."
      />
      <UserForm mode="create" />
    </AdminSectionStack>
  );
}