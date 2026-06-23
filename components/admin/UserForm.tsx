'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Shield, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createUser, updateUser } from '@/lib/actions/users';
import {
  ADMIN_ASSIGNABLE_ROLES,
  ROLES,
  USER_ROLE_LABELS,
  type Role,
} from '@/lib/constants';
import { AdminFormSelect } from '@/components/admin/AdminFormSelect';
import type { AdminSelectOption } from '@/components/admin/AdminSelectMenu';
import { AdminFormCard } from './AdminUI';

const STATUS_OPTIONS: AdminSelectOption[] = [
  { value: 'ACTIVE', label: 'Active', dot: 'hsl(160 84% 39%)', description: 'Full access per role' },
  { value: 'SUSPENDED', label: 'Suspended', dot: 'hsl(0 72% 51%)', description: 'Sign-in blocked' },
  { value: 'PENDING', label: 'Pending', dot: 'hsl(38 92% 50%)', description: 'Awaiting activation' },
];

const ROLE_OPTION_ORDER: Role[] = [
  'ADMIN',
  'EDITOR',
  'SUBSCRIBER',
  'SUPER_ADMIN',
  'AUTHOR',
  'CONTRIBUTOR',
];

function buildRoleOptions(currentRole?: Role): AdminSelectOption[] {
  return ROLE_OPTION_ORDER.map((roleKey) => {
    const assignable = ADMIN_ASSIGNABLE_ROLES.includes(roleKey as (typeof ADMIN_ASSIGNABLE_ROLES)[number]);
    const isCurrentLegacy = !assignable && currentRole === roleKey;
    return {
      value: roleKey,
      label: USER_ROLE_LABELS[roleKey],
      dot: ROLES[roleKey].color,
      description: assignable
        ? roleKey === 'ADMIN'
          ? 'Platform admin panel access'
          : roleKey === 'EDITOR'
            ? 'CMS workspace and publishing'
            : 'Public member account'
        : isCurrentLegacy
          ? 'Current role · change to Admin, Editor, or Member'
          : 'System role · not assignable',
      disabled: !assignable && !isCurrentLegacy,
    };
  });
}

interface UserFormProps {
  mode: 'create' | 'edit';
  user?: {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: string;
    bio?: string | null;
  };
}

export function UserForm({ mode, user }: UserFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(user?.role ?? 'EDITOR');
  const [status, setStatus] = useState<'ACTIVE' | 'SUSPENDED' | 'PENDING'>(
    (user?.status as 'ACTIVE' | 'SUSPENDED' | 'PENDING') ?? 'ACTIVE',
  );
  const [bio, setBio] = useState(user?.bio ?? '');

  const roleOptions = useMemo(() => buildRoleOptions(user?.role), [user?.role]);

  function handleRoleChange(nextRole: string) {
    if (!ADMIN_ASSIGNABLE_ROLES.includes(nextRole as (typeof ADMIN_ASSIGNABLE_ROLES)[number])) return;
    setRole(nextRole as Role);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { name, email, role, status, bio, ...(password ? { password } : {}) };
      if (mode === 'create') {
        if (!password.trim()) {
          toast.error('Password is required when creating a user');
          return;
        }
        if (password.trim().length < 8) {
          toast.error('Password must be at least 8 characters');
          return;
        }
        await createUser({ ...data, password });
        toast.success(
          role === 'EDITOR'
            ? 'Editor created — they can sign in at Staff login with this email and password'
            : role === 'ADMIN'
              ? 'Admin created — they can sign in at Staff login with this email and password'
              : 'Member created',
        );
        router.push('/admin/users');
      } else if (user) {
        await updateUser(user.id, data);
        toast.success('User updated');
        router.refresh();
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminFormCard>
      <form onSubmit={handleSubmit} className="admin-form-stack--compact">
        <div className="space-y-1.5">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={mode === 'edit'} />
        </div>
        <div className="space-y-1.5">
          <Label>{mode === 'create' ? 'Password' : 'New Password (leave blank to keep)'}</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={mode === 'create' ? 8 : undefined}
            required={mode === 'create'}
            autoComplete={mode === 'create' ? 'new-password' : 'off'}
          />
          {mode === 'create' && role === 'EDITOR' && (
            <p className="text-xs text-muted-foreground">
              Share this email and password with the editor. They sign in at Staff login and open the CMS workspace.
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Role</Label>
          <AdminFormSelect
            value={role}
            onChange={handleRoleChange}
            options={roleOptions}
            icon={UserCog}
            placeholder="Select role"
            menuTitle="Assign role"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <AdminFormSelect
            value={status}
            onChange={(value) => setStatus(value as 'ACTIVE' | 'SUSPENDED' | 'PENDING')}
            options={STATUS_OPTIONS}
            icon={Shield}
            placeholder="Select status"
            menuTitle="Account status"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Bio</Label>
          <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
        </div>
        <Button type="submit" disabled={loading}>
          <span>{loading ? 'Saving…' : mode === 'create' ? 'Create User' : 'Update User'}</span>
        </Button>
      </form>
    </AdminFormCard>
  );
}