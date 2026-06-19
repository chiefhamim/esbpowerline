/**
 * Production migrate deploy — uses DIRECT_URL (:5432).
 * Auto-baselines when the DB already has tables (Prisma P3005).
 */
import { spawnSync } from 'child_process';
import { readdirSync } from 'fs';
import path from 'path';

const direct = process.env.DIRECT_URL?.trim();
const migrationsDir =
  process.env.PRISMA_MIGRATIONS_DIR?.trim() || 'prisma/migrations_postgresql';

if (process.env.PRISMA_SCHEMA_PROVIDER === 'postgresql') {
  if (!direct) {
    console.error(
      '❌ DIRECT_URL is required for production migrations (Supabase port 5432).',
    );
    process.exit(1);
  }
  if (direct.includes(':6543')) {
    console.error('❌ DIRECT_URL must use port 5432, not 6543 (pooler).');
    process.exit(1);
  }
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
      DATABASE_URL: direct || process.env.DATABASE_URL,
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

console.log('[migrate-deploy-prod] using DIRECT_URL for migrate deploy (not pooler)');

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