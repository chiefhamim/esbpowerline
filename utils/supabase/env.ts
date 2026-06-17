const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

/** Prefer the new publishable key; fall back to legacy anon JWT for older env files. */
function resolvePublicKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    ''
  );
}

export function getSupabaseEnv() {
  const publicKey = resolvePublicKey();
  const isConfigured = !!(url && publicKey && !url.includes('your-project') && !url.includes('dummy'));

  return {
    url: isConfigured ? url! : 'https://dummy-supabase-url.co',
    /** Public client key — publishable or anon. */
    anonKey: isConfigured ? publicKey : 'dummy-key',
    publishableKey: isConfigured ? publicKey : 'dummy-key',
    serviceRoleKey: (isConfigured ? process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() : null) ?? null,
    isConfigured,
  };
}