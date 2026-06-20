import 'server-only';

import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { seedPasswordForEmail } from '@/lib/seed-credentials';
import { MASTER_ADMIN_EMAIL, MASTER_ADMIN_NAME } from '@/lib/staff-accounts';
import { upsertSupabaseAuthUser } from '@/lib/supabase/sync-auth-user';

export { MASTER_ADMIN_EMAIL, MASTER_ADMIN_NAME };

/**
 * Ensures the master admin exists on first run only.
 * Never resets password or role for an existing account.
 */
export async function ensureMasterAdminAccount(): Promise<void> {
  const existing = await prisma.user.findUnique({
    where: { email: MASTER_ADMIN_EMAIL },
    select: { id: true },
  });
  if (existing) return;

  const password = seedPasswordForEmail(MASTER_ADMIN_EMAIL);
  if (!password) return;

  const passwordHash = await bcrypt.hash(password, 10);

  let supabaseUserId: string | null = null;
  try {
    supabaseUserId = await upsertSupabaseAuthUser({
      email: MASTER_ADMIN_EMAIL,
      password,
      name: MASTER_ADMIN_NAME,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    });
  } catch (error) {
    throw error;
  }

  await prisma.user.create({
    data: {
      name: MASTER_ADMIN_NAME,
      email: MASTER_ADMIN_EMAIL,
      passwordHash,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      supabaseUserId: supabaseUserId ?? undefined,
    },
  });
}