import { createScriptPrismaClient } from '../prisma/client.js';
import { config } from 'dotenv';
import { existsSync } from 'fs';
import path from 'path';

config({ path: '.env' });
if (existsSync('.env.local')) config({ path: '.env.local', override: true });

async function main() {
  const prisma = createScriptPrismaClient();

  // Let's query all articles in the system, specifically looking at those with locale = 'bn'
  const bnArticles = await prisma.article.findMany({
    where: {
      locale: 'bn'
    },
    select: {
      id: true,
      title: true,
      slug: true,
      imageUrl: true,
      content: true,
    }
  });

  console.log(`Total BN articles found in DB: ${bnArticles.length}`);
  for (const art of bnArticles) {
    console.log(`- Title: ${art.title}`);
    console.log(`  Slug: ${art.slug}`);
    console.log(`  Image URL: ${art.imageUrl}`);
    // Find all image tags in content
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    let match;
    const bodyImages = [];
    while ((match = imgRegex.exec(art.content)) !== null) {
      bodyImages.push(match[1]);
    }
    if (bodyImages.length > 0) {
      console.log(`  Body Images:`, bodyImages);
    }
  }

  // Also query Media rows that contain uploads
  const uploadsMedia = await prisma.media.findMany({
    where: {
      OR: [
        { url: { startsWith: '/uploads/' } },
        { url: { contains: '/storage/v1/object/public/media/library/' } }
      ]
    },
    select: {
      id: true,
      name: true,
      url: true,
      altText: true,
    }
  });

  console.log(`\nUploads/Supabase Media library records: ${uploadsMedia.length}`);
  console.log(JSON.stringify(uploadsMedia.slice(0, 10), null, 2));

  await prisma.$disconnect();
}

main().catch(console.error);
