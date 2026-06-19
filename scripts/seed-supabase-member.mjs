import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const password = process.env.SEED_DEMO_PASSWORD?.trim() || 'esbpowerline007';

if (!url || !serviceRoleKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const account = {
  email: 'member@esbpowerline.com',
  name: 'Demo Member',
  role: 'SUBSCRIBER',
};

async function findUserIdByEmail(email) {
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) throw error;
  return data.users.find((user) => user.email === email)?.id ?? null;
}

async function upsertMember() {
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

  const userId = await findUserIdByEmail(account.email);
  if (!userId) throw new Error(`User exists but could not be found: ${account.email}`);

  const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
    password,
    email_confirm: true,
    user_metadata: metadata,
  });
  if (updateError) throw updateError;

  console.log(`✓ Updated ${account.email} (${account.role})`);
}

await upsertMember();