import { describe, it, expect } from 'vitest';
import {
  buildArticleSubmitPayload,
  validateArticleSubmitPayload,
} from '@/lib/test/article-submit-validation';
import {
  VALID_DRAFT_PAYLOAD,
  VALID_PUBLISH_PAYLOAD,
  INVALID_PUBLISH_PAYLOAD,
} from '@/lib/test/article-form-fixtures';

describe('Article form — submit validation', () => {
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
});