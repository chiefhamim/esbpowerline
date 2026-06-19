import { AdminPageHeader, AdminSectionStack } from '@/components/admin/AdminUI';
import { UserForm } from '@/components/admin/UserForm';
import { UserPlus } from 'lucide-react';

export default function NewUserPage() {
  return (
    <AdminSectionStack>
      <AdminPageHeader
        icon={UserPlus}
        title="Add User"
        description="Create editors, authors, or admins. Editors sign in at Staff login with the email and password you set here."
      />
      <UserForm mode="create" />
    </AdminSectionStack>
  );
}