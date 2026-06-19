import { describe, expect, it, vi, afterEach } from 'vitest';
import { isMockAnalyticsEnabled, isMockArticleSubmitEnabled } from '@/lib/mock-flags';

describe('mock QA flags', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('disables mock analytics in production even when env flag is true', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_MOCK_ANALYTICS', 'true');
    expect(isMockAnalyticsEnabled()).toBe(false);
  });

  it('disables mock article submit in production even when env flag is true', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_MOCK_ARTICLE_SUBMIT', 'true');
    expect(isMockArticleSubmitEnabled()).toBe(false);
  });

  it('honours mock flags in non-production', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('NEXT_PUBLIC_MOCK_ANALYTICS', 'true');
    vi.stubEnv('NEXT_PUBLIC_MOCK_ARTICLE_SUBMIT', 'true');
    expect(isMockAnalyticsEnabled()).toBe(true);
    expect(isMockArticleSubmitEnabled()).toBe(true);
  });
});