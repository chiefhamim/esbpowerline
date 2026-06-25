import { createScriptPrismaClient } from '../prisma/client.js';
import { createServiceRoleClient } from '../lib/supabase/admin-client.js';
import { config } from 'dotenv';
import { existsSync } from 'fs';
import path from 'path';
import sharp from 'sharp';

config({ path: '.env' });
if (existsSync('.env.local')) config({ path: '.env.local', override: true });

type WpPost = {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  featured_media: number;
};

type WpMedia = {
  id: number;
  source_url: string;
  title: { rendered: string };
};

// Clean helper to extract base URL file paths
function getCleanBaseName(urlStr: string) {
  try {
    const filename = path.basename(new URL(urlStr).pathname);
    return filename.replace(/^\d+-/, '').replace(/\.(webp|jpg|jpeg|png)$/i, '').toLowerCase();
  } catch {
    const filename = path.basename(urlStr);
    return filename.replace(/^\d+-/, '').replace(/\.(webp|jpg|jpeg|png)$/i, '').toLowerCase();
  }
}

async function main() {
  const prisma = createScriptPrismaClient();
  const supabase = createServiceRoleClient();

  if (!supabase) {
    console.error('❌ Supabase service role client could not be initialized.');
    process.exit(1);
  }

  // 1. Find all active published articles with null image URLs
  const articlesMissingImages = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      editorTrash: false,
      imageUrl: null
    }
  });

  console.log(`Analyzing ${articlesMissingImages.length} articles with missing image URLs...`);
  if (articlesMissingImages.length === 0) {
    console.log('🎉 No articles are missing cover images.');
    await prisma.$disconnect();
    return;
  }

  // 2. We crawl the WP endpoints for posts and media to map counterparts
  console.log('\nFetching remote posts/media database map from esbpowerline.com for matching...');
  
  const wpPostMap = new Map<string, WpPost>(); // normalized slug -> WpPost
  const wpMediaMap = new Map<number, string>(); // mediaId -> source_url
  
  let page = 1;
  while (true) {
    const url = `https://esbpowerline.com/wp-json/wp/v2/posts?per_page=100&page=${page}`;
    try {
      const res = await fetch(url);
      if (!res.ok) break;
      const posts = await res.json() as WpPost[];
      if (!Array.isArray(posts) || posts.length === 0) break;
      for (const p of posts) {
        wpPostMap.set(p.slug.toLowerCase(), p);
      }
      page++;
    } catch {
      break;
    }
  }

  page = 1;
  while (true) {
    const url = `https://esbpowerline.com/wp-json/wp/v2/media?per_page=100&page=${page}`;
    try {
      const res = await fetch(url);
      if (!res.ok) break;
      const media = await res.json() as WpMedia[];
      if (!Array.isArray(media) || media.length === 0) break;
      for (const m of media) {
        if (m.source_url) {
          wpMediaMap.set(m.id, m.source_url);
        }
      }
      page++;
    } catch {
      break;
    }
  }

  console.log(`Cataloged ${wpPostMap.size} remote posts and ${wpMediaMap.size} media assets.`);

  let resolvedCount = 0;

  for (const art of articlesMissingImages) {
    console.log(`\nProcessing article: "${art.title}"`);
    let sourceImageUrl = '';

    // Step A: Attempt match by slug
    const matchedPost = wpPostMap.get(art.slug.toLowerCase());
    if (matchedPost) {
      console.log(`  ✓ Matched remote WordPress post.`);
      if (matchedPost.featured_media && wpMediaMap.has(matchedPost.featured_media)) {
        sourceImageUrl = wpMediaMap.get(matchedPost.featured_media)!;
        console.log(`  ✓ Found featured media URL: ${sourceImageUrl}`);
      } else {
        // Look inside content image tags
        const matches = matchedPost.content.rendered.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (matches && matches[1]) {
          sourceImageUrl = matches[1];
          console.log(`  ✓ Extracted inline content image: ${sourceImageUrl}`);
        }
      }
    }

    // Step B: If still not found, try searching WP media directly by title query
    if (!sourceImageUrl) {
      console.log(`  🔍 Searching WordPress API by article title...`);
      try {
        const decodedTitle = decodeURIComponent(art.title);
        const wpSearchRes = await fetch(`https://esbpowerline.com/wp-json/wp/v2/posts?search=${encodeURIComponent(decodedTitle)}&per_page=1`);
        if (wpSearchRes.ok) {
          const posts = await wpSearchRes.json() as WpPost[];
          if (posts.length > 0) {
            const matchedSearchPost = posts[0];
            if (matchedSearchPost.featured_media) {
              // Fetch media details
              const mediaRes = await fetch(`https://esbpowerline.com/wp-json/wp/v2/media/${matchedSearchPost.featured_media}`);
              if (mediaRes.ok) {
                const mediaDetails = await mediaRes.json() as WpMedia;
                sourceImageUrl = mediaDetails.source_url;
                console.log(`    ✓ Found media search result URL: ${sourceImageUrl}`);
              }
            }
          }
        }
      } catch {}
    }

    // Step C: If we have a valid source URL, download, process WebP, upload, and update DB
    if (sourceImageUrl && !sourceImageUrl.toLowerCase().includes('placeholder') && !sourceImageUrl.toLowerCase().includes('doctor')) {
      // Exclude generic placeholder matches
      const rawBasename = path.basename(new URL(sourceImageUrl).pathname);
      const ext = path.extname(rawBasename);
      const decodedBasename = decodeURIComponent(rawBasename.replace(ext, ''));
      // Sanitize filename: replace anything that is not alphanumeric, underscore, dash, or dot with underscore
      const cleanBasename = decodedBasename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100);
      const safeFilename = `${Date.now()}-${cleanBasename}.webp`;
      const publicBucketUrl = `https://sxgokpmrbgdndstygapc.supabase.co/storage/v1/object/public/media/library/${safeFilename}`;

      try {
        const fetchImgRes = await fetch(sourceImageUrl);
        if (fetchImgRes.ok) {
          const arrayBuffer = await fetchImgRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();

          console.log(`  📤 Uploading synced cover WebP: library/${safeFilename}`);
          const { error } = await supabase.storage.from('media').upload(`library/${safeFilename}`, webpBuffer, {
            contentType: 'image/webp',
            upsert: true,
          });

          if (!error) {
            // Update Article
            await prisma.article.update({
              where: { id: art.id },
              data: { imageUrl: publicBucketUrl }
            });

            // Register in Media library so it displays correctly in CMS Panel
            await prisma.media.create({
              data: {
                name: `${art.title.slice(0, 80)} — cover`,
                url: publicBucketUrl,
                type: 'image',
                mimeType: 'image/webp',
                uploadedById: art.authorId,
                altText: art.title
              }
            });

            console.log(`  📝 Article cover image synced successfully!`);
            resolvedCount++;
          } else {
            console.error(`  ❌ Supabase storage upload failed: ${error.message}`);
          }
        }
      } catch (err: any) {
        console.error(`  ❌ Error processing cover image: ${err.message}`);
      }
    } else {
      console.log(`  ⚠️ Could not resolve legitimate unique source image from WP for this article.`);
    }
  }

  console.log(`\n🎉 Sync job finished. Correctly resolved and restored ${resolvedCount} article cover images.`);
  await prisma.$disconnect();
}

main().catch(console.error);
