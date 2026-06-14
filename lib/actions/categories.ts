'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { can } from '@/lib/constants';
import { slugify } from '@/lib/utils';

async function requireEditor() {
  const session = await auth();
  if (!session?.user || !can(session.user.role, 'category.manage')) throw new Error('Forbidden');
  return session.user;
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { order: 'asc' } });
}

export async function createCategory(data: { name: string; description?: string; color?: string }) {
  await requireEditor();
  const slug = slugify(data.name);
  const cat = await prisma.category.create({
    data: { name: data.name, slug, description: data.description, color: data.color },
  });
  revalidatePath('/admin/categories');
  return cat;
}

export async function updateCategory(id: string, data: { name?: string; description?: string; color?: string; order?: number }) {
  await requireEditor();
  const cat = await prisma.category.update({ where: { id }, data });
  revalidatePath('/admin/categories');
  return cat;
}

export async function deleteCategory(id: string) {
  await requireEditor();
  await prisma.category.delete({ where: { id } });
  revalidatePath('/admin/categories');
}