import { createScriptPrismaClient } from '../prisma/client.js';
import { config } from 'dotenv';
import { existsSync } from 'fs';

config({ path: '.env' });
if (existsSync('.env.local')) config({ path: '.env.local', override: true });

async function main() {
  const prisma = createScriptPrismaClient();

  // Find all Media rows matching the Mohammadpur title keyword
  const mediaItems = await prisma.media.findMany({
    where: {
      OR: [
        { name: { contains: 'মোহাম্মদপুরে' } },
        { name: { contains: 'Mohammadpur' } },
        { name: { contains: 'Gas' } }
      ]
    }
  });

  console.log('--- ALL RELATED MEDIA RECORDS ---');
  for (const m of mediaItems) {
    console.log(`ID: ${m.id} | Name: ${m.name} | URL: ${m.url}`);
    
    // Check which articles reference this URL
    const refs = await prisma.article.findMany({
      where: { imageUrl: m.url },
      select: { id: true, title: true, slug: true, locale: true }
    });
    console.log(`  Referenced directly by ${refs.length} articles:`);
    for (const ref of refs) {
      console.log(`    - ID: ${ref.id} | Locale: ${ref.locale} | Title: "${ref.title}" | Slug: "${ref.slug}"`);
    }
  }

  await prisma.$disconnect();
}

main().catch(console.error);
