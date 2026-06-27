import 'server-only';

import { mkdir, writeFile, unlink } from 'fs/promises';
import path from 'path';
import { createServiceRoleClient } from '@/lib/supabase/admin-client';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { mediaStorageBucket, storagePathFromUrl as storagePathFromUrlFor } from '@/lib/media-storage-url';
import { assertAllowedUploadMime } from '@/lib/upload-policy';
import { resolveSafeLocalUploadPath } from '@/lib/local-upload-path';
import * as ftp from 'basic-ftp';
import { Readable } from 'stream';

export type MediaStorageUploadResult = {
  url: string;
  storage: 'supabase' | 'local' | 'cpanel';
  storagePath: string | null;
};

export { isSupabaseStorageUrl, storagePathFromUrl } from '@/lib/media-storage-url';

function mediaBucket() {
  return mediaStorageBucket();
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
}

function supabasePublicUrl(storagePath: string) {
  const { url } = getSupabaseEnv();
  const bucket = mediaBucket();
  return `${url}/storage/v1/object/public/${bucket}/${storagePath}`;
}

function canUseSupabaseStorage() {
  const { isConfigured, serviceRoleKey } = getSupabaseEnv();
  return isConfigured && !!serviceRoleKey && !!createServiceRoleClient();
}

function canUseCpanelStorage() {
  return !!process.env.CPANEL_FTP_HOST;
}

async function uploadToCpanelFtp(buffer: Buffer, storagePath: string): Promise<string> {
  const client = new ftp.Client();
  client.ftp.verbose = false;
  try {
    await client.access({
      host: process.env.CPANEL_FTP_HOST,
      user: process.env.CPANEL_FTP_USER,
      password: process.env.CPANEL_FTP_PASSWORD,
      port: process.env.CPANEL_FTP_PORT ? parseInt(process.env.CPANEL_FTP_PORT, 10) : 21,
      secure: process.env.CPANEL_FTP_SECURE === 'true',
    });

    const baseDir = process.env.CPANEL_FTP_PATH || '/public_html/uploads';
    const parts = storagePath.split('/');
    const fileName = parts.pop()!;
    const subFolder = parts.join('/');
    
    const targetDir = `${baseDir}/${subFolder}`;
    await client.ensureDir(targetDir);

    const stream = Readable.from(buffer);
    await client.uploadFrom(stream, fileName);

    const cdnBase = process.env.NEXT_PUBLIC_CDN_URL || `https://cdn.esbpowerline.com`;
    return `${cdnBase}/${subFolder}/${fileName}`;
  } catch (err: any) {
    console.error('[cPanel FTP Error]:', err);
    throw new Error(`cPanel FTP Upload Failed: ${err.message}`);
  } finally {
    client.close();
  }
}

async function deleteFromCpanelFtp(url: string): Promise<void> {
  const cdnBase = process.env.NEXT_PUBLIC_CDN_URL || `https://cdn.esbpowerline.com`;
  if (!url.startsWith(cdnBase)) return;

  const client = new ftp.Client();
  client.ftp.verbose = false;
  try {
    await client.access({
      host: process.env.CPANEL_FTP_HOST,
      user: process.env.CPANEL_FTP_USER,
      password: process.env.CPANEL_FTP_PASSWORD,
      port: process.env.CPANEL_FTP_PORT ? parseInt(process.env.CPANEL_FTP_PORT, 10) : 21,
      secure: process.env.CPANEL_FTP_SECURE === 'true',
    });

    const pathPart = url.replace(cdnBase, '');
    const baseDir = process.env.CPANEL_FTP_PATH || '/public_html/uploads';
    const fullFtpPath = `${baseDir}${pathPart}`;

    await client.remove(fullFtpPath);
  } catch (err: any) {
    console.warn('[cPanel FTP Delete Warning]:', err.message);
  } finally {
    client.close();
  }
}

export async function uploadMediaBuffer(input: {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  folder?: 'library' | 'categories';
}): Promise<MediaStorageUploadResult> {
  assertAllowedUploadMime(input.mimeType, input.fileName);

  const folder = input.folder ?? 'library';
  const safeName = `${Date.now()}-${sanitizeFileName(input.fileName)}`;
  const storagePath = `${folder}/${safeName}`;

  if (canUseCpanelStorage()) {
    const url = await uploadToCpanelFtp(input.buffer, storagePath);
    return {
      url,
      storage: 'cpanel',
      storagePath,
    };
  }

  if (canUseSupabaseStorage()) {
    const admin = createServiceRoleClient()!;
    const { error } = await admin.storage.from(mediaBucket()).upload(storagePath, input.buffer, {
      contentType: input.mimeType,
      upsert: false,
    });
    if (error) throw new Error(`Storage upload failed: ${error.message}`);

    return {
      url: supabasePublicUrl(storagePath),
      storage: 'supabase',
      storagePath,
    };
  }

  const localDir =
    folder === 'categories'
      ? path.join(process.cwd(), 'public', 'uploads', 'categories')
      : path.join(process.cwd(), 'public', 'uploads');
  await mkdir(localDir, { recursive: true });

  const filePath = path.join(localDir, safeName);
  await writeFile(filePath, input.buffer);

  const url =
    folder === 'categories' ? `/uploads/categories/${safeName}` : `/uploads/${safeName}`;

  return { url, storage: 'local', storagePath: null };
}

export async function deleteStoredMedia(url: string): Promise<void> {
  if (canUseCpanelStorage()) {
    const cdnBase = process.env.NEXT_PUBLIC_CDN_URL || `https://cdn.esbpowerline.com`;
    if (url.startsWith(cdnBase)) {
      await deleteFromCpanelFtp(url);
      return;
    }
  }

  const { url: base } = getSupabaseEnv();
  const storagePath = storagePathFromUrlFor(url, base, mediaBucket());
  if (storagePath && canUseSupabaseStorage()) {
    const admin = createServiceRoleClient()!;
    const { error } = await admin.storage.from(mediaBucket()).remove([storagePath]);
    if (error) {
      console.warn('[deleteStoredMedia] Supabase remove failed:', error.message);
    }
    return;
  }

  const filePath = resolveSafeLocalUploadPath(url);
  if (filePath) {
    await unlink(filePath).catch(() => undefined);
  }
}