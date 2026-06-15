import Link from 'next/link';
import { requireMemberSession } from '@/lib/member-auth';
import { ROLES } from '@/lib/constants';
import { MemberSignOutButton } from '@/components/members/MemberSignOutButton';

export const metadata = {
  title: 'Account | Member library',
};

export default async function MemberAccountPage() {
  const session = await requireMemberSession();
  const roleLabel = ROLES[session.user.role]?.name ?? session.user.role;

  return (
    <div className="max-w-lg space-y-6">
      <div className="member-account-card">
        <dl className="member-account-card__fields">
          <div>
            <dt>Name</dt>
            <dd>{session.user.name}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{session.user.email}</dd>
          </div>
          <div>
            <dt>Account type</dt>
            <dd>{roleLabel}</dd>
          </div>
        </dl>
      </div>

      <p className="text-sm text-muted-foreground">
        Profile editing and password changes will be added in a later update. For staff editorial access, use{' '}
        <Link href="/login" className="text-primary hover:underline">staff sign in</Link>.
      </p>

      <MemberSignOutButton />
    </div>
  );
}