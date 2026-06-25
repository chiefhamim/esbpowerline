import 'server-only';

import { isPostgresUrl, resolveDatabaseUrl } from '@/lib/prisma-database';
import prisma from '@/lib/prisma';

export type DbHealthResult = {
  ok: boolean;
  provider: 'postgresql';
  databaseUrl: 'set' | 'missing';
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
  let databaseUrl: 'set' | 'missing' = 'set';
  if (!raw) {
    databaseUrl = 'missing';
  }

  const provider = 'postgresql';
  try {
    const url = resolveDatabaseUrl();
    if (!isPostgresUrl(url)) {
      return {
        ok: false,
        provider,
        databaseUrl,
        connection: 'error',
        error: 'Unsupported DATABASE_URL scheme, must be postgresql:// or postgres://',
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