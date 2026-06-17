'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createUser, updateUser } from '@/lib/actions/users';
import type { Role } from '@/lib/constants';
import { AdminFormCard } from './AdminUI';

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
  const [role, setRole] = useState<Role>(user?.role ?? 'AUTHOR');
  const [status, setStatus] = useState<'ACTIVE' | 'SUSPENDED' | 'PENDING'>((user?.status as 'ACTIVE' | 'SUSPENDED' | 'PENDING') ?? 'ACTIVE');
  const [bio, setBio] = useState(user?.bio ?? '');

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
        await createUser({ ...data, password });
        toast.success('User created');
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
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Role</Label>
          <Select value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN">Admin</option>
            <option value="EDITOR">Editor</option>
            <option value="AUTHOR">Author</option>
            <option value="CONTRIBUTOR">Contributor</option>
            <option value="SUBSCRIBER">Subscriber</option>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={status} onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'SUSPENDED' | 'PENDING')}>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="PENDING">Pending</option>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Bio</Label>
          <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving…' : mode === 'create' ? 'Create User' : 'Update User'}
        </Button>
      </form>
    </AdminFormCard>
  );
}