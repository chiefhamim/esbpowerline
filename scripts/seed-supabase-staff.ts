import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import {
  EDITOR_EMAIL,
  EDITOR_NAME,
  MASTER_ADMIN_EMAIL,
  MASTER_ADMIN_NAME,
} from '../lib/staff-accounts';
import { seedPasswordForEmail } from '../lib/seed-credentials';
import { upsertAuthUserWithClient } from '../lib/supabase/auth-user-sync';

config({ path: '.env.local' });
config();

type StaffSeedAccount = {
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'EDITOR';
};

const STAFF_ACCOUNTS: StaffSeedAccount[] = [
  { email: MASTER_ADMIN_EMAIL, name: MASTER_ADMIN_NAME, role: 'SUPER_ADMIN' },
  { email: EDITOR_EMAIL, name: EDITOR_NAME, role: 'EDITOR' },
];

async function main() {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PRODUCTION_SEED !== 'true') {
    console.error('❌ Refusing to seed Supabase staff: set ALLOW_PRODUCTION_SEED=true to override in production.');
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  }

  const admin = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log('🌱 Seeding Supabase staff accounts...');
  for (const account of STAFF_ACCOUNTS) {
    const password = seedPasswordForEmail(account.email);
    if (!password) {
      console.warn(`  Skipped ${account.email}: no password configured for this environment.`);
      continue;
    }
    await upsertAuthUserWithClient(admin, {
      email: account.email,
      password,
      name: account.name,
      role: account.role,
    });
    console.log(`✓ Synced ${account.email} (${account.role})`);
  }
  console.log('Done.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});