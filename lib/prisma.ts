import 'server-only';
import 'dotenv/config';
import path from 'path';
import { PrismaClient, type Prisma } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function resolveDatabaseUrl() {
  const raw = process.env.DATABASE_URL?.trim() || 'file:./dev.db';
  if (raw.startsWith('file:')) {
    const filePath = raw.replace(/^file:/, '');
    const absolute = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath);
    return `file:${absolute}`;
  }
  return raw;
}

function isSqliteUrl(url: string) {
  return url.startsWith('file:');
}

function isPostgresUrl(url: string) {
  return url.startsWith('postgresql://') || url.startsWith('postgres://');
}

/** Must match `provider` in prisma/schema.prisma at last `prisma generate` */
const PRISMA_SCHEMA_PROVIDER = (process.env.PRISMA_SCHEMA_PROVIDER ?? 'sqlite') as 'sqlite' | 'postgresql';

function assertDatabaseUrlMatchesSchema(databaseUrl: string) {
  const urlIsSqlite = isSqliteUrl(databaseUrl);
  const urlIsPostgres = isPostgresUrl(databaseUrl);

  if (PRISMA_SCHEMA_PROVIDER === 'sqlite' && !urlIsSqlite) {
    throw new Error(
      'Prisma schema provider is sqlite but DATABASE_URL is not a file: URL. ' +
        'For local dev use DATABASE_URL="file:./dev.db", or set PRISMA_SCHEMA_PROVIDER=postgresql and use a postgresql:// URL.',
    );
  }

  if (PRISMA_SCHEMA_PROVIDER === 'postgresql' && !urlIsPostgres) {
    throw new Error(
      'Prisma schema provider is postgresql but DATABASE_URL is not a postgresql:// URL. ' +
        'Set DATABASE_URL to your Supabase pooler URL (see .env.example), then run `npx prisma generate`.',
    );
  }

  if (!urlIsSqlite && !urlIsPostgres) {
    throw new Error(`Unsupported DATABASE_URL scheme: ${databaseUrl.split(':')[0]}:`);
  }
}

function createPrismaClient() {
  const databaseUrl = resolveDatabaseUrl();
  assertDatabaseUrlMatchesSchema(databaseUrl);
  const log: Prisma.LogLevel[] =
    process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'];

  if (isSqliteUrl(databaseUrl)) {
    const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3') as typeof import('@prisma/adapter-better-sqlite3');
    const adapter = new PrismaBetterSqlite3(
      { url: databaseUrl },
      { timestampFormat: 'unixepoch-ms' },
    );
    return new PrismaClient({ adapter, log });
  }

  const { PrismaPg } = require('@prisma/adapter-pg') as typeof import('@prisma/adapter-pg');
  const { Pool } = require('pg') as typeof import('pg');
  const pool = new Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter, log });
}

/** Dev hot-reload can keep an old client after schema changes — recreate if models are missing */
function isPrismaClientCurrent(client: PrismaClient): boolean {
  return 'savedItem' in client && 'memberDownload' in client && 'user' in client;
}

function getPrismaClient(): PrismaClient {
  const cached = globalForPrisma.prisma;
  if (cached && isPrismaClientCurrent(cached)) {
    return cached;
  }
  const client = createPrismaClient();
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client;
  }
  return client;
}

export const prisma = getPrismaClient();

export default prisma;