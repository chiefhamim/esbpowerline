import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { seedPasswordForEmail } from './lib/seed-passwords.mjs';

config({ path: '.env.local' });
config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

const accounts = [
  { label: 'admin', email: 'admin@esbpowerline.com' },
  { label: 'editor', email: 'hamim2964@gmail.com' },
  { label: 'member', email: 'member@esbpowerline.com' },
];

const client = createClient(url, anonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: users } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
console.log('Supabase users:', users.users.map((u) => `${u.email} (${u.app_metadata?.role ?? 'no-role'})`).join(', '));

for (const account of accounts) {
  const password = seedPasswordForEmail(account.email);
  if (!password) {
    console.log(`${account.label}: SKIP — no password configured`);
    continue;
  }
  const { data, error } = await client.auth.signInWithPassword({
    email: account.email,
    password,
  });
  if (error) {
    console.log(`${account.label}: FAIL — ${error.message}`);
  } else {
    console.log(`${account.label}: OK — role=${data.user?.app_metadata?.role ?? 'unknown'}`);
    await client.auth.signOut();
  }
}