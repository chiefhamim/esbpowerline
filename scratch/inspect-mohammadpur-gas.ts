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
      name: { contains: 'মোহাম্মদপুরে' }
    }
  });

  console.log('--- DB MEDIA RECORDS ---');
  for (const m of mediaItems) {
    console.log(`ID: ${m.id} | Name: ${m.name} | URL: ${m.url}`);
  }

  // Find all Articles matching the Mohammadpur title keyword
  const articles = await prisma.article.findMany({
    where: {
      title: { contains: 'মোহাম্মদপুরে' }
    }
  });

  console.log('\n--- DB ARTICLE RECORDS ---');
  for (const a of articles) {
    console.log(`ID: ${a.id} | Title: ${a.title} | ImageUrl: ${a.imageUrl} | Locale: ${a.locale}`);
  }

  // Find all English Articles matching the Mohammadpur title keyword
  const articlesEn = await prisma.article.findMany({
    where: {
      title: { contains: 'Mohammadpur' }
    }
  });

  console.log('\n--- DB ENGLISH ARTICLE RECORDS ---');
  for (const a of articlesEn) {
    console.log(`ID: ${a.id} | Title: ${a.title} | ImageUrl: ${a.imageUrl} | Locale: ${a.locale}`);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
