import 'server-only';

import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { DEMO_PASSWORD } from '@/lib/demo-auth';

const DEMO_MEMBER_EMAIL = 'member@esbpowerline.com';
const DEMO_STAFF = [
  { email: 'admin@esbpowerline.com', name: 'System Admin', role: 'SUPER_ADMIN' as const },
  { email: 'editor@esbpowerline.com', name: 'Nadia Karim', role: 'EDITOR' as const },
] as const;

function demoPassword() {
  return process.env.SEED_DEMO_PASSWORD?.trim() || DEMO_PASSWORD;
}

/** Upsert Prisma demo member — safe to call before member sign-in in development. */
export async function ensureDemoMemberAccount() {
  if (process.env.NODE_ENV === 'production') return;

  const passwordHash = await bcrypt.hash(demoPassword(), 10);

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
}

/** Upsert Prisma demo staff rows used after Supabase staff sign-in. */
export async function ensureDemoStaffAccounts() {
  if (process.env.NODE_ENV === 'production') return;

  const passwordHash = await bcrypt.hash(demoPassword(), 10);

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
  }
}