'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { can } from '@/lib/constants';

async function requireAuth() {
  const session = await auth();
  if (!session?.user || !can(session.user.role, 'media.upload')) throw new Error('Forbidden');
  return session.user;
}

export async function getMedia() {
  return prisma.media.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createMedia(data: {
  name: string;
  url: string;
  type: string;
  mimeType?: string;
  size?: number;
  altText?: string;
}) {
  const user = await requireAuth();
  const media = await prisma.media.create({
    data: { ...data, uploadedById: user.id },
  });
  revalidatePath('/cms/media');
  revalidatePath('/admin/media');
  return media;
}

export async function deleteMedia(id: string) {
  const user = await requireAuth();
  if (!can(user.role, 'media.delete_any')) throw new Error('Forbidden');
  await prisma.media.delete({ where: { id } });
  revalidatePath('/cms/media');
  revalidatePath('/admin/media');
}