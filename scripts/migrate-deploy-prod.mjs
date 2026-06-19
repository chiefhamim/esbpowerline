/**
 * Run prisma migrate deploy for production Postgres.
 * Requires DIRECT_URL (Supabase direct :5432) — never use the pooler for DDL.
 */
import { spawnSync } from 'child_process';

if (process.env.PRISMA_SCHEMA_PROVIDER === 'postgresql') {
  const direct = process.env.DIRECT_URL?.trim();
  if (!direct) {
    console.error(
      '❌ DIRECT_URL is required for production migrations.\n' +
        '   Set Supabase direct connection (port 5432) in Vercel env vars.\n' +
        '   DATABASE_URL should remain the pooler (:6543) for runtime.',
    );
    process.exit(1);
  }
  if (direct.includes(':6543')) {
    console.error('❌ DIRECT_URL must use port 5432 (direct), not 6543 (pooler).');
    process.exit(1);
  }
}

const result = spawnSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['prisma', 'migrate', 'deploy'],
  { stdio: 'inherit', env: process.env, shell: process.platform === 'win32' },
);

process.exit(result.status ?? 1);