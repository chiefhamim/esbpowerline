import { createScriptPrismaClient } from '../prisma/client';
const prisma = createScriptPrismaClient();

async function run() {
  console.log('Fetching remote media items in Supabase...');
  const items = await prisma.media.findMany({
    where: {
      url: { startsWith: 'https://sxgokpmrbgdndstygapc.supabase.co' }
    }
  });

  console.log(`Found ${items.length} items in Supabase.`);
  
  let successCount = 0;
  let failCount = 0;
  
  const brokenItems = [];

  for (const item of items) {
    try {
      const res = await fetch(item.url, { method: 'HEAD' });
      if (res.status === 200) {
        successCount++;
      } else {
        failCount++;
        brokenItems.push({ name: item.name, url: item.url, status: res.status });
      }
    } catch (err: any) {
      failCount++;
      brokenItems.push({ name: item.name, url: item.url, error: err.message });
    }
  }

  console.log('\nSupabase Storage HEAD checks:');
  console.log(`- 200 Success: ${successCount}`);
  console.log(`- Failures: ${failCount}`);

  console.log('\nSample Broken Items:');
  console.log(JSON.stringify(brokenItems.slice(0, 10), null, 2));

  await prisma.$disconnect();
}

run().catch(console.error);
