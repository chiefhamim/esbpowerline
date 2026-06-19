import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const password = process.env.SEED_DEMO_PASSWORD?.trim() || 'esbpowerline007';

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
console.log('Supabase users:', users.users.map((u) => `${u.email} (${u.user_metadata?.role ?? 'no-role'})`).join(', '));

for (const account of accounts) {
  const { data, error } = await client.auth.signInWithPassword({
    email: account.email,
    password,
  });
  if (error) {
    console.log(`${account.label}: FAIL — ${error.message}`);
  } else {
    console.log(`${account.label}: OK — role=${data.user?.user_metadata?.role ?? 'unknown'}`);
    await client.auth.signOut();
  }
}