import { DEFAULT_DSE_TICKER, jitterDseSnapshot, type DseTickerItem } from '@/lib/bd-stock-market';
import { isSimulatedTelemetryEnabled } from '@/lib/telemetry-mode';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  let items: DseTickerItem[] = DEFAULT_DSE_TICKER;

  if (isSimulatedTelemetryEnabled()) {
    items = jitterDseSnapshot(DEFAULT_DSE_TICKER);
  }

  return Response.json({
    market: 'DSE',
    updatedAt: new Date().toISOString(),
    items,
  });
}