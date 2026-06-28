import { optimizeImageToWebP } from '@/lib/image-optimizer';

export async function uploadImageHelper(
  file: File,
  convertToWebp: boolean,
  folder: 'library' | 'categories' = 'library'
): Promise<{ url: string; size: number; mimeType: string }> {
  // 1. Optimize to WebP client-side if enabled
  const fileToUpload = convertToWebp && file.type.startsWith('image/') && file.type !== 'image/gif' && file.type !== 'image/svg+xml'
    ? await optimizeImageToWebP(file)
    : file;

  // Standard upload via Vercel gateway
  const form = new FormData();
  form.append('file', fileToUpload);
  form.append('folder', folder);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Upload failed');
  }

  const data = await res.json();
  return {
    url: data.url,
    size: fileToUpload.size,
    mimeType: fileToUpload.type,
  };
}
