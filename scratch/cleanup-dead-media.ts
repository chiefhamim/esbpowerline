import { createScriptPrismaClient } from '../prisma/client.js';
import { createServiceRoleClient } from '../lib/supabase/admin-client.js';
import { config } from 'dotenv';
import { existsSync } from 'fs';

config({ path: '.env' });
if (existsSync('.env.local')) config({ path: '.env.local', override: true });

async function main() {
  const prisma = createScriptPrismaClient();
  const supabase = createServiceRoleClient();

  if (!supabase) {
    console.error('❌ Supabase service role client could not be initialized.');
    process.exit(1);
  }

  // Get all Media records in DB
  const mediaRecords = await prisma.media.findMany();
  console.log(`Analyzing total of ${mediaRecords.length} Media records...`);

  let deadMediaCount = 0;
  let deletedFromSupabaseCount = 0;

  for (const media of mediaRecords) {
    let filename = '';
    const url = media.url;

    if (url.startsWith('/uploads/')) {
      filename = url.slice('/uploads/'.length);
    } else if (url.includes('/storage/v1/object/public/media/library/')) {
      const parts = url.split('/library/');
      if (parts.length > 1) {
        filename = parts[1];
      }
    }

    // Only inspect images we want to check (meaning relative upload images or library uploaded images)
    if (!filename) {
      continue;
    }

    const publicBucketUrl = `https://sxgokpmrbgdndstygapc.supabase.co/storage/v1/object/public/media/library/${filename}`;
    
    // Check if the image resolves (status 200)
    let isWorking = false;
    try {
      const checkRes = await fetch(publicBucketUrl, { method: 'HEAD' });
      if (checkRes.ok && checkRes.status === 200) {
        isWorking = true;
      }
    } catch {}

    if (!isWorking) {
      console.log(`❌ Dead image found: ${filename} (URL: ${url})`);
      deadMediaCount++;

      // 1. Delete from Supabase Storage just in case it exists in a broken state
      try {
        const { error } = await supabase.storage.from('media').remove([`library/${filename}`]);
        if (!error) {
          deletedFromSupabaseCount++;
        }
      } catch {}

      // 2. Remove the Media record from Prisma DB to keep it clean
      await prisma.media.delete({
        where: { id: media.id }
      });
      console.log(`   ✓ Deleted Media record ID: ${media.id} from DB.`);

      // 3. Update any Article that was referencing this image to null
      const articlesUsingImage = await prisma.article.findMany({
        where: { imageUrl: url }
      });
      for (const art of articlesUsingImage) {
        await prisma.article.update({
          where: { id: art.id },
          data: { imageUrl: null }
        });
        console.log(`   ✓ Updated Article cover image reference to null: "${art.title}"`);
      }
    }
  }

  console.log(`\n🎉 Cleanup complete:`);
  console.log(`- Identified and purged ${deadMediaCount} dead images from database and storage.`);
  console.log(`- Removed ${deletedFromSupabaseCount} physical items from Supabase storage.`);

  await prisma.$disconnect();
}

main().catch(console.error);
