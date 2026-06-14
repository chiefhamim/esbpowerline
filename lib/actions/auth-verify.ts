'use server';

import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { can, type Role } from '@/lib/constants';

export async function verifyAdminPassword(password: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const role = session.user.role as Role;
  if (!can(role, 'category.manage') && !can(role, 'article.delete_any')) {
    throw new Error('Forbidden');
  }

  if (!password?.trim()) throw new Error('Password is required');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { passwordHash: true },
  });
  if (!user) throw new Error('User not found');

  const valid = await bcrypt.compare(password.trim(), user.passwordHash);
  if (!valid) throw new Error('Incorrect password');

  return true;
}