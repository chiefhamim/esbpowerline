'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { can } from '@/lib/constants';

export type CommentModerationStatus = 'PENDING' | 'APPROVED' | 'SPAM' | 'TRASH' | 'ALL';

export type ModerationComment = {
  id: string;
  content: string;
  status: string;
  authorName: string;
  authorEmail: string | null;
  userId: string | null;
  createdAt: Date;
  articleId: string;
  articleTitle: string;
  articleSlug: string;
};

async function requireModerator() {
  const session = await auth();
  if (!session?.user?.id || !can(session.user.role, 'comment.moderate_any')) {
    throw new Error('Forbidden');
  }
  return session.user;
}

async function attachArticles(comments: {
  id: string;
  content: string;
  status: string;
  authorName: string;
  authorEmail: string | null;
  userId: string | null;
  createdAt: Date;
  articleId: string;
}[]): Promise<ModerationComment[]> {
  if (comments.length === 0) return [];

  const articleIds = [...new Set(comments.map((c) => c.articleId))];
  const articles = await prisma.article.findMany({
    where: { id: { in: articleIds } },
    select: { id: true, title: true, slug: true },
  });
  const articleMap = Object.fromEntries(articles.map((a) => [a.id, a]));

  return comments.map((c) => ({
    ...c,
    articleTitle: articleMap[c.articleId]?.title ?? 'Unknown article',
    articleSlug: articleMap[c.articleId]?.slug ?? '',
  }));
}

export async function getCommentsForModeration(
  status: CommentModerationStatus = 'PENDING',
): Promise<ModerationComment[]> {
  await requireModerator();

  const comments = await prisma.comment.findMany({
    where: status === 'ALL' ? {} : { status },
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: {
      id: true,
      content: true,
      status: true,
      authorName: true,
      authorEmail: true,
      userId: true,
      createdAt: true,
      articleId: true,
    },
  });

  return attachArticles(comments);
}

export async function getCommentModerationCounts() {
  await requireModerator();
  const [pending, approved, spam, trash] = await Promise.all([
    prisma.comment.count({ where: { status: 'PENDING' } }),
    prisma.comment.count({ where: { status: 'APPROVED' } }),
    prisma.comment.count({ where: { status: 'SPAM' } }),
    prisma.comment.count({ where: { status: 'TRASH' } }),
  ]);
  return { pending, approved, spam, trash, total: pending + approved + spam + trash };
}

export async function updateCommentStatus(
  id: string,
  status: 'APPROVED' | 'SPAM' | 'TRASH' | 'PENDING',
) {
  const admin = await requireModerator();

  const comment = await prisma.comment.update({
    where: { id },
    data: { status },
  });

  const article = await prisma.article.findFirst({
    where: { id: comment.articleId },
    select: { slug: true },
  });

  if (article?.slug) {
    revalidatePath(`/articles/${article.slug}`);
  }
  revalidatePath('/members/comments');
  revalidatePath('/admin/comments');

  await prisma.auditLog.create({
    data: {
      type: 'comment.moderate',
      message: `Comment marked ${status.toLowerCase()} — ${comment.authorName}`,
      userId: admin.id,
    },
  });

  return { ok: true };
}