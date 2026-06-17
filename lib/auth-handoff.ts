import { encode, decode } from '@auth/core/jwt';
import { isCrossOriginDestination } from '@/lib/auth-routing';
import type { Role } from '@/lib/constants';

const HANDOFF_SALT = 'authjs.handoff';
const SESSION_SALT = 'authjs.session-token';
const HANDOFF_MAX_AGE = process.env.NODE_ENV === 'development' ? 300 : 60;

export type HandoffUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

type HandoffPayload = {
  sub: string;
  id: string;
  email: string;
  name: string;
  role: Role;
  purpose: 'auth-handoff';
};

function authSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET is not configured');
  return secret;
}

export function needsAuthHandoff(destination: string, currentHost: string): boolean {
  return isCrossOriginDestination(destination, currentHost);
}

export async function createHandoffToken(user: HandoffUser): Promise<string> {
  return encode({
    token: {
      sub: user.id,
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      purpose: 'auth-handoff',
    },
    secret: authSecret(),
    salt: HANDOFF_SALT,
    maxAge: HANDOFF_MAX_AGE,
  });
}

export async function verifyHandoffToken(token: string): Promise<HandoffUser | null> {
  try {
    const payload = (await decode({
      token,
      secret: authSecret(),
      salt: HANDOFF_SALT,
    })) as HandoffPayload | null;

    if (!payload?.id || payload.purpose !== 'auth-handoff') return null;

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export function buildHandoffUrl(destination: string, handoffToken: string): string {
  const target = new URL(destination);
  const callbackPath = `${target.pathname}${target.search}`;
  const handoff = new URL('/api/auth/handoff', target.origin);
  handoff.searchParams.set('token', handoffToken);
  handoff.searchParams.set('callbackUrl', callbackPath);
  return handoff.toString();
}

export async function createSessionToken(user: HandoffUser): Promise<string> {
  return encode({
    token: {
      name: user.name,
      email: user.email,
      sub: user.id,
      id: user.id,
      role: user.role,
    },
    secret: authSecret(),
    salt: SESSION_SALT,
  });
}

export function sessionCookieName(secure: boolean): string {
  return secure ? '__Secure-authjs.session-token' : 'authjs.session-token';
}

export function authContinuePath(destination: string): string {
  return `/auth/continue?to=${encodeURIComponent(destination)}`;
}