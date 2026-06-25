import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import { createClient } from '@supabase/supabase-js';
import { createScriptPrismaClient } from '../prisma/client';
import type { PrismaClient } from '@prisma/client';

// Load variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const databaseUrl = process.env.DATABASE_URL?.trim();

if (!url || !serviceRoleKey || !databaseUrl) {
  console.error('❌ Missing environment variables! Please check your .env or .env.local file.');
  process.exit(1);
}

console.log(`🔌 Connecting to database: ${databaseUrl.replace(/:[^:@]+@/, ':****@')}`);
const prisma: PrismaClient = createScriptPrismaClient();

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.webp': return 'image/webp';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.pdf': return 'application/pdf';
    default: return 'application/octet-stream';
  }
}

async function main() {
  const localDir = path.join(process.cwd(), 'public', 'uploads');
  let files: string[] = [];
  try {
    files = await fs.readdir(localDir);
  } catch (err) {
    console.log('📂 No public/uploads directory found. Nothing to upload.');
    return;
  }

  // Filter only image/pdf files
  files = files.filter(f => f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.pdf'));
  console.log(`📸 Found ${files.length} local media files in public/uploads.`);

  if (files.length === 0) return;

  const bucket = 'media';

  // Get all Media records
  const mediaRecords = await prisma.media.findMany();
  // Get all Article records
  const articleRecords = await prisma.article.findMany({
    where: { imageUrl: { not: null } }
  });

  console.log(`📊 Found ${mediaRecords.length} Media entries and ${articleRecords.length} Articles in DB.`);

  let uploadCount = 0;
  let updateCount = 0;

  // Track uploaded files to avoid double uploading
  const uploadedUrls = new Map<string, string>(); // local suffix -> supabaseUrl

  for (const a of articleRecords) {
    const dbUrl = a.imageUrl!;
    if (dbUrl.startsWith('http')) {
      // Already uploaded
      continue;
    }
    const dbFilename = path.basename(dbUrl);
    const dbSuffix = dbFilename.replace(/^\d+-/, '');

    // Find the file on disk matching this suffix
    const matchingFile = files.find(f => f.replace(/^\d+-/, '') === dbSuffix);
    if (!matchingFile) {
      console.log(`⚠️ No local file found for database image: ${dbUrl}`);
      continue;
    }

    let supabaseUrl = uploadedUrls.get(dbSuffix);

    if (!supabaseUrl) {
      const filePath = path.join(localDir, matchingFile);
      const fileBuffer = await fs.readFile(filePath);
      const mimeType = getMimeType(filePath);
      const storagePath = `library/${matchingFile}`;

      console.log(`📤 Uploading local: ${matchingFile} for database: ${dbUrl}`);

      // Upload to Supabase Storage
      const { error } = await supabase.storage.from(bucket).upload(storagePath, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      });

      if (error) {
        console.error(`  ❌ Failed to upload ${matchingFile}: ${error.message}`);
        continue;
      }

      uploadCount++;
      supabaseUrl = `${url}/storage/v1/object/public/${bucket}/${storagePath}`;
      uploadedUrls.set(dbSuffix, supabaseUrl);
    }

    // Update Article record
    await prisma.article.update({
      where: { id: a.id },
      data: { imageUrl: supabaseUrl }
    });
    updateCount++;
    console.log(`  📝 Updated Article ID: ${a.id} ➔ ${supabaseUrl}`);

    // Update corresponding Media records matching the dbUrl
    const matchingMedia = mediaRecords.filter(m => m.url === dbUrl);
    for (const m of matchingMedia) {
      await prisma.media.update({
        where: { id: m.id },
        data: { url: supabaseUrl }
      });
      updateCount++;
      console.log(`  📝 Updated Media ID: ${m.id} ➔ ${supabaseUrl}`);
    }
  }

  console.log(`\n🎉 Success! Uploaded ${uploadCount} files and updated ${updateCount} references in DB.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
