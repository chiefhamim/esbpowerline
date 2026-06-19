import 'server-only';

import { isPostgresUrl, isSqliteUrl, resolveDatabaseUrl, resolvePrismaSchemaProvider } from '@/lib/prisma-database';
import prisma from '@/lib/prisma';

export type DbHealthResult = {
  ok: boolean;
  provider: 'sqlite' | 'postgresql';
  databaseUrl: 'set' | 'missing' | 'dev-fallback';
  connection: 'ok' | 'error';
  tables?: {
    articles: number;
    categories: number;
    users: number;
  };
  error?: string;
};

export async function checkDbHealth(): Promise<DbHealthResult> {
  const raw = process.env.DATABASE_URL?.trim();
  let databaseUrl: 'set' | 'missing' | 'dev-fallback' = 'set';
  if (!raw) {
    databaseUrl = process.env.NODE_ENV === 'production' ? 'missing' : 'dev-fallback';
  }

  let provider: 'sqlite' | 'postgresql' = 'sqlite';
  try {
    const url = resolveDatabaseUrl();
    provider = resolvePrismaSchemaProvider(url);
    if (!isSqliteUrl(url) && !isPostgresUrl(url)) {
      return {
        ok: false,
        provider,
        databaseUrl,
        connection: 'error',
        error: 'Unsupported DATABASE_URL scheme',
      };
    }
  } catch (error) {
    return {
      ok: false,
      provider,
      databaseUrl,
      connection: 'error',
      error: error instanceof Error ? error.message : 'Invalid DATABASE_URL',
    };
  }

  try {
    const [articles, categories, users] = await Promise.all([
      prisma.article.count(),
      prisma.category.count(),
      prisma.user.count(),
    ]);

    return {
      ok: true,
      provider,
      databaseUrl,
      connection: 'ok',
      tables: { articles, categories, users },
    };
  } catch (error) {
    return {
      ok: false,
      provider,
      databaseUrl,
      connection: 'error',
      error: error instanceof Error ? error.message : 'Database query failed',
    };
  }
}