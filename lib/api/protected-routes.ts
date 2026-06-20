/** API path prefixes gated by proxy.ts (session or CRON_SECRET). */
export const PROXY_PROTECTED_API_PREFIXES = [
  '/api/analytics',
  '/api/upload',
  '/api/members/grid-export',
] as const;

export function isProxyProtectedApi(pathname: string): boolean {
  return PROXY_PROTECTED_API_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}