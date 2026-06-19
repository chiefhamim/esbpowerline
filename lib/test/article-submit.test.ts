import { describe, it, expect } from 'vitest';
import {
  buildArticleSubmitPayload,
  validateArticleSubmitPayload,
  mockArticleSubmit,
} from '@/lib/test/mockArticleSubmit';
import {
  VALID_DRAFT_PAYLOAD,
  VALID_PUBLISH_PAYLOAD,
  INVALID_PUBLISH_PAYLOAD,
} from '@/lib/test/article-form-fixtures';
import { getMockAnalytics, getMockChartProps } from '@/lib/mockAnalytics';

describe('Article form — mock submit validation', () => {
  it('accepts a complete draft payload with cover photo URL', () => {
    const result = validateArticleSubmitPayload(VALID_DRAFT_PAYLOAD);
    expect(result.ok).toBe(true);
    expect(result.payload.title).toBe(VALID_DRAFT_PAYLOAD.title);
    expect(result.payload.imageUrl).toMatch(/^https:\/\//);
    expect(result.errors).toHaveLength(0);
  });

  it('accepts a publish payload with headline, excerpt, and body', () => {
    const result = validateArticleSubmitPayload(VALID_PUBLISH_PAYLOAD);
    expect(result.ok).toBe(true);
    expect(result.parsed.status).toBe('PUBLISHED');
    expect(result.payload.seo?.heroImage?.alt).toBeTruthy();
  });

  it('rejects incomplete publish payloads', () => {
    const result = validateArticleSubmitPayload(INVALID_PUBLISH_PAYLOAD);
    expect(result.ok).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('buildArticleSubmitPayload mirrors ArticleForm field assembly', () => {
    const payload = buildArticleSubmitPayload({
      title: 'Test headline',
      slug: 'test-headline',
      excerpt: 'Deck copy here',
      content: '<p>Body</p>',
      category: 'Power Generation',
      status: 'DRAFT',
      imageUrl: 'https://cdn.esbpowerline.test/hero.jpg',
      tags: ['test'],
      isFeatured: false,
      isBreaking: false,
      isPinned: false,
      publishedAt: null,
    });
    expect(payload.imageUrl).toBe('https://cdn.esbpowerline.test/hero.jpg');
    expect(payload.tags).toEqual(['test']);
  });

  it('mockArticleSubmit resolves without throwing for valid draft', async () => {
    const result = await mockArticleSubmit(VALID_DRAFT_PAYLOAD);
    expect(result.mockId).toMatch(/^mock-/);
    expect(result.ok).toBe(true);
  });
});

describe('Mock analytics — chart data shapes', () => {
  it('returns deterministic publishing trend with 14 buckets', () => {
    const data = getMockAnalytics();
    expect(data.publishingTrend).toHaveLength(14);
    expect(data.publishingTrend[13]).toEqual({ label: 'Jun 19', count: 10, views: 14500 });
  });

  it('includes regional traffic segments and active reader total', () => {
    const data = getMockAnalytics();
    expect(data.regionalTraffic.length).toBeGreaterThanOrEqual(5);
    expect(data.activeReaders).toBe(data.regionalTraffic.reduce((s, r) => s + r.readers, 0));
    expect(data.periodMetrics.activeUsers).toBe(data.activeReaders);
  });

  it('chart props slice matches AdminAnalyticsCharts contract', () => {
    const charts = getMockChartProps();
    expect(charts.topArticles[0]).toMatchObject({
      title: expect.any(String),
      slug: expect.any(String),
      views: expect.any(Number),
      category: expect.any(String),
    });
    expect(charts.usersByRole[0]).toMatchObject({ role: expect.any(String), _count: expect.any(Number) });
    expect(charts.categoriesByViews[0]).toMatchObject({
      category: expect.any(String),
      articles: expect.any(Number),
      views: expect.any(Number),
    });
  });
});