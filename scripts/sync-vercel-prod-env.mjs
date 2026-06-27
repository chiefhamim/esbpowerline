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
  NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,
  CPANEL_FTP_HOST: process.env.CPANEL_FTP_HOST,
  CPANEL_FTP_USER: process.env.CPANEL_FTP_USER,
  CPANEL_FTP_PASSWORD: process.env.CPANEL_FTP_PASSWORD,
  CPANEL_FTP_PORT: process.env.CPANEL_FTP_PORT,
  CPANEL_FTP_SECURE: process.env.CPANEL_FTP_SECURE,
  CPANEL_FTP_PATH: process.env.CPANEL_FTP_PATH,
};

const requiredVars = [
  'NEXT_PUBLIC_CDN_URL',
  'CPANEL_FTP_HOST',
  'CPANEL_FTP_USER',
  'CPANEL_FTP_PASSWORD',
];
const missing = requiredVars
  .filter((key) => !vars[key]?.trim());
if (missing.length) {
  console.warn(`⚠️ Warning: Missing some cPanel vars: ${missing.join(', ')}`);
}

const vercelBin = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const targets = ['production', 'preview'];

for (const target of targets) {
  const varsToSync = Object.entries(vars).filter(([_, val]) => val !== undefined && val !== null && val.trim() !== '');
  console.log(`\n▶ Syncing ${varsToSync.length} vars → ${target}`);
  for (const [name, value] of varsToSync) {
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