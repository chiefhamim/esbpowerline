import { createScriptPrismaClient } from '../prisma/client';
const prisma = createScriptPrismaClient();

async function run() {
  console.log('Fetching Bangla articles...');
  const articles = await prisma.article.findMany({
    where: {
      OR: [
        { locale: 'bn' },
        { slug: { endsWith: '-bn' } }
      ]
    },
    select: {
      id: true,
      title: true,
      slug: true,
      imageUrl: true,
      content: true,
      contentBn: true,
      locale: true
    }
  });

  console.log(`Found ${articles.length} Bangla articles.`);
  
  let relativeCount = 0;
  let absoluteCount = 0;
  let nullCount = 0;
  
  const sampleUrls: any[] = [];

  for (const a of articles) {
    if (!a.imageUrl) {
      nullCount++;
      continue;
    }
    
    if (a.imageUrl.startsWith('http://') || a.imageUrl.startsWith('https://')) {
      absoluteCount++;
    } else {
      relativeCount++;
      if (sampleUrls.length < 15) {
        sampleUrls.push({ title: a.title, slug: a.slug, imageUrl: a.imageUrl });
      }
    }
  }

  console.log('\nImage URL Statistics for BN Articles:');
  console.log(`- Null: ${nullCount}`);
  console.log(`- Absolute (Remote): ${absoluteCount}`);
  console.log(`- Relative (/uploads/...): ${relativeCount}`);
  
  console.log('\nSample Relative Images:');
  console.log(JSON.stringify(sampleUrls, null, 2));

  // Let's also check for inline image urls in content and contentBn
  console.log('\nScanning inline images inside content & contentBn...');
  const inlineUrls = new Set<string>();
  for (const a of articles) {
    const contents = [a.content || '', a.contentBn || ''];
    for (const c of contents) {
      const matches = c.matchAll(/<img[^>]+src=["']([^"']+)["']/gi);
      for (const m of matches) {
        inlineUrls.add(m[1]);
      }
    }
  }
  
  console.log(`Found ${inlineUrls.size} unique inline image URLs inside BN articles.`);
  console.log('Sample inline URLs (first 20):');
  console.log(Array.from(inlineUrls).slice(0, 20));

  await prisma.$disconnect();
}

run().catch(console.error);
