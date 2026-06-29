type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

function pruneExpired(now: number) {
  if (buckets.size <= MAX_BUCKETS) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
    if (buckets.size <= MAX_BUCKETS * 0.8) break;
  }
}

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterMs: number };

/**
 * Simple in-process rate limiter.
 * Limitation: buckets are per serverless instance — use WAF/edge for production scale.
 * On Vercel, combine with `clientIpFromForwarded` using x-forwarded-for / x-real-ip.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  pruneExpired(now);

  const bucket = buckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterMs: Math.max(0, bucket.resetAt - now) };
  }

  bucket.count += 1;
  return { allowed: true };
}

/** Resolve client IP from Vercel/proxy headers (x-forwarded-for, x-real-ip). */
export function clientIpFromForwarded(forwardedFor: string | null, realIp: string | null): string {
  const fromForwarded = forwardedFor?.split(',')[0]?.trim();
  return fromForwarded || realIp?.trim() || 'unknown';
}

/** Build a rate-limit key scoped by route prefix and client IP. */
export function edgeRateLimitKey(routePrefix: string, ip: string): string {
  return `${routePrefix}:${ip}`;
}

/** Standard Cache-Control for sensitive API responses. */
export const PRIVATE_NO_STORE = 'private, no-store' as const;