import { createScriptPrismaClient } from '../prisma/client.js';
import { createServiceRoleClient } from '../lib/supabase/admin-client.js';
import { config } from 'dotenv';
import { existsSync } from 'fs';

config({ path: '.env' });
if (existsSync('.env.local')) config({ path: '.env.local', override: true });

async function main() {
  const prisma = createScriptPrismaClient();
  const supabase = createServiceRoleClient()!;

  // Let's check all Media records in the database
  const mediaRecords = await prisma.media.findMany();
  console.log(`Verifying final list of ${mediaRecords.length} Media records...`);

  let invalidCount = 0;

  for (const media of mediaRecords) {
    const url = media.url;
    
    // Check if the URL returns a 400 Bad Request, 404 Not Found, or is otherwise broken
    let isValid = false;
    try {
      const checkRes = await fetch(url, { method: 'HEAD' });
      if (checkRes.ok && checkRes.status === 200) {
        isValid = true;
      }
    } catch {}

    if (!isValid) {
      console.log(`❌ Problematic/unresolved URL found: ${url} (Name: ${media.name})`);
      invalidCount++;

      // Extract filename to clean storage if it's Supabase
      let filename = '';
      if (url.includes('/library/')) {
        filename = url.split('/library/')[1];
      } else if (url.startsWith('/uploads/')) {
        filename = url.slice('/uploads/'.length);
      }

      if (filename) {
        try {
          await supabase.storage.from('media').remove([`library/${filename}`]);
        } catch {}
      }

      // Delete Media Record from database
      await prisma.media.delete({
        where: { id: media.id }
      });

      // Update associated Articles to null
      const articles = await prisma.article.findMany({
        where: { imageUrl: url }
      });
      for (const art of articles) {
        await prisma.article.update({
          where: { id: art.id },
          data: { imageUrl: null }
        });
        console.log(`   ✓ Unlinked article cover image for: "${art.title}"`);
      }
    }
  }

  console.log(`\n🎉 Verification finished:`);
  console.log(`- Total invalid media assets removed: ${invalidCount}`);
  console.log(`- Remaining fully-functional assets in DB: ${mediaRecords.length - invalidCount}`);

  await prisma.$disconnect();
}

main().catch(console.error);
