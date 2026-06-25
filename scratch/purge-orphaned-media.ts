import { createScriptPrismaClient } from '../prisma/client.js';
import { createServiceRoleClient } from '../lib/supabase/admin-client.js';
import { config } from 'dotenv';
import { existsSync } from 'fs';

config({ path: '.env' });
if (existsSync('.env.local')) config({ path: '.env.local', override: true });

async function main() {
  const prisma = createScriptPrismaClient();
  const supabase = createServiceRoleClient()!;

  // We query all media items that have 0 references directly by any article cover field (imageUrl)
  const allMedia = await prisma.media.findMany();
  
  console.log(`Analyzing ${allMedia.length} total media library records...`);
  
  let deletedCount = 0;
  for (const m of allMedia) {
    const refs = await prisma.article.findMany({
      where: { imageUrl: m.url }
    });
    
    if (refs.length === 0) {
      console.log(`Deleting unused media record: "${m.name}" (URL: ${m.url})`);
      
      let filename = '';
      if (m.url.includes('/library/')) {
        filename = m.url.split('/library/')[1];
      } else if (m.url.startsWith('/uploads/')) {
        filename = m.url.slice('/uploads/'.length);
      }
      
      if (filename) {
        try {
          await supabase.storage.from('media').remove([`library/${filename}`]);
        } catch {}
      }
      
      await prisma.media.delete({
        where: { id: m.id }
      });
      deletedCount++;
    }
  }

  console.log(`\n🎉 Success! Purged ${deletedCount} unused duplicate media records.`);
  await prisma.$disconnect();
}

main().catch(console.error);
