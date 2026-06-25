import { createScriptPrismaClient } from '../prisma/client';
const prisma = createScriptPrismaClient();

function normalizeArticleImageUrl(url: string | null | undefined): string | null {
  const trimmed = url?.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('/uploads/')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    if (supabaseUrl) {
      const filename = trimmed.substring('/uploads/'.length);
      const isCategory = filename.startsWith('categories/');
      const folder = isCategory ? '' : 'library/';
      const cleanFilename = isCategory ? filename.substring('categories/'.length) : filename;
      return `${supabaseUrl}/storage/v1/object/public/media/${folder}${cleanFilename}`;
    }
  }
  return trimmed;
}

async function run() {
  console.log('Fetching relative media items...');
  const items = await prisma.media.findMany({
    where: {
      url: { startsWith: '/uploads/' }
    }
  });

  console.log(`Found ${items.length} items with relative URLs.`);

  let successCount = 0;
  let failCount = 0;
  const brokenItems = [];

  for (const item of items) {
    const normalized = normalizeArticleImageUrl(item.url);
    if (!normalized) {
      failCount++;
      brokenItems.push({ name: item.name, url: item.url, reason: 'Failed to normalize' });
      continue;
    }

    try {
      const res = await fetch(normalized, { method: 'HEAD' });
      if (res.status === 200) {
        successCount++;
      } else {
        failCount++;
        brokenItems.push({ name: item.name, url: item.url, normalizedUrl: normalized, status: res.status });
      }
    } catch (err: any) {
      failCount++;
      brokenItems.push({ name: item.name, url: item.url, normalizedUrl: normalized, error: err.message });
    }
  }

  console.log('\nRelative Media Check (via Supabase Normalization):');
  console.log(`- 200 Success: ${successCount}`);
  console.log(`- 404/Failures: ${failCount}`);

  console.log('\nBroken Relative Items:');
  console.log(JSON.stringify(brokenItems.slice(0, 20), null, 2));

  await prisma.$disconnect();
}

run().catch(console.error);
