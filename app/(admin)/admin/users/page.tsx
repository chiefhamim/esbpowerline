import Link from 'next/link';
import { AdminPageHeader, AdminTableShell } from '@/components/admin/AdminUI';
import { getUsers } from '@/lib/actions/users';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RoleBadge } from '@/components/dashboard/RoleBadge';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Button } from '@/components/ui/button';
import { Plus, Users, Pencil } from 'lucide-react';
import type { Role } from '@/lib/constants';

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div>
      <AdminPageHeader
        icon={Users}
        title="User Management"
        description="Manage roles, status, and access for all platform users."
      >
        <Link href="/admin/users/new">
          <Button><Plus className="h-4 w-4 mr-2" />Add User</Button>
        </Link>
      </AdminPageHeader>

      <AdminTableShell>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Articles</TableHead>
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
                <TableCell className="tabular-nums">{u.articlesCount}</TableCell>
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