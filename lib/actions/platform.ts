'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { can } from '@/lib/constants';

import { PUBLIC_REVALIDATE_PATHS } from '@/lib/public-paths';

export async function revalidatePublicSite() {
  const session = await auth();
  if (!session?.user || !can(session.user.role, 'settings.edit')) {
    throw new Error('Forbidden');
  }

  for (const path of PUBLIC_REVALIDATE_PATHS) {
    revalidatePath(path);
  }

  await prisma.auditLog.create({
    data: {
      type: 'platform.revalidate',
      message: 'Public site cache revalidated by admin',
      userId: session.user.id,
    },
  });

  return { ok: true, paths: PUBLIC_REVALIDATE_PATHS.length };
}

export async function getPlatformSnapshot() {
  const session = await auth();
  if (!session?.user || !can(session.user.role, 'user.view')) {
    throw new Error('Forbidden');
  }

  const [published, featured, pinned, draft, settingsCount, homepageSetting] = await Promise.all([
    prisma.article.count({ where: { status: 'PUBLISHED' } }),
    prisma.article.count({ where: { status: 'PUBLISHED', isFeatured: true } }),
    prisma.article.count({ where: { status: 'PUBLISHED', isPinned: true } }),
    prisma.article.count({ where: { status: 'DRAFT' } }),
    prisma.siteSetting.count(),
    prisma.siteSetting.findUnique({ where: { key: 'homepage' } }),
  ]);

  const homepage = (homepageSetting?.value as { carouselMode?: string }) ?? {};
  const carouselMode = homepage.carouselMode === 'managed' ? 'managed' : 'demo';

  return {
    published,
    featured,
    pinned,
    draft,
    settingsCount,
    carouselMode: carouselMode as 'demo' | 'managed',
  };
}

export async function setCarouselMode(mode: 'demo' | 'managed') {
  const session = await auth();
  if (!session?.user || !can(session.user.role, 'settings.edit')) {
    throw new Error('Forbidden');
  }

  const existing = await prisma.siteSetting.findUnique({ where: { key: 'homepage' } });
  const current = (existing?.value as Record<string, unknown>) ?? {};

  await prisma.siteSetting.upsert({
    where: { key: 'homepage' },
    create: { key: 'homepage', value: { ...current, carouselMode: mode } },
    update: { value: { ...current, carouselMode: mode } },
  });

  revalidatePath('/');
  revalidatePath('/admin/settings');

  return { carouselMode: mode };
}

export async function toggleArticleFlag(
  articleId: string,
  flag: 'isFeatured' | 'isPinned' | 'isBreaking',
  value: boolean
) {
  const session = await auth();
  if (!session?.user || !can(session.user.role, 'article.edit_any')) {
    throw new Error('Forbidden');
  }

  if (flag === 'isPinned' && value) {
    await prisma.article.updateMany({
      where: { isPinned: true },
      data: { isPinned: false },
    });
  }

  await prisma.article.update({
    where: { id: articleId },
    data: { [flag]: value },
  });

  revalidatePath('/admin/articles');
  revalidatePath('/');

  return { ok: true };
}