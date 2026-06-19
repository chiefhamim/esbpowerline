import Link from 'next/link';
import { requireMemberSession } from '@/lib/member-auth';
import { ROLES } from '@/lib/constants';
import { MemberSignOutButton } from '@/components/members/MemberSignOutButton';
import { MemberAccountSettings } from '@/components/members/MemberAccountSettings';
import { getMemberAccountDetails } from '@/lib/actions/member-profile';

export const metadata = {
  title: 'Account | Member library',
};

export default async function MemberAccountPage() {
  const session = await requireMemberSession();
  const account = await getMemberAccountDetails();
  const roleLabel = ROLES[session.user.role]?.name ?? session.user.role;

  return (
    <div className="max-w-lg space-y-6">
      <div className="member-account-card">
        <dl className="member-account-card__fields">
          <div>
            <dt>Account type</dt>
            <dd>{roleLabel}</dd>
          </div>
          {account?.status && account.status !== 'ACTIVE' && (
            <div>
              <dt>Status</dt>
              <dd className="capitalize">{account.status.toLowerCase()}</dd>
            </div>
          )}
        </dl>
      </div>

      {account ? (
        <MemberAccountSettings
          name={account.name}
          email={account.email}
          phone={account.phone}
          status={account.status}
        />
      ) : null}

      <p className="text-sm text-muted-foreground">
        For staff editorial access, use{' '}
        <Link href="/login" className="text-primary hover:underline">
          staff sign in
        </Link>
        .
      </p>

      <MemberSignOutButton />
    </div>
  );
}