'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/utils/supabase/auth-context';
import { useWorkspaceHref } from '@/hooks/useWorkspaceHref';
import {
  getAccountKind,
  getAccountRoleLabel,
  getAccountShortLabel,
  type AccountKind,
} from '@/lib/account-kind';
import type { Role } from '@/lib/constants';

export type MemberAccessState = 'loading' | 'guest' | 'member' | 'staff';

const SESSION_PROBE_TIMEOUT_MS = 12_000;

export function useMemberAccess() {
  const { data: session, status } = useSession();
  const [sessionProbeTimedOut, setSessionProbeTimedOut] = useState(false);
  const nextRole = session?.user?.role as Role | undefined;
  const signedIn = status === 'authenticated' && !!session?.user;
  const isMember = signedIn && nextRole === 'SUBSCRIBER';
  const isStaff = signedIn && nextRole !== 'SUBSCRIBER';

  const workspaceHref = useWorkspaceHref(
    isStaff ? nextRole : isMember ? 'SUBSCRIBER' : undefined,
    signedIn,
    '/members/login',
  );

  useEffect(() => {
    if (status !== 'loading') {
      setSessionProbeTimedOut(false);
      return;
    }
    const timer = window.setTimeout(() => setSessionProbeTimedOut(true), SESSION_PROBE_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [status]);

  if (status === 'loading' && !sessionProbeTimedOut) {
    return {
      state: 'loading' as const,
      href: '/members/login',
      label: 'Member login',
      shortLabel: 'Login',
      hint: 'Checking sign-in status…',
      userName: null,
      initial: null,
      role: null,
      accountKind: null,
      roleLabel: null,
      signedIn: false,
      isMember: false,
    };
  }

  if (isStaff) {
    const kind = getAccountKind(nextRole) ?? 'editor';
    const roleLabel = getAccountRoleLabel(nextRole);
    const userName = session!.user!.name ?? 'User';
    const initial = userName.charAt(0).toUpperCase();

    return {
      state: 'staff' as const,
      href: workspaceHref,
      label: kind === 'admin' ? 'Admin console' : 'Editorial workspace',
      shortLabel: getAccountShortLabel(kind),
      hint: `${userName} · ${roleLabel}`,
      userName,
      initial,
      role: nextRole!,
      accountKind: kind,
      roleLabel,
      signedIn: true,
      isMember: false,
    };
  }

  if (isMember) {
    const userName = session!.user!.name ?? 'Member';
    const initial = userName.charAt(0).toUpperCase();
    const kind: AccountKind = 'member';

    return {
      state: 'member' as const,
      href: workspaceHref,
      label: 'My library',
      shortLabel: getAccountShortLabel(kind),
      hint: `${userName} · saved articles, magazine archive & downloads.`,
      userName,
      initial,
      role: 'SUBSCRIBER' as Role,
      accountKind: kind,
      roleLabel: getAccountRoleLabel('SUBSCRIBER'),
      signedIn: true,
      isMember: true,
    };
  }

  return {
    state: 'guest' as const,
    href: '/members/login',
    label: 'Member login',
    shortLabel: 'Login',
    hint: 'Save articles, magazine issues, downloads & comments.',
    userName: null,
    initial: null,
    role: null,
    accountKind: null,
    roleLabel: null,
    signedIn: false,
    isMember: false,
  };
}