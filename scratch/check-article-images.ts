import { createScriptPrismaClient } from '../prisma/client.js';
import { config } from 'dotenv';
import { existsSync } from 'fs';

config({ path: '.env' });
if (existsSync('.env.local')) config({ path: '.env.local', override: true });

async function main() {
  const prisma = createScriptPrismaClient();

  // 1. Get all articles that are published (not in trash)
  const articles = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      editorTrash: false
    },
    select: {
      id: true,
      title: true,
      slug: true,
      imageUrl: true,
      locale: true
    }
  });

  console.log(`Total active published articles: ${articles.length}`);

  let missingImageCount = 0;
  let brokenImageCount = 0;
  let validImageCount = 0;

  const brokenArticles = [];

  for (const art of articles) {
    if (!art.imageUrl) {
      missingImageCount++;
      brokenArticles.push({
        id: art.id,
        title: art.title,
        locale: art.locale,
        slug: art.slug,
        currentUrl: null,
        reason: 'No imageUrl specified'
      });
      continue;
    }

    // Check if the URL is relative or absolute Supabase URL
    // Test if it resolves
    let resolves = false;
    try {
      const checkRes = await fetch(art.imageUrl, { method: 'HEAD' });
      if (checkRes.ok && checkRes.status === 200) {
        resolves = true;
      }
    } catch {}

    if (resolves) {
      validImageCount++;
    } else {
      brokenImageCount++;
      brokenArticles.push({
        id: art.id,
        title: art.title,
        locale: art.locale,
        slug: art.slug,
        currentUrl: art.imageUrl,
        reason: 'Image URL returns non-200 or fetch failed'
      });
    }
  }

  console.log(`\nImage Status Summary:`);
  console.log(`- Valid working images: ${validImageCount}`);
  console.log(`- Missing images (null): ${missingImageCount}`);
  console.log(`- Broken images (fetch failed): ${brokenImageCount}`);

  if (brokenArticles.length > 0) {
    console.log(`\nArticles needing image sync/fix (${brokenArticles.length}):`);
    console.log(JSON.stringify(brokenArticles.slice(0, 15), null, 2));
  }

  await prisma.$disconnect();
}

main().catch(console.error);
