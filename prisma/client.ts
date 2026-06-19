/**
 * Prisma client factory for CLI scripts (seed, migrations helpers).
 * Mirrors lib/prisma.ts adapter logic without server-only.
 */
import 'dotenv/config';
import { PrismaClient, type Prisma } from '@prisma/client';
import {
  assertDatabaseUrlMatchesSchema,
  isSqliteUrl,
  createPgPoolConfig,
  resolveDatabaseUrl,
  resolvePrismaSchemaProvider,
} from '../lib/prisma-database';

export function createScriptPrismaClient(): PrismaClient {
  const databaseUrl = resolveDatabaseUrl();
  const provider = resolvePrismaSchemaProvider(databaseUrl);
  assertDatabaseUrlMatchesSchema(databaseUrl, provider);
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
  const pool = new Pool(createPgPoolConfig(databaseUrl));
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter, log });
}