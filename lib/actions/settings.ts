'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { can } from '@/lib/constants';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || !can(session.user.role, 'settings.view')) throw new Error('Forbidden');
  return session.user;
}

export async function getSettings() {
  const settings = await prisma.siteSetting.findMany();
  const map: Record<string, unknown> = {};
  for (const s of settings) map[s.key] = s.value;
  return map;
}

export async function updateSetting(key: string, value: unknown) {
  const admin = await requireAdmin();
  if (!can(admin.role, 'settings.edit')) throw new Error('Forbidden');

  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value: value as any },
    update: { value: value as any },
  });
  revalidatePath('/admin/settings');
}

export async function getAnalytics() {
  await requireAdmin();

  const [articleCount, userCount, totalViews, publishedCount, recentLogs, topArticles] = await Promise.all([
    prisma.article.count(),
    prisma.user.count(),
    prisma.article.aggregate({ _sum: { views: true } }),
    prisma.article.count({ where: { status: 'PUBLISHED' } }),
    prisma.auditLog.findMany({ orderBy: { timestamp: 'desc' }, take: 10 }),
    prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { views: 'desc' },
      take: 10,
      select: { id: true, title: true, slug: true, views: true, category: true },
    }),
  ]);

  const usersByRole = await prisma.user.groupBy({ by: ['role'], _count: true });

  return {
    articleCount,
    userCount,
    totalViews: totalViews._sum.views ?? 0,
    publishedCount,
    recentLogs,
    topArticles,
    usersByRole,
  };
}