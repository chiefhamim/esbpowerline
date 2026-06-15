import Link from 'next/link';
import { AdminPageHeader, AdminTableShell } from '@/components/admin/AdminUI';
import { getUsers, type UserListFilter } from '@/lib/actions/users';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RoleBadge } from '@/components/dashboard/RoleBadge';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Button } from '@/components/ui/button';
import { Plus, Users, Pencil } from 'lucide-react';
import { auth } from '@/lib/auth';
import { can, type Role } from '@/lib/constants';
import { cn } from '@/lib/utils';

type PageProps = {
  searchParams: Promise<{ filter?: string }>;
};

const FILTERS: { id: UserListFilter; label: string }[] = [
  { id: 'all', label: 'All users' },
  { id: 'members', label: 'Members' },
  { id: 'staff', label: 'Staff' },
];

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filter = (FILTERS.some((f) => f.id === params.filter) ? params.filter : 'all') as UserListFilter;
  const [users, session] = await Promise.all([getUsers(filter), auth()]);
  const canCreate = can(session?.user?.role, 'user.create');

  return (
    <div>
      <AdminPageHeader
        icon={Users}
        title="User Management"
        description="Manage members, editorial staff, and platform access."
      >
        {canCreate && (
          <Link href="/admin/users/new">
            <Button><Plus className="h-4 w-4 mr-2" />Add User</Button>
          </Link>
        )}
      </AdminPageHeader>

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((tab) => (
          <Link
            key={tab.id}
            href={`/admin/users?filter=${tab.id}`}
            className={cn('admin-filter-tab', filter === tab.id && 'admin-filter-tab--active')}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <AdminTableShell>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>{filter === 'members' ? 'Library' : 'Articles'}</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell><RoleBadge role={u.role as Role} /></TableCell>
                <TableCell><StatusBadge status={u.status} /></TableCell>
                <TableCell className="tabular-nums text-muted-foreground text-sm">
                  {u.role === 'SUBSCRIBER'
                    ? `${u.savedCount} saved · ${u.commentCount} comments`
                    : u.articlesCount}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : '—'}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/users/${u.id}`}
                    className="inline-flex items-center gap-1 text-[12px] font-medium text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AdminTableShell>
    </div>
  );
}