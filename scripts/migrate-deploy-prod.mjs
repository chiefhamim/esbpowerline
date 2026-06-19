/**
 * Run prisma migrate deploy against Supabase direct connection (:5432).
 * Prisma 7 reads DATABASE_URL from prisma.config.ts — override it for migrations only.
 */
import { spawnSync } from 'child_process';

const direct = process.env.DIRECT_URL?.trim();

if (process.env.PRISMA_SCHEMA_PROVIDER === 'postgresql') {
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

console.log('[migrate-deploy-prod] using DIRECT_URL for migrate deploy (not pooler)');

const result = spawnSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['prisma', 'migrate', 'deploy'],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      // prisma.config.ts datasource.url — use direct connection for DDL
      DATABASE_URL: direct || process.env.DATABASE_URL,
    },
    shell: process.platform === 'win32',
  },
);

process.exit(result.status ?? 1);