/**
 * One-shot production bootstrap (run locally with production env in .env.production.local):
 *
 *   1. Copy .env.production.local and replace YOUR_SUPABASE_DB_PASSWORD
 *   2. npm run bootstrap:prod
 *
 * Requires: DATABASE_URL, DIRECT_URL, Supabase keys (see .env.example).
 * WARNING: db:seed wipes existing Prisma rows — use only on empty/staging DBs.
 */
import { config } from 'dotenv';
import { existsSync } from 'fs';
import { spawnSync } from 'child_process';

if (existsSync('.env.production.local')) {
  config({ path: '.env.production.local', override: true });
} else {
  config();
}

const required = ['DATABASE_URL', 'DIRECT_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
const missing = required.filter((key) => !process.env[key]?.trim());
if (missing.length) {
  console.error(`❌ Missing env: ${missing.join(', ')}`);
  process.exit(1);
}

if (process.env.ALLOW_PRODUCTION_SEED !== 'true') {
  console.error('❌ Set ALLOW_PRODUCTION_SEED=true to run production bootstrap.');
  process.exit(1);
}

const password = process.env.SEED_DEMO_PASSWORD?.trim() || process.env.MASTER_ADMIN_PASSWORD?.trim();
if (!password) {
  console.error('❌ Set SEED_DEMO_PASSWORD (and/or MASTER_ADMIN_PASSWORD) for demo/staff accounts.');
  process.exit(1);
}

function run(label, script) {
  console.log(`\n▶ ${label}`);
  const result = spawnSync('npm', ['run', script], {
    stdio: 'inherit',
    env: {
      ...process.env,
      PRISMA_SCHEMA_PROVIDER: 'postgresql',
      ALLOW_PRODUCTION_SEED: 'true',
      SEED_DEMO_PASSWORD: process.env.SEED_DEMO_PASSWORD?.trim() || password,
      MASTER_ADMIN_PASSWORD: process.env.MASTER_ADMIN_PASSWORD?.trim() || password,
    },
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log('🚀 Production bootstrap — migrations, Prisma seed, Supabase auth users');
run('Deploy migrations', 'db:deploy:prod');
run('Seed Prisma content (articles, categories, settings)', 'db:seed');
run('Seed Supabase staff (admin + editor)', 'supabase:seed-staff');
run('Seed Supabase member', 'supabase:seed-member');
console.log('\n✅ Bootstrap complete.');
console.log('   Staff:  admin@esbpowerline.com / hamim2964@gmail.com');
console.log('   Member: member@esbpowerline.com');
console.log(`   Password: (your SEED_DEMO_PASSWORD)`);