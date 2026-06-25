import { createScriptPrismaClient } from '../prisma/client.js';
import { config } from 'dotenv';
import { existsSync } from 'fs';
import path from 'path';

config({ path: '.env' });
if (existsSync('.env.local')) config({ path: '.env.local', override: true });

type WpPost = {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  content: { rendered: string };
  categories: number[];
  featured_media: number;
  author: number;
};

type WpMedia = {
  id: number;
  source_url: string;
};

async function main() {
  const prisma = createScriptPrismaClient();

  console.log('Fetching all media items directly from esbpowerline.com/wp-json/wp/v2/media...');
  let wpMediaMap = new Map<string, string>(); // filename -> source_url
  let page = 1;

  while (true) {
    const url = `https://esbpowerline.com/wp-json/wp/v2/media?per_page=100&page=${page}`;
    try {
      const res = await fetch(url);
      if (!res.ok) break;
      const items = await res.json() as WpMedia[];
      if (!Array.isArray(items) || items.length === 0) break;
      for (const item of items) {
        if (item.source_url) {
          const wpFilename = path.basename(new URL(item.source_url).pathname);
          wpMediaMap.set(wpFilename.toLowerCase(), item.source_url);
        }
      }
      console.log(`Page ${page} fetched. Total wp-media items cataloged: ${wpMediaMap.size}`);
      page++;
    } catch {
      break;
    }
  }

  // Also query posts because images might be embedded in the content
  console.log('\nFetching all posts from esbpowerline.com to search for image URLs in content...');
  page = 1;
  while (true) {
    const url = `https://esbpowerline.com/wp-json/wp/v2/posts?per_page=100&page=${page}`;
    try {
      const res = await fetch(url);
      if (!res.ok) break;
      const posts = await res.json() as WpPost[];
      if (!Array.isArray(posts) || posts.length === 0) break;
      for (const post of posts) {
        const matches = post.content.rendered.matchAll(/src=["'](https?:\/\/esbpowerline\.com\/wp-content\/uploads\/[^\s"']+)["']/gi);
        for (const match of matches) {
          const sourceUrl = match[1];
          const wpFilename = path.basename(new URL(sourceUrl).pathname);
          wpMediaMap.set(wpFilename.toLowerCase(), sourceUrl);
        }
      }
      console.log(`Page ${page} posts fetched. Total wp-media items cataloged: ${wpMediaMap.size}`);
      page++;
    } catch {
      break;
    }
  }

  console.log(`\nCataloged ${wpMediaMap.size} files from WordPress source. Mapping local database files now...`);

  // Query all Media in DB that are broken
  const brokenMedia = await prisma.media.findMany({
    where: {
      OR: [
        { url: { startsWith: '/uploads/' } },
        { url: { contains: '/storage/v1/object/public/media/library/' } }
      ]
    }
  });

  const { createServiceRoleClient } = await import('../lib/supabase/admin-client.js');
  const supabase = createServiceRoleClient()!;
  const sharp = (await import('sharp')).default;

  let repairedCount = 0;

  for (const media of brokenMedia) {
    const originalUrl = media.url;
    let filename = '';

    if (originalUrl.startsWith('/uploads/')) {
      filename = originalUrl.slice('/uploads/'.length);
    } else {
      const parts = originalUrl.split('/library/');
      if (parts.length > 1) {
        filename = parts[1];
      }
    }

    if (!filename) continue;

    const publicBucketUrl = `https://sxgokpmrbgdndstygapc.supabase.co/storage/v1/object/public/media/library/${filename}`;
    
    // Check if it already exists on Supabase (quick double check)
    let existsOnSupabase = false;
    try {
      const checkRes = await fetch(publicBucketUrl, { method: 'HEAD' });
      if (checkRes.ok && checkRes.status === 200) {
        existsOnSupabase = true;
      }
    } catch {}

    if (existsOnSupabase) {
      if (media.url.startsWith('/uploads/')) {
        await prisma.media.update({
          where: { id: media.id },
          data: { url: publicBucketUrl }
        });
        console.log(`  ✓ DB URL updated to: ${publicBucketUrl}`);
        repairedCount++;
      }
      continue;
    }

    // Attempt repair
    // Extract base filename without the unique prefix timestamp: e.g. "1782326171884-5733544a-8b3c-4a68-a792-c356e5f7bf13.webp" -> "5733544a-8b3c-4a68-a792-c356e5f7bf13.webp"
    const nameWithoutTimestamp = filename.replace(/^\d+-/, '');
    
    // Look up in our wpMediaMap (case-insensitive keys)
    // We try nameWithoutTimestamp, then try strip .webp suffix and match with .jpg, .png etc.
    let wpSourceUrl = wpMediaMap.get(nameWithoutTimestamp.toLowerCase());

    if (!wpSourceUrl) {
      // Try replacing the extension back to png / jpg etc if it was converted to webp
      const baseName = nameWithoutTimestamp.replace(/\.webp$/i, '');
      for (const [wpFile, fullUrl] of wpMediaMap.entries()) {
        if (wpFile.replace(/\.(jpg|jpeg|png|gif)$/i, '') === baseName.toLowerCase()) {
          wpSourceUrl = fullUrl;
          break;
        }
      }
    }

    if (!wpSourceUrl && media.name) {
      const cleanName = media.name.replace(/—\s*cover/i, '').trim().toLowerCase();
      // Try fuzzy matching or exact match with names
      // (Normally title mapping is less reliable, but we can try)
    }

    if (wpSourceUrl) {
      console.log(`  🔄 Found WP counterpart for ${filename} -> ${wpSourceUrl}`);
      try {
        const fetchRes = await fetch(wpSourceUrl);
        if (fetchRes.ok) {
          const arrayBuffer = await fetchRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();

          const { error } = await supabase.storage.from('media').upload(`library/${filename}`, webpBuffer, {
            contentType: 'image/webp',
            upsert: true,
          });

          if (!error) {
            await prisma.media.update({
              where: { id: media.id },
              data: { url: publicBucketUrl }
            });
            console.log(`    ✓ Uploaded and updated database record!`);
            repairedCount++;
          } else {
            console.error(`    ❌ Supabase upload failed: ${error.message}`);
          }
        }
      } catch (err: any) {
        console.error(`    ❌ Error downloading/processing ${wpSourceUrl}: ${err.message}`);
      }
    } else {
      console.log(`  ⚠️ WP counterpart NOT found for: ${filename} (base: ${nameWithoutTimestamp})`);
    }
  }

  console.log(`\n🎉 Total repaired/updated: ${repairedCount}`);

  // Now, update article covers
  const articlesWithLocalImages = await prisma.article.findMany({
    where: {
      OR: [
        { imageUrl: { startsWith: '/uploads/' } },
        { imageUrl: { contains: '/storage/v1/object/public/media/library/' } }
      ]
    }
  });

  console.log(`\nUpdating cover images of ${articlesWithLocalImages.length} articles...`);
  for (const art of articlesWithLocalImages) {
    const currentUrl = art.imageUrl!;
    let filename = '';
    if (currentUrl.startsWith('/uploads/')) {
      filename = currentUrl.slice('/uploads/'.length);
    } else {
      const parts = currentUrl.split('/library/');
      if (parts.length > 1) {
        filename = parts[1];
      }
    }

    if (!filename) continue;

    const publicBucketUrl = `https://sxgokpmrbgdndstygapc.supabase.co/storage/v1/object/public/media/library/${filename}`;
    
    // Check if the file exists on Supabase storage now
    let exists = false;
    try {
      const checkRes = await fetch(publicBucketUrl, { method: 'HEAD' });
      if (checkRes.ok && checkRes.status === 200) {
        exists = true;
      }
    } catch {}

    if (exists) {
      if (art.imageUrl !== publicBucketUrl) {
        await prisma.article.update({
          where: { id: art.id },
          data: { imageUrl: publicBucketUrl }
        });
        console.log(`  📝 Updated Article cover: "${art.title}" ➔ ${publicBucketUrl}`);
      }
    }
  }

  await prisma.$disconnect();
}

main().catch(console.error);
