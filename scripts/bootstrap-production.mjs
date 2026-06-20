/**
 * One-shot production bootstrap (run locally with production env in .env.production.local):
 *
 *   1. Copy .env.production.local and set MASTER_ADMIN_PASSWORD
 *   2. ALLOW_PRODUCTION_SEED=true npm run bootstrap:prod
 *
 * Uses db:seed:prod (idempotent, no demo wipe) — NOT full db:seed.
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

if (!process.env.MASTER_ADMIN_PASSWORD?.trim()) {
  console.error('❌ Set MASTER_ADMIN_PASSWORD for production bootstrap.');
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
    },
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log('🚀 Production bootstrap — migrations, idempotent seed, Supabase staff');
run('Deploy migrations', 'db:deploy:prod');
run('Seed production baseline (categories, settings, master admin)', 'db:seed:prod');
run('Seed Supabase staff (admin + editor)', 'supabase:seed-staff');
console.log('\n✅ Bootstrap complete.');
console.log('   Staff: admin@esbpowerline.com / hamim2964@gmail.com');
console.log('   Passwords: from MASTER_ADMIN_PASSWORD / EDITOR_PASSWORD env vars');