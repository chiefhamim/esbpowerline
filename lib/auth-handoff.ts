import 'server-only';

import { createHmac, timingSafeEqual } from 'crypto';
import { createClient } from '@/utils/supabase/server';
import { getAuthSecret } from '@/lib/env-auth';

const HANDOFF_TTL_MS = 60_000;

type HandoffPayload = {
  access_token: string;
  refresh_token: string;
  exp: number;
};

function handoffSecret() {
  return getAuthSecret();
}

function encodePayload(payload: HandoffPayload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = createHmac('sha256', handoffSecret()).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function decodePayload(token: string): HandoffPayload | null {
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;

  const expected = createHmac('sha256', handoffSecret()).update(body).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as HandoffPayload;
    if (!payload.access_token || !payload.refresh_token || !payload.exp) return null;
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

/** True when the destination is another origin (e.g. localhost:3001 from :3000). */
export function needsAuthHandoff(destination: string, currentHost: string): boolean {
  if (!destination.trim()) return false;

  try {
    const url = /^https?:\/\//i.test(destination)
      ? new URL(destination)
      : new URL(destination, `http://${currentHost}`);
    return url.host !== currentHost;
  } catch {
    return false;
  }
}

export function authContinuePath(destination: string): string {
  return `/auth/continue?to=${encodeURIComponent(destination)}`;
}

export function buildHandoffUrl(destination: string, token: string): string {
  const current = /^https?:\/\//i.test(destination)
    ? new URL(destination)
    : new URL(destination, 'http://localhost:3000');

  const handoff = new URL('/api/auth/handoff', current.origin);
  handoff.searchParams.set('token', token);
  handoff.searchParams.set('callbackUrl', `${current.pathname}${current.search}`);
  return handoff.toString();
}

/** Short-lived signed token carrying Supabase session tokens for cross-port dev handoff. */
export async function createHandoffToken(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token || !session.refresh_token) return null;

  return encodePayload({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    exp: Date.now() + HANDOFF_TTL_MS,
  });
}

export function verifyHandoffToken(token: string | null | undefined): HandoffPayload | null {
  if (!token?.trim()) return null;
  return decodePayload(token.trim());
}