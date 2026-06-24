import { NextResponse } from 'next/server';
import { runIngestionPipeline } from '@/scripts/ingest-energy-reports';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  
  // For development ease, if CRON_SECRET is not configured in local env, allow execution
  if (cronSecret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    console.log('[API Cron] Triggering energy report ingestion pipeline...');
    await runIngestionPipeline();
    return NextResponse.json({
      ok: true,
      message: 'Ingestion pipeline executed successfully',
    });
  } catch (error: any) {
    console.error('[API Cron] Ingestion failed:', error);
    return NextResponse.json({
      ok: false,
      error: error.message || String(error),
    }, { status: 500 });
  }
}
