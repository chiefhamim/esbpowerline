import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { UserForm } from '@/components/admin/UserForm';
import { getUser } from '@/lib/actions/users';
import type { Role } from '@/lib/constants';

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser(id);
  if (!user) notFound();

  return (
    <div>
      <PageHeader title={`Edit: ${user.name}`} description={user.email} />
      <UserForm mode="edit" user={{ ...user, role: user.role as Role }} />
    </div>
  );
}