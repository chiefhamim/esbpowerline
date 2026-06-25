export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { sanitizeAuthEnv } = await import('@/lib/auth-env');
    sanitizeAuthEnv();

    // Validate required env vars early — crash loudly rather than silently misbehave
    const { validateProdEnv } = await import('@/lib/env-guard');
    validateProdEnv();
  }
}