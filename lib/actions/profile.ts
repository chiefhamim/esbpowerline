'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import type { Role } from '@/lib/constants';
import {
  upsertSupabaseAuthUser,
  syncSupabaseAuthUserMetadata,
  syncSupabaseAuthUserStatus,
} from '@/lib/supabase/sync-auth-user';

async function requireSessionUser() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  return session.user;
}

export async function changeStaffPassword(input: {
  currentPassword: string;
  newPassword: string;
}) {
  const sessionUser = await requireSessionUser();
  const current = input.currentPassword?.trim();
  const next = input.newPassword?.trim();

  if (!current) throw new Error('Current password is required');
  if (!next || next.length < 8) throw new Error('New password must be at least 8 characters');
  if (current === next) throw new Error('New password must be different from the current password');

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { id: true, email: true, name: true, role: true, passwordHash: true, status: true },
  });
  if (!user) throw new Error('User not found');
  if (user.status === 'SUSPENDED') throw new Error('Account suspended');

  const valid = await bcrypt.compare(current, user.passwordHash);
  if (!valid) throw new Error('Current password is incorrect');

  const passwordHash = await bcrypt.hash(next, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  await upsertSupabaseAuthUser({
    email: user.email,
    password: next,
    name: user.name,
    role: user.role as Role,
    status: user.status,
  });

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function updateProfile(data: {
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
}) {
  const sessionUser = await requireSessionUser();

  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  if (!user) throw new Error('User not found');
  if (user.status === 'SUSPENDED') throw new Error('Account suspended');

  const updateData: Record<string, unknown> = {};
  let requiresNameApproval = false;

  if (data.name && data.name !== user.name) {
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
      updateData.name = data.name;
    } else {
      updateData.pendingName = data.name;
      requiresNameApproval = true;
    }
  }

  if (data.email && data.email !== user.email) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new Error('Email already in use');
    updateData.email = data.email;
  }

  if (data.password) {
    if (data.password.trim().length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
    updateData.passwordHash = await bcrypt.hash(data.password, 10);
  }

  if (data.avatar !== undefined) {
    updateData.avatar = data.avatar;
  }

  if (Object.keys(updateData).length > 0) {
    await prisma.user.update({
      where: { id: sessionUser.id },
      data: updateData,
    });
  }

  const nextEmail = (data.email ?? user.email).toLowerCase();
  const nextName = (updateData.name as string | undefined) ?? user.name;

  if (data.password) {
    await upsertSupabaseAuthUser({
      email: nextEmail,
      password: data.password,
      name: nextName,
      role: user.role as Role,
      status: user.status,
    });
  } else if (data.name || data.email) {
    await syncSupabaseAuthUserMetadata({
      email: user.email,
      name: nextName,
      role: user.role as Role,
      status: user.status,
    });
  }

  if (requiresNameApproval) {
    const admins = await prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
      select: { id: true },
    });

    await prisma.$transaction(
      admins.map((admin) =>
        prisma.editorialNotice.create({
          data: {
            type: 'ADMIN_NOTE',
            message: `${user.name} requested a name change to "${data.name}". Please review in the Users panel.`,
            recipientId: admin.id,
            senderId: user.id,
            metadata: { type: 'NAME_CHANGE_REQUEST', pendingName: data.name },
          },
        }),
      ),
    );
  }

  revalidatePath('/', 'layout');
  return { success: true, requiresNameApproval };
}