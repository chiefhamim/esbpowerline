/**
 * One-off production DB diagnostic — article counts, author linkage, media gap.
 */
import { config } from 'dotenv';
import { existsSync } from 'fs';

config({ path: '.env' });
if (existsSync('.env.local')) config({ path: '.env.local', override: true });
if (existsSync('.env.production.local')) {
  config({ path: '.env.production.local', override: true });
}

function toPostgresqlUrl(raw: string | undefined): string {
  const value = raw?.trim();
  if (!value) return '';
  return value.replace(/^postgres:\/\//, 'postgresql://');
}

if (!toPostgresqlUrl(process.env.DATABASE_URL)) {
  process.env.DATABASE_URL = toPostgresqlUrl(
    process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL,
  );
}

async function main() {
  const { createScriptPrismaClient } = await import('../prisma/client');
  const prisma = createScriptPrismaClient();

  const editor = await prisma.user.findUnique({
    where: { email: 'hamim2964@gmail.com' },
    select: { id: true, name: true, role: true, articlesCount: true, totalViews: true },
  });

  const articles = await prisma.article.groupBy({ by: ['status'], _count: true });
  const byAuthor = editor
    ? await prisma.article.groupBy({
        by: ['status'],
        where: { authorId: editor.id },
        _count: true,
      })
    : [];

  const published = editor
    ? await prisma.article.count({ where: { authorId: editor.id, status: 'PUBLISHED' } })
    : 0;

  const mediaCount = await prisma.media.count();
  const withImage = await prisma.article.count({
    where: { imageUrl: { not: null }, status: 'PUBLISHED' },
  });

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const yearStart = new Date(monthStart.getFullYear(), 0, 1);

  const publishedThisMonth = editor
    ? await prisma.article.count({
        where: { authorId: editor.id, status: 'PUBLISHED', publishedAt: { gte: monthStart } },
      })
    : 0;

  const publishedThisYear = editor
    ? await prisma.article.count({
        where: { authorId: editor.id, status: 'PUBLISHED', publishedAt: { gte: yearStart } },
      })
    : 0;

  const viewEvents = await prisma.articleView.count();

  const orphanImages = await prisma.article.findMany({
    where: { imageUrl: { not: null }, status: 'PUBLISHED' },
    select: { imageUrl: true },
    distinct: ['imageUrl'],
  });
  const mediaUrls = new Set(
    (await prisma.media.findMany({ select: { url: true } })).map((m) => m.url),
  );
  const missingMedia = orphanImages.filter((a) => a.imageUrl && !mediaUrls.has(a.imageUrl));

  const allEditors = await prisma.user.findMany({
    where: { role: { in: ['AUTHOR', 'EDITOR'] } },
    select: { id: true, email: true, name: true, role: true, articlesCount: true },
  });

  console.log(
    JSON.stringify(
      {
        editor,
        allEditors,
        articles,
        byAuthor,
        published,
        mediaCount,
        withImage,
        missingMediaCount: missingMedia.length,
        publishedThisMonth,
        publishedThisYear,
        viewEvents,
      },
      null,
      2,
    ),
  );

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});