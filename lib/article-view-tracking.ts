import 'server-only';

import { createHash, randomUUID } from 'crypto';
import prisma from '@/lib/prisma';

export const VISITOR_COOKIE = 'esb_vid';
export const VIEW_DEDUP_HOURS = 24;

function hashVisitorToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function resolveVisitorKey(cookieValue: string | undefined): string {
  const token = cookieValue?.trim() || randomUUID();
  return hashVisitorToken(token);
}

export function newVisitorToken(): string {
  return randomUUID();
}

/**
 * Record one qualified pageview. Dedupes per visitor per article within VIEW_DEDUP_HOURS.
 * This is the ONLY code path allowed to increment Article.views and author totalViews.
 */
export async function recordArticleView(
  articleId: string,
  visitorKey: string,
  referrer?: string | null,
): Promise<{ recorded: boolean }> {
  const since = new Date(Date.now() - VIEW_DEDUP_HOURS * 60 * 60 * 1000);

  const article = await prisma.article.findFirst({
    where: { id: articleId, status: 'PUBLISHED' },
    select: { id: true, authorId: true },
  });
  if (!article) return { recorded: false };

  const recent = await prisma.articleView.findFirst({
    where: { articleId, visitorKey, viewedAt: { gte: since } },
    select: { id: true },
  });
  if (recent) return { recorded: false };

  await prisma.$transaction(async (tx) => {
    await tx.articleView.create({
      data: {
        articleId,
        visitorKey,
        referrer: referrer?.trim().slice(0, 500) || null,
      },
    });
    await tx.article.update({
      where: { id: articleId },
      data: { views: { increment: 1 } },
    });
    await tx.user.update({
      where: { id: article.authorId },
      data: { totalViews: { increment: 1 } },
    });
  });

  return { recorded: true };
}

/** Admin integrity check — re-sync denormalized counters from the immutable ledger. */
export async function reconcileArticleViewCounts(): Promise<{ articles: number; users: number }> {
  const articles = await prisma.article.findMany({
    select: { id: true, authorId: true, _count: { select: { viewEvents: true } } },
  });

  let articleUpdates = 0;
  for (const row of articles) {
    const views = row._count.viewEvents;
    await prisma.article.update({ where: { id: row.id }, data: { views } });
    articleUpdates += 1;
  }

  const byAuthor = new Map<string, number>();
  for (const row of articles) {
    byAuthor.set(row.authorId, (byAuthor.get(row.authorId) ?? 0) + row._count.viewEvents);
  }

  let userUpdates = 0;
  for (const [authorId, totalViews] of byAuthor) {
    await prisma.user.update({ where: { id: authorId }, data: { totalViews } });
    userUpdates += 1;
  }

  return { articles: articleUpdates, users: userUpdates };
}