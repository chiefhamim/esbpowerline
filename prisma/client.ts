/**
 * Prisma client factory for CLI scripts (seed, migrations helpers).
 * Mirrors lib/prisma.ts adapter logic without server-only.
 */
import 'dotenv/config';
import path from 'path';
import { PrismaClient, type Prisma } from '@prisma/client';

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

const PRISMA_SCHEMA_PROVIDER = (process.env.PRISMA_SCHEMA_PROVIDER ?? 'sqlite') as
  | 'sqlite'
  | 'postgresql';

function assertDatabaseUrlMatchesSchema(databaseUrl: string) {
  const urlIsSqlite = isSqliteUrl(databaseUrl);
  const urlIsPostgres = isPostgresUrl(databaseUrl);

  if (PRISMA_SCHEMA_PROVIDER === 'sqlite' && !urlIsSqlite) {
    throw new Error(
      'PRISMA_SCHEMA_PROVIDER=sqlite but DATABASE_URL is not a file: URL.',
    );
  }
  if (PRISMA_SCHEMA_PROVIDER === 'postgresql' && !urlIsPostgres) {
    throw new Error(
      'PRISMA_SCHEMA_PROVIDER=postgresql but DATABASE_URL is not a postgresql:// URL.',
    );
  }
}

export function createScriptPrismaClient(): PrismaClient {
  const databaseUrl = resolveDatabaseUrl();
  assertDatabaseUrlMatchesSchema(databaseUrl);
  const log: Prisma.LogLevel[] = ['warn', 'error'];

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