import 'server-only';
import 'dotenv/config';
import { PrismaClient, type Prisma } from '@prisma/client';
import {
  assertDatabaseUrlMatchesSchema,
  isSqliteUrl,
  createPgPoolConfig,
  resolveDatabaseUrl,
  resolvePrismaSchemaProvider,
} from './prisma-database';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient() {
  const databaseUrl = resolveDatabaseUrl();
  const provider = resolvePrismaSchemaProvider(databaseUrl);
  assertDatabaseUrlMatchesSchema(databaseUrl, provider);
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
  const pool = new Pool(createPgPoolConfig(databaseUrl));
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter, log });
}

/** Dev hot-reload can keep an old client after schema changes — recreate if models are missing */
function isPrismaClientCurrent(client: PrismaClient): boolean {
  return 'savedItem' in client && 'memberDownload' in client && 'user' in client && 'contactMessage' in client;
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