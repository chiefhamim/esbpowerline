import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminUI';
import { UserForm } from '@/components/admin/UserForm';
import { getUser } from '@/lib/actions/users';
import type { Role } from '@/lib/constants';
import { Pencil } from 'lucide-react';

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser(id);
  if (!user) notFound();

  return (
    <div>
      <AdminPageHeader
        icon={Pencil}
        title={`Edit: ${user.name}`}
        description={user.email}
      />
      <UserForm mode="edit" user={{ ...user, role: user.role as Role }} />
    </div>
  );
}