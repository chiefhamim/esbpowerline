import 'server-only';

import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { DEMO_PASSWORD } from '@/lib/demo-auth';
import { upsertSupabaseAuthUser } from '@/lib/supabase/sync-auth-user';

const DEMO_MEMBER_EMAIL = 'member@esbpowerline.com';
const DEMO_STAFF = [
  { email: 'admin@esbpowerline.com', name: 'System Admin', role: 'SUPER_ADMIN' as const },
  { email: 'editor@esbpowerline.com', name: 'Nadia Karim', role: 'EDITOR' as const },
] as const;

function demoPassword() {
  return process.env.SEED_DEMO_PASSWORD?.trim() || DEMO_PASSWORD;
}

async function syncDemoAuthUser(
  email: string,
  name: string,
  role: 'SUPER_ADMIN' | 'EDITOR' | 'SUBSCRIBER',
  password: string,
) {
  try {
    await upsertSupabaseAuthUser({ email, password, name, role });
  } catch (error) {
    console.warn(`[ensureDemoAccounts] Supabase sync skipped for ${email}:`, error);
  }
}

/** Upsert Prisma demo member and mirror to Supabase Auth in development. */
export async function ensureDemoMemberAccount() {
  if (process.env.NODE_ENV === 'production') return;

  const password = demoPassword();
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email: DEMO_MEMBER_EMAIL },
    create: {
      name: 'Demo Member',
      email: DEMO_MEMBER_EMAIL,
      phone: '+8801712345678',
      passwordHash,
      role: 'SUBSCRIBER',
      status: 'ACTIVE',
      bio: 'Energy sector professional — member account',
    },
    update: {
      passwordHash,
      role: 'SUBSCRIBER',
      status: 'ACTIVE',
    },
  });

  await syncDemoAuthUser(DEMO_MEMBER_EMAIL, 'Demo Member', 'SUBSCRIBER', password);
}

/** Upsert Prisma demo staff rows and mirror to Supabase Auth in development. */
export async function ensureDemoStaffAccounts() {
  if (process.env.NODE_ENV === 'production') return;

  const password = demoPassword();
  const passwordHash = await bcrypt.hash(password, 10);

  for (const account of DEMO_STAFF) {
    await prisma.user.upsert({
      where: { email: account.email },
      create: {
        name: account.name,
        email: account.email,
        passwordHash,
        role: account.role,
        status: 'ACTIVE',
      },
      update: {
        passwordHash,
        role: account.role,
        status: 'ACTIVE',
      },
    });

    await syncDemoAuthUser(account.email, account.name, account.role, password);
  }
}