import { NextResponse } from 'next/server';
import { isCronAuthorized } from '@/lib/api/cron-auth';
import { checkDbHealth } from '@/lib/db-health';

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const health = await checkDbHealth();
  return NextResponse.json(health, { status: health.ok ? 200 : 503 });
}