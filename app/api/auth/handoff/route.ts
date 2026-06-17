import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import {
  createSessionToken,
  sessionCookieName,
  verifyHandoffToken,
} from '@/lib/auth-handoff';

function safeCallbackUrl(raw: string | null): string {
  if (!raw?.startsWith('/')) return '/';
  if (raw.startsWith('//')) return '/';
  return raw;
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const callbackUrl = safeCallbackUrl(request.nextUrl.searchParams.get('callbackUrl'));

  const isMemberCallback =
    callbackUrl === '/members' || callbackUrl.startsWith('/members/');

  if (!token) {
    const loginPath = isMemberCallback ? '/members/login' : '/login';
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  const user = await verifyHandoffToken(token);
  if (!user) {
    const loginPath = isMemberCallback ? '/members/login' : '/login';
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  const secure = request.nextUrl.protocol === 'https:';
  const sessionToken = await createSessionToken(user);
  const response = NextResponse.redirect(new URL(callbackUrl, request.url));

  response.cookies.set(sessionCookieName(secure), sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure,
    maxAge: 30 * 24 * 60 * 60,
  });

  return response;
}