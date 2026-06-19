/**
 * Analytics data source switch — live DB vs deterministic mock.
 *
 * Set NEXT_PUBLIC_MOCK_ANALYTICS=true in .env.local to render charts
 * with fixed coordinates (no Supabase/Prisma reads).
 */

import { getAnalytics, type AnalyticsOptions } from '@/lib/actions/analytics';
import { getMockAnalytics, type MockAnalyticsPayload } from '@/lib/mockAnalytics';
import { isMockAnalyticsEnabled } from '@/lib/mock-flags';

export { isMockAnalyticsEnabled };

export type AnalyticsData = Awaited<ReturnType<typeof getAnalytics>> | MockAnalyticsPayload;

export async function loadAdminAnalytics(options?: AnalyticsOptions): Promise<AnalyticsData> {
  if (isMockAnalyticsEnabled()) {
    return getMockAnalytics({
      period: options?.period as MockAnalyticsPayload['filters']['period'] | undefined,
      month: options?.month ?? null,
    });
  }
  return getAnalytics(options);
}