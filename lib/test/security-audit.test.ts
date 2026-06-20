import { describe, it, expect } from 'vitest';
import { assertActorCanManageTarget } from '@/lib/role-hierarchy';
import { sanitizeArticleHtml } from '@/lib/sanitize-article-html';
import { isBlockedUploadMime, assertAllowedUploadMime } from '@/lib/upload-policy';
import { checkRateLimit, clientIpFromForwarded } from '@/lib/rate-limit';
import { viewDedupBucket } from '@/lib/article-view-dedup';
import { resolveSafeLocalUploadPath } from '@/lib/local-upload-path';

describe('role hierarchy', () => {
  it('blocks admins from managing super admins', () => {
    expect(() => assertActorCanManageTarget('ADMIN', 'SUPER_ADMIN')).toThrow('Forbidden');
  });

  it('blocks admins from managing peer admins', () => {
    expect(() => assertActorCanManageTarget('ADMIN', 'ADMIN')).toThrow('Forbidden');
  });

  it('allows super admins to manage lower roles', () => {
    expect(() => assertActorCanManageTarget('SUPER_ADMIN', 'ADMIN')).not.toThrow();
  });

  it('allows self-management at the same role level', () => {
    expect(() =>
      assertActorCanManageTarget('ADMIN', 'ADMIN', { isSelf: true }),
    ).not.toThrow();
  });
});

describe('article html sanitization', () => {
  it('removes script tags and inline handlers', () => {
    const dirty = '<p>Hello</p><script>alert(1)</script><img src=x onerror=alert(1)>';
    const clean = sanitizeArticleHtml(dirty);
    expect(clean).not.toMatch(/script/i);
    expect(clean).not.toMatch(/onerror/i);
    expect(clean).toContain('Hello');
  });

  it('preserves safe editorial markup', () => {
    const html = '<h2>Title</h2><p><strong>Bold</strong> <a href="https://example.com">link</a></p>';
    expect(sanitizeArticleHtml(html)).toContain('<h2>');
    expect(sanitizeArticleHtml(html)).toContain('noopener noreferrer');
  });
});

describe('upload policy', () => {
  it('blocks svg mime types and extensions', () => {
    expect(isBlockedUploadMime('image/svg+xml')).toBe(true);
    expect(isBlockedUploadMime('image/png', 'photo.svg')).toBe(true);
    expect(() => assertAllowedUploadMime('image/svg+xml')).toThrow(/SVG/i);
  });
});

describe('local upload path safety', () => {
  it('rejects traversal outside uploads directory', () => {
    expect(resolveSafeLocalUploadPath('/uploads/../../.env')).toBeNull();
    expect(resolveSafeLocalUploadPath('/uploads/../package.json')).toBeNull();
  });

  it('accepts normal upload paths', () => {
    const resolved = resolveSafeLocalUploadPath('/uploads/2026-photo.jpg');
    expect(resolved).toContain('uploads');
    expect(resolved).toContain('2026-photo.jpg');
  });
});

describe('rate limiting', () => {
  it('allows requests under the limit', () => {
    const key = `test-${Date.now()}`;
    expect(checkRateLimit(key, 2, 60_000).allowed).toBe(true);
    expect(checkRateLimit(key, 2, 60_000).allowed).toBe(true);
  });

  it('blocks requests over the limit', () => {
    const key = `test-block-${Date.now()}`;
    checkRateLimit(key, 1, 60_000);
    const blocked = checkRateLimit(key, 1, 60_000);
    expect(blocked.allowed).toBe(false);
    if (!blocked.allowed) {
      expect(blocked.retryAfterMs).toBeGreaterThan(0);
    }
  });

  it('parses forwarded client ip', () => {
    expect(clientIpFromForwarded('203.0.113.1, 10.0.0.1', null)).toBe('203.0.113.1');
    expect(clientIpFromForwarded(null, '198.51.100.2')).toBe('198.51.100.2');
  });
});

describe('article view dedup bucket', () => {
  it('uses stable buckets within the dedup window', () => {
    const now = 1_700_000_000_000;
    expect(viewDedupBucket(now)).toBe(viewDedupBucket(now + 1_000));
  });
});