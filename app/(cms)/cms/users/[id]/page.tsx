import { notFound } from 'next/navigation';
import { CmsPageHeader } from '@/components/cms/CmsUI';
import { MemberActivityPanel } from '@/components/admin/MemberActivityPanel';
import { getUser, getUserMemberActivity } from '@/lib/actions/users';
import { User } from 'lucide-react';

export default async function ViewUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [user, activity] = await Promise.all([getUser(id), getUserMemberActivity(id)]);
  if (!user) notFound();

  return (
    <div className="space-y-6">
      <CmsPageHeader
        icon={User}
        title={`Member: ${user.name}`}
        description={user.email}
      />
      {activity ? <MemberActivityPanel activity={activity} /> : <p>No activity yet.</p>}
    </div>
  );
}
