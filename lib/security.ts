import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, clientIpFromForwarded, PRIVATE_NO_STORE } from '@/lib/rate-limit';

/**
 * Verify the x-csrf-token header against the CSRF_SECRET env var.
 * In production, CSRF_SECRET must be set (enforced by env-guard) — fail closed if missing.
 */
export function checkCsrf(request: NextRequest): NextResponse | null {
  const secret = process.env.CSRF_SECRET?.trim();
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return null;
  }
  const token = request.headers.get('x-csrf-token');
  if (token !== secret) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return null;
}

/**
 * Apply per-IP rate limiting to a request.
 * Returns a 429 NextResponse if exceeded, or null if allowed.
 */
export function checkRateLimitResponse(
  request: NextRequest,
  key: string,
  limit: number,
  windowMs: number,
): NextResponse | null {
  const ip = clientIpFromForwarded(
    request.headers.get('x-forwarded-for'),
    request.headers.get('x-real-ip'),
  );
  const result = checkRateLimit(`${key}:${ip}`, limit, windowMs);
  if (!result.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again shortly.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(result.retryAfterMs / 1000)),
          'Cache-Control': PRIVATE_NO_STORE,
        },
      },
    );
  }
  return null;
}

/** Attach private no-store cache header to a JSON response. */
export function withPrivateNoStore(response: NextResponse): NextResponse {
  response.headers.set('Cache-Control', PRIVATE_NO_STORE);
  return response;
}