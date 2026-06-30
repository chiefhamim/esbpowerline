import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { canAccessAdminPanel } from '@/lib/constants';
import { getAnalytics } from '@/lib/actions/analytics';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !session?.user?.role || !canAccessAdminPanel(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = req.nextUrl;
    const data = await getAnalytics({
      period: searchParams.get('period') ?? undefined,
      month: searchParams.get('month'),
    });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}