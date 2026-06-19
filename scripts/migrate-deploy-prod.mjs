/**
 * Production migrate deploy — uses DIRECT_URL (true direct host, not pooler).
 * Auto-baselines when the DB already has tables (Prisma P3005).
 */
import { spawnSync } from 'child_process';
import { readdirSync } from 'fs';
import path from 'path';
import { resolveMigrationDatabaseUrl } from './resolve-migration-database-url.mjs';

const migrationsDir =
  process.env.PRISMA_MIGRATIONS_DIR?.trim() || 'prisma/migrations_postgresql';

let migrationDatabaseUrl;
try {
  const resolved = resolveMigrationDatabaseUrl(
    process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim(),
  );
  migrationDatabaseUrl = resolved.url;
  if (process.env.PRISMA_SCHEMA_PROVIDER === 'postgresql') {
    if (!migrationDatabaseUrl) {
      console.error(
        '❌ DIRECT_URL is required for production migrations (Supabase db.[ref].supabase.co:5432).',
      );
      process.exit(1);
    }
    if (resolved.rewritten) {
      console.warn(
        `[migrate-deploy-prod] DIRECT_URL used session pooler — migrated to direct host ${resolved.host}`,
      );
    } else {
      console.log(
        `[migrate-deploy-prod] using migration URL host ${resolved.host ?? '(unknown)'}`,
      );
    }
  }
} catch (error) {
  console.error(`❌ ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

function migrationNames() {
  const root = path.join(process.cwd(), migrationsDir);
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function runPrisma(args, { inherit = false } = {}) {
  const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  return spawnSync(cmd, ['prisma', ...args], {
    stdio: inherit ? 'inherit' : 'pipe',
    encoding: 'utf8',
    env: {
      ...process.env,
      DATABASE_URL: migrationDatabaseUrl,
      PRISMA_MIGRATIONS_DIR: migrationsDir,
    },
    shell: process.platform === 'win32',
  });
}

function deploy() {
  return runPrisma(['migrate', 'deploy']);
}

function baselineExistingDatabase() {
  const names = migrationNames();
  const initMigration = names.find((n) => n.endsWith('_init') || n === '0001_init') ?? names[0];
  if (!initMigration) {
    console.error('[migrate-deploy-prod] No migrations found to baseline.');
    process.exit(1);
  }

  console.log(
    `[migrate-deploy-prod] P3005 — existing DB; marking "${initMigration}" as applied (delta migrations will still run)…`,
  );

  const resolved = runPrisma(['migrate', 'resolve', '--applied', initMigration], {
    inherit: true,
  });
  if (resolved.status !== 0) {
    process.exit(resolved.status ?? 1);
  }
}

let result = deploy();

if (result.status !== 0) {
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  if (output.includes('P3005')) {
    baselineExistingDatabase();
    result = deploy();
  } else {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
  }
}

if (result.status !== 0) {
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
}

process.exit(result.status ?? 1);