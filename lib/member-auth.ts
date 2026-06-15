import { auth } from '@/lib/auth';
import type { Role } from '@/lib/constants';
import { redirect } from 'next/navigation';

const STAFF_ROLES: Role[] = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR', 'CONTRIBUTOR'];

export function isStaffRole(role: Role | undefined): boolean {
  return !!role && STAFF_ROLES.includes(role);
}

export function isMemberRole(role: Role | undefined): boolean {
  return !!role && role === 'SUBSCRIBER';
}

export async function getOptionalMemberSession() {
  return auth();
}

export async function requireMemberSession(callbackPath?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    const login = callbackPath
      ? `/members/login?callbackUrl=${encodeURIComponent(callbackPath)}`
      : '/members/login';
    redirect(login);
  }
  return session;
}