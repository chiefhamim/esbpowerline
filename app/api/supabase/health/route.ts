import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isCronAuthorized } from '@/lib/api/cron-auth';
import { canAccessAdminPanel } from '@/lib/constants';
import { checkSupabaseHealth } from '@/lib/supabase/health';

export async function GET(request: Request) {
  const cronAuthorized = isCronAuthorized(request);
  const session = cronAuthorized ? null : await auth();
  const adminSession =
    session?.user?.role && canAccessAdminPanel(session.user.role) ? session : null;

  if (!cronAuthorized && !adminSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const health = await checkSupabaseHealth();
  return NextResponse.json(health, { status: health.ok ? 200 : 503 });
}