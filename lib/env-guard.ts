export function assertEnvVar(name: string): void {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable ${name}`);
  }
}

export function validateProdEnv(): void {
  if (process.env.NODE_ENV === 'production') {
    const required = [
      'DATABASE_URL',
      'CRON_SECRET',
      'AUTH_SECRET',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'CSRF_SECRET',
    ];
    required.forEach(assertEnvVar);
  }
}
