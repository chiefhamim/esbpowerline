import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Supabase-backed session endpoint (replaces NextAuth /api/auth/session). */
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json(null);
  }
  return NextResponse.json(session);
}