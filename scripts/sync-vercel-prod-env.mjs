/**
 * Push Supabase + Prisma production env from .env.local → Vercel production & preview.
 * Never prints secret values.
 */
import { config } from 'dotenv';
import { spawnSync } from 'child_process';

config({ path: '.env.local' });
config({ path: '.env' });

function toPostgresqlUrl(raw) {
  const value = raw?.trim();
  if (!value) return '';
  return value.replace(/^postgres:\/\//, 'postgresql://');
}

const vars = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_URL: process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET,
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
  POSTGRES_URL: process.env.POSTGRES_URL,
  POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
  POSTGRES_HOST: 'db.sxgokpmrbgdndstygapc.supabase.co',
  POSTGRES_DATABASE: 'postgres',
  POSTGRES_USER: 'postgres.sxgokpmrbgdndstygapc',
  DATABASE_URL: toPostgresqlUrl(process.env.POSTGRES_PRISMA_URL),
  DIRECT_URL: toPostgresqlUrl(process.env.POSTGRES_URL_NON_POOLING),
  PRISMA_SCHEMA_PROVIDER: 'postgresql',
  AUTH_SECRET: process.env.AUTH_SECRET,
};

const missing = Object.entries(vars)
  .filter(([, value]) => !value?.trim())
  .map(([key]) => key);
if (missing.length) {
  console.error(`❌ Missing values in .env.local/.env: ${missing.join(', ')}`);
  process.exit(1);
}

const vercelBin = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const targets = ['production', 'preview'];

for (const target of targets) {
  console.log(`\n▶ Syncing ${Object.keys(vars).length} vars → ${target}`);
  for (const [name, value] of Object.entries(vars)) {
    const result = spawnSync(
      vercelBin,
      ['vercel', 'env', 'add', name, target, '--yes', '--force'],
      {
        input: value,
        stdio: ['pipe', 'pipe', 'pipe'],
        encoding: 'utf8',
        shell: process.platform === 'win32',
      },
    );
    if (result.status !== 0) {
      const err = `${result.stderr ?? ''}${result.stdout ?? ''}`.trim();
      console.error(`❌ ${name} (${target}): ${err || 'failed'}`);
      process.exit(result.status ?? 1);
    }
    process.stdout.write('.');
  }
  console.log(' done');
}

console.log('\n✓ Vercel production + preview env synced.');