/**
 * Stale AUTH_URL / NEXTAUTH_URL values break middleware session resolution on
 * Vercel — the session API sees a valid cookie but edge middleware does not,
 * causing redirect loops on /login ↔ /admin.
 *
 * With trustHost: true, Auth.js infers the URL from each request on Vercel.
 */
export function sanitizeAuthEnv() {
  const authUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? '';
  const pointsAtLocalhost =
    authUrl.includes('localhost') || authUrl.includes('127.0.0.1');
  const onVercel = !!process.env.VERCEL;

  if (onVercel) {
    delete process.env.AUTH_URL;
    delete process.env.NEXTAUTH_URL;
    return;
  }

  if (pointsAtLocalhost && process.env.NODE_ENV === 'production') {
    delete process.env.AUTH_URL;
    delete process.env.NEXTAUTH_URL;
  }
}