'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { can, type Role } from '@/lib/constants';
import type { EditorialNoticeType } from '@prisma/client';

async function requireAuthUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');
  return session.user;
}

export async function getMyNotices() {
  const user = await requireAuthUser();
  return prisma.editorialNotice.findMany({
    where: { recipientId: user.id },
    include: {
      sender: { select: { id: true, name: true, email: true } },
      article: { select: { id: true, title: true, slug: true, status: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}

export async function getMyPendingNoticeCount() {
  const user = await requireAuthUser();
  return prisma.editorialNotice.count({
    where: { recipientId: user.id, status: 'PENDING' },
  });
}

export async function acknowledgeNotice(id: string) {
  const user = await requireAuthUser();
  const notice = await prisma.editorialNotice.findUnique({ where: { id } });
  if (!notice || notice.recipientId !== user.id) throw new Error('Notice not found');

  await prisma.editorialNotice.update({
    where: { id },
    data: { status: 'ACKNOWLEDGED' },
  });

  revalidatePath('/cms');
  revalidatePath('/cms/articles');
  return { ok: true };
}

export async function resolveNotice(id: string) {
  const user = await requireAuthUser();
  const notice = await prisma.editorialNotice.findUnique({ where: { id } });
  if (!notice || notice.recipientId !== user.id) throw new Error('Notice not found');

  await prisma.editorialNotice.update({
    where: { id },
    data: { status: 'RESOLVED' },
  });

  revalidatePath('/cms');
  return { ok: true };
}

export async function createEditorialNotice(data: {
  type: EditorialNoticeType;
  message: string;
  recipientId: string;
  articleId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const user = await requireAuthUser();
  const role = user.role as Role;
  if (!can(role, 'article.edit_any')) throw new Error('Forbidden');

  const notice = await prisma.editorialNotice.create({
    data: {
      type: data.type,
      message: data.message.trim(),
      recipientId: data.recipientId,
      senderId: user.id,
      articleId: data.articleId ?? null,
      metadata: (data.metadata ?? undefined) as object | undefined,
    },
  });

  revalidatePath('/cms');
  revalidatePath('/admin/articles');
  return notice;
}

export async function requestArticleRevision(articleIds: string[], note: string) {
  const user = await requireAuthUser();
  if (!can(user.role as Role, 'article.edit_any')) throw new Error('Forbidden');
  if (!note.trim()) throw new Error('A note for the author is required');

  const articles = await prisma.article.findMany({
    where: { id: { in: articleIds } },
    select: { id: true, title: true, authorId: true },
  });
  if (!articles.length) throw new Error('No articles found');

  await prisma.$transaction(
    articles.map((article) =>
      prisma.editorialNotice.create({
        data: {
          type: 'REVISION_REQUEST',
          message: note.trim(),
          recipientId: article.authorId,
          senderId: user.id,
          articleId: article.id,
          metadata: { articleTitle: article.title },
        },
      })
    )
  );

  await prisma.auditLog.create({
    data: {
      type: 'article.revision_request',
      message: `Revision requested on ${articles.length} article(s)`,
      userId: user.id,
    },
  });

  revalidatePath('/cms');
  revalidatePath('/admin/articles');
  return { count: articles.length };
}

export async function notifyAuthorsForArticles(
  articleIds: string[],
  type: EditorialNoticeType,
  message: string,
  metadata?: Record<string, unknown>
) {
  const user = await requireAuthUser();
  const articles = await prisma.article.findMany({
    where: { id: { in: articleIds } },
    select: { id: true, title: true, authorId: true },
  });

  if (!articles.length || !message.trim()) return;

  await prisma.$transaction(
    articles.map((article) =>
      prisma.editorialNotice.create({
        data: {
          type,
          message: message.trim(),
          recipientId: article.authorId,
          senderId: user.id,
          articleId: article.id,
          metadata: { articleTitle: article.title, ...metadata },
        },
      })
    )
  );

  revalidatePath('/cms');
}