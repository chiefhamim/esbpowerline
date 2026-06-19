import { config } from 'dotenv';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config();

type StaffSeedAccount = {
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'EDITOR';
};

const STAFF_ACCOUNTS: StaffSeedAccount[] = [
  { email: 'admin@esbpowerline.com', name: 'System Admin', role: 'SUPER_ADMIN' },
  { email: 'editor@esbpowerline.com', name: 'Mehedi Hasan Hamim', role: 'EDITOR' },
];

async function findUserIdByEmail(admin: SupabaseClient, email: string): Promise<string | null> {
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) throw error;
  return data.users.find((user) => user.email === email)?.id ?? null;
}

async function upsertStaffUser(admin: SupabaseClient, account: StaffSeedAccount, password: string) {
  const metadata = { role: account.role, name: account.name, full_name: account.name };
  const { error: createError } = await admin.auth.admin.createUser({
    email: account.email,
    password,
    email_confirm: true,
    user_metadata: metadata,
  });

  if (!createError) {
    console.log(`✓ Created ${account.email} (${account.role})`);
    return;
  }

  if (!createError.message.toLowerCase().includes('already')) {
    throw createError;
  }

  const userId = await findUserIdByEmail(admin, account.email);
  if (!userId) {
    throw new Error(`User exists but could not be found: ${account.email}`);
  }

  const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
    password,
    email_confirm: true,
    user_metadata: metadata,
  });

  if (updateError) throw updateError;
  console.log(`✓ Updated ${account.email} (${account.role})`);
}

async function main() {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PRODUCTION_SEED !== 'true') {
    console.error('❌ Refusing to seed Supabase staff: set ALLOW_PRODUCTION_SEED=true to override in production.');
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const password = process.env.SEED_DEMO_PASSWORD?.trim() || 'esbpowerline007';

  if (!url || !serviceRoleKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  }

  const admin = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log('🌱 Seeding Supabase staff demo accounts...');
  for (const account of STAFF_ACCOUNTS) {
    await upsertStaffUser(admin, account, password);
  }
  console.log('Done.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});