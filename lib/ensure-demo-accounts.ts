import 'server-only';

import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { getDevBootstrapPassword } from '@/lib/dev-login-hints';
import { upsertSupabaseAuthUser } from '@/lib/supabase/sync-auth-user';

const DEMO_MEMBER_EMAIL = 'member@esbpowerline.com';

/** Optional dev-only sample editor — not the master admin. */
const DEMO_EDITOR_EMAIL = 'editor@esbpowerline.com';

function demoPassword() {
  return getDevBootstrapPassword() ?? 'esbpowerline007';
}

async function syncDemoAuthUser(
  email: string,
  name: string,
  role: 'EDITOR' | 'SUBSCRIBER',
  password: string,
): Promise<string | null> {
  try {
    return await upsertSupabaseAuthUser({ email, password, name, role });
  } catch (error) {
    console.warn(`[ensureDemoAccounts] Supabase sync skipped for ${email}:`, error);
    return null;
  }
}

/** Upsert Prisma demo member and mirror to Supabase Auth in development. */
export async function ensureDemoMemberAccount() {
  if (process.env.NODE_ENV === 'production') return;

  const password = demoPassword();
  const passwordHash = await bcrypt.hash(password, 10);

  const member = await prisma.user.upsert({
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

  const supabaseUserId = await syncDemoAuthUser(DEMO_MEMBER_EMAIL, 'Demo Member', 'SUBSCRIBER', password);
  if (supabaseUserId && member.supabaseUserId !== supabaseUserId) {
    await prisma.user.update({
      where: { id: member.id },
      data: { supabaseUserId },
    });
  }
}

/**
 * Optional dev sample editor account. Skips if the email already exists
 * (e.g. created by the master admin via /admin/users/new).
 */
export async function ensureDemoEditorAccount() {
  if (process.env.NODE_ENV === 'production') return;

  const existing = await prisma.user.findUnique({
    where: { email: DEMO_EDITOR_EMAIL },
    select: { id: true },
  });
  if (existing) return;

  const password = demoPassword();
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name: 'Nadia Karim',
      email: DEMO_EDITOR_EMAIL,
      passwordHash,
      role: 'EDITOR',
      status: 'ACTIVE',
    },
  });

  await syncDemoAuthUser(DEMO_EDITOR_EMAIL, 'Nadia Karim', 'EDITOR', password);
}

/** @deprecated Use ensureMasterAdminAccount — kept for scripts that still import this name. */
export async function ensureDemoStaffAccounts() {
  const { ensureMasterAdminAccount } = await import('@/lib/master-admin');
  await ensureMasterAdminAccount();
  await ensureDemoEditorAccount();
}