export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { sanitizeAuthEnv } = await import('@/lib/auth-env');
    sanitizeAuthEnv();
  }
}