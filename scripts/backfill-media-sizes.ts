import { createScriptPrismaClient } from '../prisma/client';
import { statSync, existsSync } from 'fs';
import { join } from 'path';

async function main() {
  const prisma = createScriptPrismaClient();
  const items = await prisma.media.findMany();
  console.log(`Scanning ${items.length} media items...`);

  for (const item of items) {
    if (item.size !== null && item.size > 0) {
      continue;
    }

    let size: number | null = null;
    const url = item.url;

    if (url.startsWith('/')) {
      // Local file in public directory
      const localPath = join(process.cwd(), 'public', url);
      if (existsSync(localPath)) {
        size = statSync(localPath).size;
        console.log(`[Local] ${url} -> ${size} bytes`);
      } else {
        console.warn(`[Local] File not found: ${localPath}`);
      }
    } else if (url.startsWith('http://') || url.startsWith('https://')) {
      // Remote file
      try {
        const res = await fetch(url, { method: 'HEAD' });
        const len = res.headers.get('content-length');
        if (len) {
          size = parseInt(len, 10);
          console.log(`[Remote] ${url} -> ${size} bytes`);
        } else {
          // Fallback to GET
          const getRes = await fetch(url, { method: 'GET' });
          const getLen = getRes.headers.get('content-length');
          if (getLen) {
            size = parseInt(getLen, 10);
            console.log(`[Remote GET] ${url} -> ${size} bytes`);
          } else {
            // Read body size
            const blob = await getRes.blob();
            size = blob.size;
            console.log(`[Remote Blob] ${url} -> ${size} bytes`);
          }
        }
      } catch (err) {
        console.warn(`[Remote Error] Failed to fetch size for ${url}:`, err);
      }
    }

    if (size !== null && size > 0) {
      await prisma.media.update({
        where: { id: item.id },
        data: { size },
      });
    }
  }

  console.log('Done backfilling media sizes.');
  await prisma.$disconnect();
}

main().catch(console.error);
