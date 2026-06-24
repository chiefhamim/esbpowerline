import { createScriptPrismaClient } from '../prisma/client';

async function check() {
  const prisma = createScriptPrismaClient();
  try {
    const articles = await prisma.article.findMany({
      select: {
        title: true,
        imageUrl: true,
        content: true,
        locale: true,
        author: { select: { name: true, email: true } },
      }
    });

    console.log(`Found ${articles.length} articles in DB:`);
    for (const art of articles) {
      console.log(`- Title: "${art.title}"`);
      console.log(`  Locale: ${art.locale}`);
      console.log(`  Author: ${art.author.name} (${art.author.email})`);
      console.log(`  Cover Image: ${art.imageUrl}`);
      // Find rewritten image urls in content
      const matches = art.content.matchAll(/<img[^>]+src=["']([^"']+)["']/gi);
      const contentImages = [...matches].map(m => m[1]);
      console.log(`  Inline Images: ${contentImages.length > 0 ? contentImages.join(', ') : 'none'}`);
    }

    const media = await prisma.media.findMany({ select: { url: true, name: true } });
    console.log(`\nMedia library contains ${media.length} items:`);
    for (const item of media) {
      console.log(`- ${item.name}: ${item.url}`);
    }

  } finally {
    await prisma.$disconnect();
  }
}

check();
