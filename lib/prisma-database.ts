import path from 'path';
import dotenv from 'dotenv';

try {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });
  dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });
} catch (e) {}

export function resolveDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) {
    const fallback = process.env.POSTGRES_PRISMA_URL?.trim() || process.env.POSTGRES_URL?.trim();
    if (!fallback) {
      throw new Error(
        'DATABASE_URL or POSTGRES_PRISMA_URL is not set. Please configure your PostgreSQL connection string in .env or .env.local.'
      );
    }
    return fallback;
  }
  return raw;
}

export function isSqliteUrl(url: string): boolean {
  return false;
}

export function isPostgresUrl(url: string): boolean {
  return url.startsWith('postgresql://') || url.startsWith('postgres://');
}

/** Supabase pooler TLS needs relaxed cert verification in serverless Node runtimes. */
export function createPgPoolConfig(connectionString: string) {
  let remote = true;
  let poolUrl = connectionString;

  try {
    const normalized = connectionString
      .replace(/^postgresql:\/\//, 'https://')
      .replace(/^postgres:\/\//, 'https://');
    const parsed = new URL(normalized);
    const host = parsed.hostname;
    remote = host !== 'localhost' && host !== '127.0.0.1';

    if (remote) {
      // sslmode=require in the URL forces strict verification — strip it and use Pool.ssl instead.
      parsed.searchParams.delete('sslmode');
      parsed.searchParams.delete('supa');
      const search = parsed.searchParams.toString();
      poolUrl = `postgresql://${parsed.username}:${parsed.password}@${parsed.host}${parsed.pathname}${search ? `?${search}` : ''}`;
    }
  } catch {
    remote = true;
  }

  return {
    connectionString: poolUrl,
    ssl: remote ? { rejectUnauthorized: false as const } : undefined,
    max: process.env.NODE_ENV === 'production' ? 2 : 10,
    idleTimeoutMillis: 15000,
  };
}

export function resolvePrismaSchemaProvider(databaseUrl?: string): 'sqlite' | 'postgresql' {
  return 'postgresql';
}

export function assertDatabaseUrlMatchesSchema(
  databaseUrl: string,
  provider: 'sqlite' | 'postgresql',
) {
  if (!isPostgresUrl(databaseUrl)) {
    throw new Error(
      'DATABASE_URL is not a postgresql:// URL. Please set DATABASE_URL to your Supabase pooler URL.'
    );
  }
}