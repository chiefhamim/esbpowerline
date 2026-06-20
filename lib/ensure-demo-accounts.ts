import 'server-only';

import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { MEMBER_DEMO_EMAIL, seedPasswordForEmail } from '@/lib/seed-credentials';
import { EDITOR_EMAIL, EDITOR_NAME } from '@/lib/staff-accounts';
import { upsertSupabaseAuthUser } from '@/lib/supabase/sync-auth-user';

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

  const password = seedPasswordForEmail(MEMBER_DEMO_EMAIL);
  if (!password) return;

  const passwordHash = await bcrypt.hash(password, 10);

  const member = await prisma.user.upsert({
    where: { email: MEMBER_DEMO_EMAIL },
    create: {
      name: 'Demo Member',
      email: MEMBER_DEMO_EMAIL,
      phone: '+8801712345678',
      passwordHash,
      role: 'SUBSCRIBER',
      status: 'ACTIVE',
      bio: 'Energy sector professional — member account',
    },
    update: {
      role: 'SUBSCRIBER',
      status: 'ACTIVE',
    },
  });

  const supabaseUserId = await syncDemoAuthUser(MEMBER_DEMO_EMAIL, 'Demo Member', 'SUBSCRIBER', password);
  if (supabaseUserId && member.supabaseUserId !== supabaseUserId) {
    await prisma.user.update({
      where: { id: member.id },
      data: { supabaseUserId },
    });
  }
}

/**
 * Dev-only: ensure the sole editor account exists (Mehedi Hasan Hamim).
 * Skips if the account already exists.
 */
export async function ensureDemoEditorAccount() {
  if (process.env.NODE_ENV === 'production') return;

  const existing = await prisma.user.findUnique({
    where: { email: EDITOR_EMAIL },
    select: { id: true },
  });
  if (existing) return;

  const password = seedPasswordForEmail(EDITOR_EMAIL);
  if (!password) return;

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name: EDITOR_NAME,
      email: EDITOR_EMAIL,
      passwordHash,
      role: 'EDITOR',
      status: 'ACTIVE',
      bio: 'Senior Energy Correspondent — ESB PowerLine',
    },
  });

  await syncDemoAuthUser(EDITOR_EMAIL, EDITOR_NAME, 'EDITOR', password);
}

/** @deprecated Use ensureMasterAdminAccount — kept for scripts that still import this name. */
export async function ensureDemoStaffAccounts() {
  const { ensureMasterAdminAccount } = await import('@/lib/master-admin');
  await ensureMasterAdminAccount();
  await ensureDemoEditorAccount();
}