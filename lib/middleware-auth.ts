import type { NextRequest } from 'next/server';
import type { Session } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import type { Role } from '@/lib/constants';

function sessionCookieName(secure: boolean): string {
  return secure ? '__Secure-authjs.session-token' : 'authjs.session-token';
}

/** Read the Auth.js JWT directly — reliable on Vercel edge middleware. */
export async function getMiddlewareSession(
  request: NextRequest,
): Promise<Session | null> {
  const secure = request.nextUrl.protocol === 'https:';
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) return null;

  const token = await getToken({
    req: request,
    secret,
    secureCookie: secure,
    cookieName: sessionCookieName(secure),
    salt: sessionCookieName(secure),
  });

  if (!token?.sub || !token.role) return null;

  return {
    expires: token.exp ? new Date(token.exp * 1000).toISOString() : '',
    user: {
      id: (token.id as string) ?? token.sub,
      email: (token.email as string) ?? '',
      name: (token.name as string) ?? 'User',
      role: token.role as Role,
    },
  };
}