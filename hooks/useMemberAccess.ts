'use client';

import { useSession } from 'next-auth/react';
import type { Role } from '@/lib/constants';

export type MemberAccessState = 'loading' | 'guest' | 'member' | 'staff';

function staffHome(role: Role | undefined) {
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') return '/admin';
  if (role === 'EDITOR' || role === 'AUTHOR' || role === 'CONTRIBUTOR') return '/cms';
  return '/login';
}

export function useMemberAccess() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  const userName = session?.user?.name ?? 'Member';
  const initial = userName.charAt(0).toUpperCase();

  if (status === 'loading') {
    return {
      state: 'loading' as const,
      href: '/members/login',
      label: 'Member login',
      shortLabel: 'Login',
      hint: 'Checking sign-in status…',
      userName: null,
      initial: null,
      signedIn: false,
      isMember: false,
    };
  }

  const signedIn = status === 'authenticated' && !!session?.user;
  const isMember = role === 'SUBSCRIBER';

  if (!signedIn) {
    return {
      state: 'guest' as const,
      href: '/members/login',
      label: 'Member login',
      shortLabel: 'Login',
      hint: 'Save articles, magazine issues, downloads & comments.',
      userName: null,
      initial: null,
      signedIn: false,
      isMember: false,
    };
  }

  if (isMember) {
    return {
      state: 'member' as const,
      href: '/members',
      label: 'My library',
      shortLabel: 'Library',
      hint: `${userName} · saved articles, magazine archive & downloads.`,
      userName,
      initial,
      signedIn: true,
      isMember: true,
    };
  }

  return {
    state: 'staff' as const,
    href: staffHome(role),
    label: 'Staff workspace',
    shortLabel: 'Staff',
    hint: `${userName} · editorial and admin workspace.`,
    userName,
    initial,
    signedIn: true,
    isMember: false,
  };
}