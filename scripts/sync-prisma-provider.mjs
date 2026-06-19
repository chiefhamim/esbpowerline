/**
 * Sync prisma/schema.prisma datasource from PRISMA_SCHEMA_PROVIDER.
 * PostgreSQL includes directUrl so migrate deploy uses port 5432 (not the pooler).
 */
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const provider = (process.env.PRISMA_SCHEMA_PROVIDER ?? 'sqlite').trim();
if (provider !== 'sqlite' && provider !== 'postgresql') {
  console.error(`Invalid PRISMA_SCHEMA_PROVIDER: ${provider}`);
  process.exit(1);
}

const sqliteDatasource = `datasource db {
  provider = "sqlite"
}`;

const postgresDatasource = `datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}`;

const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
const schema = readFileSync(schemaPath, 'utf8');
const replacement = provider === 'postgresql' ? postgresDatasource : sqliteDatasource;

const next = schema.replace(/datasource db\s*\{[^}]*\}/s, replacement);

if (next === schema) {
  console.warn('[sync-prisma-provider] datasource block unchanged — check schema.prisma format');
}

writeFileSync(schemaPath, next, 'utf8');
console.log(`[sync-prisma-provider] provider = ${provider}`);
if (provider === 'postgresql') {
  console.log('[sync-prisma-provider] migrations will use DIRECT_URL (port 5432), not the pooler');
}