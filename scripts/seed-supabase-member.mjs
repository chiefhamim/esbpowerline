import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { MEMBER_DEMO_EMAIL, seedPasswordForEmail } from './lib/seed-passwords.mjs';

config({ path: '.env.local' });
config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const password = seedPasswordForEmail(MEMBER_DEMO_EMAIL);

if (!url || !serviceRoleKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}
if (!password) {
  throw new Error('No member demo password configured (MEMBER_DEMO_PASSWORD or dev default).');
}

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const account = {
  email: MEMBER_DEMO_EMAIL,
  name: 'Demo Member',
  role: 'SUBSCRIBER',
};

async function findUserIdByEmail(email) {
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) throw error;
  return data.users.find((user) => user.email === email)?.id ?? null;
}

async function upsertMember() {
  const metadata = { role: account.role, name: account.name, full_name: account.name, status: 'ACTIVE' };
  const { error: createError } = await admin.auth.admin.createUser({
    email: account.email,
    password,
    email_confirm: true,
    user_metadata: metadata,
    app_metadata: { role: account.role },
  });

  if (!createError) {
    console.log(`✓ Created ${account.email} (${account.role})`);
    return;
  }

  if (!createError.message.toLowerCase().includes('already')) {
    throw createError;
  }

  const userId = await findUserIdByEmail(account.email);
  if (!userId) throw new Error(`User exists but could not be found: ${account.email}`);

  const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
    password,
    email_confirm: true,
    user_metadata: metadata,
    app_metadata: { role: account.role },
  });
  if (updateError) throw updateError;

  console.log(`✓ Updated ${account.email} (${account.role})`);
}

await upsertMember();