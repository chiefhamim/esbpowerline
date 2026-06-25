/**
 * Prisma client factory for CLI scripts (seed, migrations helpers).
 * Mirrors lib/prisma.ts adapter logic without server-only.
 */
import 'dotenv/config';
import { PrismaClient, type Prisma } from '@prisma/client';
import {
  createPgPoolConfig,
  resolveDatabaseUrl,
} from '../lib/prisma-database';

export function createScriptPrismaClient(): PrismaClient {
  const databaseUrl = resolveDatabaseUrl();
  const log: Prisma.LogLevel[] = ['warn', 'error'];

  const { PrismaPg } = require('@prisma/adapter-pg') as typeof import('@prisma/adapter-pg');
  const { Pool } = require('pg') as typeof import('pg');
  const pool = new Pool(createPgPoolConfig(databaseUrl));
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter, log });
}