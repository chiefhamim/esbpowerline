'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { can } from '@/lib/constants';
import { userSchema, type UserInput } from '@/lib/validations/user';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || !can(session.user.role, 'user.view')) throw new Error('Forbidden');
  return session.user;
}

export async function getUsers() {
  await requireAdmin();
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, name: true, email: true, role: true, status: true,
      articlesCount: true, totalViews: true, lastLoginAt: true, createdAt: true,
    },
  });
}

export async function getUser(id: string) {
  await requireAdmin();
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, email: true, role: true, status: true,
      bio: true, avatar: true, articlesCount: true, totalViews: true,
      lastLoginAt: true, createdAt: true,
    },
  });
}

export async function createUser(data: UserInput) {
  const admin = await requireAdmin();
  if (!can(admin.role, 'user.create')) throw new Error('Forbidden');

  const parsed = userSchema.parse(data);
  const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
  if (existing) throw new Error('Email already exists');

  const passwordHash = await bcrypt.hash(parsed.password || 'changeme123', 10);
  const user = await prisma.user.create({
    data: {
      name: parsed.name,
      email: parsed.email,
      passwordHash,
      role: parsed.role,
      status: parsed.status,
      bio: parsed.bio,
    },
  });

  await prisma.auditLog.create({
    data: { type: 'user.create', message: `Created user: ${user.email}`, userId: admin.id },
  });

  revalidatePath('/admin/users');
  return user;
}

export async function updateUser(id: string, data: Partial<UserInput>) {
  const admin = await requireAdmin();
  if (!can(admin.role, 'user.edit')) throw new Error('Forbidden');

  const parsed = userSchema.partial().parse(data);
  const updateData: Record<string, unknown> = { ...parsed };
  delete updateData.password;

  if (parsed.password) {
    updateData.passwordHash = await bcrypt.hash(parsed.password, 10);
  }

  if (parsed.role && !can(admin.role, 'user.change_role')) {
    throw new Error('Cannot change role');
  }

  const user = await prisma.user.update({ where: { id }, data: updateData as any });
  revalidatePath('/admin/users');
  return user;
}

export async function deleteUser(id: string) {
  const admin = await requireAdmin();
  if (!can(admin.role, 'user.delete')) throw new Error('Forbidden');
  if (admin.id === id) throw new Error('Cannot delete yourself');

  await prisma.user.update({ where: { id }, data: { status: 'SUSPENDED' } });
  revalidatePath('/admin/users');
}