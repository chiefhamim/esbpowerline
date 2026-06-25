import { createScriptPrismaClient } from '../prisma/client';
const prisma = createScriptPrismaClient();

async function run() {
  console.log('Fetching media library items...');
  const mediaItems = await prisma.media.findMany();
  console.log(`Found ${mediaItems.length} total media items.`);

  const systemOrRasel = [];
  let relativeCount = 0;
  let absoluteCount = 0;

  for (const m of mediaItems) {
    const isSystem = !m.uploadedById;
    if (m.url.startsWith('/') || m.url.startsWith('./')) {
      relativeCount++;
    } else {
      absoluteCount++;
    }

    systemOrRasel.push({
      id: m.id,
      name: m.name,
      url: m.url,
      type: m.type,
      uploadedById: m.uploadedById
    });
  }

  console.log('\nMedia URL Statistics:');
  console.log(`- Relative URLs: ${relativeCount}`);
  console.log(`- Absolute URLs: ${absoluteCount}`);

  // Fetch users to map uploadedById to name
  const users = await prisma.user.findMany({ select: { id: true, name: true } });
  const userMap = new Map();
  for (const u of users) {
    userMap.set(u.id, u.name);
  }

  console.log('\nAll Media Records Details:');
  const details = systemOrRasel.map(m => ({
    ...m,
    uploaderName: m.uploadedById ? (userMap.get(m.uploadedById) ?? 'Unknown') : 'System'
  }));

  console.log(JSON.stringify(details.slice(0, 30), null, 2));

  // Find occurrences of "sheikh" or "rasel"
  const raselItems = details.filter(d => 
    d.uploaderName.toLowerCase().includes('sheikh') || 
    d.uploaderName.toLowerCase().includes('rasel') ||
    d.name.toLowerCase().includes('rasel') ||
    d.url.toLowerCase().includes('rasel')
  );

  console.log(`\nFound ${raselItems.length} items relating to "Rasel" or "Sheikh":`);
  console.log(JSON.stringify(raselItems, null, 2));

  await prisma.$disconnect();
}

run().catch(console.error);
