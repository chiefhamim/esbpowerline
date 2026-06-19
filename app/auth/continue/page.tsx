import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import {
  authContinuePath,
  buildHandoffUrl,
  createHandoffToken,
  needsAuthHandoff,
} from '@/lib/auth-handoff';
import { redirectUrlForRequest } from '@/lib/auth-routing';
import { headers } from 'next/headers';

type Props = {
  searchParams: Promise<{ to?: string }>;
};

function safeDestination(raw: string | undefined): string | null {
  if (!raw?.trim()) return null;
  const value = raw.trim();
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  try {
    const url = new URL(value);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url.toString();
  } catch {
    return null;
  }
}

export default async function AuthContinuePage({ searchParams }: Props) {
  const { to } = await searchParams;
  const destination = safeDestination(to);

  if (!destination) {
    redirect('/');
  }

  const headerStore = await headers();
  const host = headerStore.get('host') ?? 'localhost:3000';
  const proto = headerStore.get('x-forwarded-proto') ?? 'http';

  const session = await auth();
  if (!session?.user?.id || !session.user.email || !session.user.role) {
    const pathOnly = destination.split('?')[0];
    const isMemberDestination = pathOnly === '/members' || pathOnly.startsWith('/members/');
    const login = new URL(isMemberDestination ? '/members/login' : '/login', `${proto}://${host}`);
    login.searchParams.set('callbackUrl', destination);
    redirect(login.toString());
  }

  if (!needsAuthHandoff(destination, host)) {
    redirect(redirectUrlForRequest(destination, `${proto}://${host}`) as string);
  }

  const token = await createHandoffToken();
  if (!token) {
    redirect(authContinuePath(destination));
  }

  redirect(buildHandoffUrl(destination, token));
}