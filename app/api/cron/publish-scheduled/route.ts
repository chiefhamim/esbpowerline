import { NextResponse } from 'next/server';
import { publishDueScheduledArticles } from '@/lib/actions/articles';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (!cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET is not configured' }, { status: 503 });
  }

  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await publishDueScheduledArticles();
  return NextResponse.json({
    ok: true,
    publishedCount: result.published.length,
    skippedCount: result.skipped.length,
    ...result,
  });
}