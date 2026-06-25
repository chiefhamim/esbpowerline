import { createScriptPrismaClient } from '../prisma/client.js';
import { createServiceRoleClient } from '../lib/supabase/admin-client.js';
import { config } from 'dotenv';
import { existsSync } from 'fs';
import path from 'path';

config({ path: '.env' });
if (existsSync('.env.local')) config({ path: '.env.local', override: true });

async function main() {
  const prisma = createScriptPrismaClient();
  const supabase = createServiceRoleClient()!;

  // Find all Media rows containing '001' or similar generic patterns that might have mapped incorrectly
  // Let's print out what we found
  const mediaRecords = await prisma.media.findMany({
    where: {
      OR: [
        { url: { contains: '001' } },
        { url: { contains: 'photo' } },
        { url: { contains: 'image' } },
        { url: { contains: 'ele-4' } },
        { url: { contains: 'Load-shedding' } }
      ]
    }
  });

  console.log(`Found ${mediaRecords.length} Media items that fit generic pattern names:`);
  for (const media of mediaRecords) {
    console.log(`ID: ${media.id} | Name: ${media.name} | URL: ${media.url}`);
  }

  console.log('\nPurging only the incorrectly matched images...');

  let purged = 0;
  for (const media of mediaRecords) {
    const url = media.url;
    let filename = '';
    if (url.includes('/library/')) {
      filename = url.split('/library/')[1];
    } else if (url.startsWith('/uploads/')) {
      filename = url.slice('/uploads/'.length);
    }

    if (!filename) continue;

    // Delete from Supabase Storage
    try {
      await supabase.storage.from('media').remove([`library/${filename}`]);
    } catch {}

    // Delete from DB Media Table
    await prisma.media.delete({
      where: { id: media.id }
    });

    // Reset Article references
    const articles = await prisma.article.findMany({
      where: { imageUrl: url }
    });
    for (const art of articles) {
      await prisma.article.update({
        where: { id: art.id },
        data: { imageUrl: null }
      });
      console.log(`  ✓ Unlinked article cover: "${art.title}"`);
    }
    purged++;
  }

  console.log(`\nPurged ${purged} incorrect media assets.`);
  await prisma.$disconnect();
}

main().catch(console.error);
