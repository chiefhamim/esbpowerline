import { NextRequest, NextResponse } from 'next/server';
import { getAnalytics } from '@/lib/actions/analytics';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
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