/**
 * Production migrate deploy — uses DIRECT_URL (Supabase session pooler :5432 on Vercel).
 * Auto-baselines when the DB already has tables (Prisma P3005).
 */
import { spawnSync } from 'child_process';
import { readdirSync } from 'fs';
import path from 'path';
import { setTimeout as sleep } from 'timers/promises';
import { resolveMigrationDatabaseUrl } from './resolve-migration-database-url.mjs';

const migrationsDir =
  process.env.PRISMA_MIGRATIONS_DIR?.trim() || 'prisma/migrations_postgresql';

const RETRY_MARKERS = ['EMAXCONNSESSION', 'too many clients', 'P1001', 'P1002', 'P1017'];
const MAX_ATTEMPTS = 5;
const BACKOFF_MS = [3000, 5000, 8000, 12000, 15000];

let migrationDatabaseUrl;
try {
  const resolved = resolveMigrationDatabaseUrl(
    process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim(),
  );
  migrationDatabaseUrl = resolved.url;
  if (process.env.PRISMA_SCHEMA_PROVIDER === 'postgresql') {
    if (!migrationDatabaseUrl) {
      console.error(
        '❌ DIRECT_URL is required for production migrations (Supabase session pooler :5432).',
      );
      process.exit(1);
    }
    console.log(
      `[migrate-deploy-prod] using ${resolved.mode} host ${resolved.host ?? '(unknown)'}${resolved.rewritten ? ' (normalized)' : ''}`,
    );
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

function deployOutput(result) {
  return `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
}

function isRetryable(output) {
  return RETRY_MARKERS.some((marker) => output.includes(marker));
}

async function deployWithRetry() {
  let result = deploy();

  for (let attempt = 1; attempt < MAX_ATTEMPTS && result.status !== 0; attempt++) {
    const output = deployOutput(result);
    if (output.includes('P3005') || !isRetryable(output)) {
      break;
    }
    const waitMs = BACKOFF_MS[attempt - 1] ?? 15000;
    console.warn(
      `[migrate-deploy-prod] transient DB error (attempt ${attempt}/${MAX_ATTEMPTS - 1}) — retrying in ${waitMs}ms…`,
    );
    await sleep(waitMs);
    result = deploy();
  }

  return result;
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

let result = await deployWithRetry();

if (result.status !== 0) {
  const output = deployOutput(result);
  if (output.includes('P3005')) {
    baselineExistingDatabase();
    result = await deployWithRetry();
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