import path from 'path';

export function resolveDatabaseUrl() {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'DATABASE_URL is not set. Add your Supabase transaction pooler URL to production environment variables.',
      );
    }
    const devPath = path.join(/*turbopackIgnore: true*/ process.cwd(), 'dev.db');
    return `file:${devPath}`;
  }
  if (raw.startsWith('file:')) {
    const filePath = raw.replace(/^file:/, '');
    const absolute = path.isAbsolute(filePath)
      ? filePath
      : path.join(/*turbopackIgnore: true*/ process.cwd(), filePath);
    return `file:${absolute}`;
  }
  return raw;
}

export function isSqliteUrl(url: string) {
  return url.startsWith('file:');
}

export function isPostgresUrl(url: string) {
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
  };
}

/** Explicit PRISMA_SCHEMA_PROVIDER wins; otherwise infer from DATABASE_URL. */
export function resolvePrismaSchemaProvider(databaseUrl?: string): 'sqlite' | 'postgresql' {
  const explicit = process.env.PRISMA_SCHEMA_PROVIDER?.trim();
  if (explicit === 'sqlite' || explicit === 'postgresql') {
    return explicit;
  }

  const url = databaseUrl ?? resolveDatabaseUrl();
  if (isPostgresUrl(url)) return 'postgresql';
  if (isSqliteUrl(url)) return 'sqlite';
  return 'sqlite';
}

export function assertDatabaseUrlMatchesSchema(
  databaseUrl: string,
  provider: 'sqlite' | 'postgresql',
) {
  const urlIsSqlite = isSqliteUrl(databaseUrl);
  const urlIsPostgres = isPostgresUrl(databaseUrl);

  if (provider === 'sqlite' && !urlIsSqlite) {
    throw new Error(
      'Prisma schema provider is sqlite but DATABASE_URL is not a file: URL. ' +
        'For local dev use DATABASE_URL="file:./dev.db", or set PRISMA_SCHEMA_PROVIDER=postgresql and use a postgresql:// URL.',
    );
  }

  if (provider === 'postgresql' && !urlIsPostgres) {
    throw new Error(
      'Prisma schema provider is postgresql but DATABASE_URL is not a postgresql:// URL. ' +
        'Set DATABASE_URL to your Supabase pooler URL (see .env.example), then run `npx prisma generate`.',
    );
  }

  if (!urlIsSqlite && !urlIsPostgres) {
    throw new Error(`Unsupported DATABASE_URL scheme: ${databaseUrl.split(':')[0]}:`);
  }
}