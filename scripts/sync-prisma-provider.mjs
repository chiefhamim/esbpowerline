/**
 * Sync prisma/schema.prisma datasource provider from PRISMA_SCHEMA_PROVIDER.
 * Prisma 7: connection URLs live in prisma.config.ts only — not in schema.prisma.
 */
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load env files in standard precedence order
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.production.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.development.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const provider = (process.env.PRISMA_SCHEMA_PROVIDER ?? 'sqlite').trim();
if (provider !== 'sqlite' && provider !== 'postgresql') {
  console.error(`Invalid PRISMA_SCHEMA_PROVIDER: ${provider}`);
  process.exit(1);
}

const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
const schema = readFileSync(schemaPath, 'utf8');
const next = schema.replace(
  /datasource db\s*\{[^}]*\}/s,
  `datasource db {\n  provider = "${provider}"\n}`,
);

if (next === schema) {
  console.warn('[sync-prisma-provider] datasource block unchanged — check schema.prisma format');
}

writeFileSync(schemaPath, next, 'utf8');
console.log(`[sync-prisma-provider] provider = ${provider}`);