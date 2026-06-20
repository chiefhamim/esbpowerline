'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { can } from '@/lib/constants';
import { deleteStoredMedia } from '@/lib/media-storage';

async function requireAuth() {
  const session = await auth();
  if (!session?.user || !can(session.user.role, 'media.upload')) throw new Error('Forbidden');
  return session.user;
}

export async function getMedia() {
  await requireAuth();
  return prisma.media.findMany({ orderBy: { createdAt: 'desc' } });
}

export type MediaLibraryItem = {
  id: string;
  name: string;
  url: string;
  type: string;
  mimeType: string | null;
  size: number | null;
  altText: string | null;
  caption: string | null;
  uploadedById: string | null;
  createdAt: Date;
  usageCount: number;
  usedInTitles: string[];
  usedInArticles: { id: string; title: string; slug: string }[];
  canDelete: boolean;
};

export async function getMediaLibrary(): Promise<MediaLibraryItem[]> {
  const user = await requireAuth();

  const [items, articles] = await Promise.all([
    prisma.media.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.article.findMany({
      where: {
        imageUrl: { not: null },
        status: { not: 'TRASH' },
        editorTrash: false,
      },
      select: { id: true, slug: true, imageUrl: true, title: true },
    }),
  ]);

  const usageMap = new Map<string, { count: number; titles: string[]; articles: { id: string; title: string; slug: string }[] }>();
  for (const article of articles) {
    if (!article.imageUrl) continue;
    const entry = usageMap.get(article.imageUrl) ?? { count: 0, titles: [], articles: [] };
    entry.count += 1;
    entry.titles.push(article.title);
    entry.articles.push({ id: article.id, title: article.title, slug: article.slug });
    usageMap.set(article.imageUrl, entry);
  }

  const canDeleteAny = can(user.role, 'media.delete_any');
  const canDeleteOwn = can(user.role, 'media.delete_own');

  return items.map((m) => {
    const usage = usageMap.get(m.url);
    const usageCount = usage?.count ?? 0;
    const ownsFile = m.uploadedById === user.id;
    const canDelete = usageCount === 0 && (canDeleteAny || (canDeleteOwn && ownsFile));

    return {
      id: m.id,
      name: m.name,
      url: m.url,
      type: m.type,
      mimeType: m.mimeType,
      size: m.size,
      altText: m.altText,
      caption: m.caption,
      uploadedById: m.uploadedById,
      createdAt: m.createdAt,
      usageCount,
      usedInTitles: usage?.titles ?? [],
      usedInArticles: usage?.articles ?? [],
      canDelete,
    };
  });
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

export async function updateMedia(
  id: string,
  data: { name?: string; altText?: string; caption?: string },
) {
  const user = await requireAuth();
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) throw new Error('File not found');

  const canEditAny = can(user.role, 'media.delete_any');
  const canEditOwn = media.uploadedById === user.id && can(user.role, 'media.delete_own');
  if (!canEditAny && !canEditOwn) throw new Error('You can only edit files you uploaded');

  const updated = await prisma.media.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name.trim() || media.name } : {}),
      ...(data.altText !== undefined ? { altText: data.altText.trim() || null } : {}),
      ...(data.caption !== undefined ? { caption: data.caption.trim() || null } : {}),
    },
  });

  revalidatePath('/cms/media');
  revalidatePath('/admin/media');
  return updated;
}

export async function deleteMedia(id: string) {
  const user = await requireAuth();
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) throw new Error('File not found');

  const canDeleteAny = can(user.role, 'media.delete_any');
  const canDeleteOwn = media.uploadedById === user.id && can(user.role, 'media.delete_own');
  if (!canDeleteAny && !canDeleteOwn) throw new Error('You can only delete files you uploaded');

  const usageCount = await prisma.article.count({
    where: {
      imageUrl: media.url,
      status: { not: 'TRASH' },
      editorTrash: false,
    },
  });

  if (usageCount > 0) {
    throw new Error(`In use by ${usageCount} article${usageCount === 1 ? '' : 's'} — remove from stories first`);
  }

  await prisma.media.delete({ where: { id } });
  await deleteStoredMedia(media.url).catch(() => undefined);
  revalidatePath('/cms/media');
  revalidatePath('/admin/media');
}