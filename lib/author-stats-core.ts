import type { PrismaClient } from '@prisma/client';

export async function syncAuthorArticleCounts(prisma: PrismaClient, authorId: string): Promise<void> {
  const [published, totalViews] = await Promise.all([
    prisma.article.count({
      where: { authorId, status: 'PUBLISHED', editorTrash: false },
    }),
    prisma.article.aggregate({
      where: { authorId, status: { not: 'TRASH' } },
      _sum: { views: true },
    }),
  ]);

  await prisma.user.update({
    where: { id: authorId },
    data: {
      articlesCount: published,
      totalViews: totalViews._sum.views ?? 0,
    },
  });
}