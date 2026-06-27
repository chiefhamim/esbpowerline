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

  // 2. Check if direct cPanel upload is configured
  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;

  if (cdnUrl) {
    const form = new FormData();
    form.append('file', fileToUpload);
    form.append('folder', folder);

    // Direct upload to cPanel PHP script
    const res = await fetch(`${cdnUrl}/upload.php`, {
      method: 'POST',
      body: form,
    });

    if (!res.ok) {
      throw new Error('Direct upload to cPanel server failed');
    }

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'cPanel storage rejected the upload');
    }

    // Register file in Prisma database via lightweight API call
    const regForm = new FormData();
    regForm.append('registerOnly', 'true');
    regForm.append('url', data.url);
    regForm.append('name', fileToUpload.name);
    regForm.append('type', fileToUpload.type.startsWith('image/') ? 'image' : 'file');
    regForm.append('mimeType', fileToUpload.type);
    regForm.append('size', String(fileToUpload.size));

    const regRes = await fetch('/api/upload', {
      method: 'POST',
      body: regForm,
    });

    if (!regRes.ok) {
      throw new Error('Failed to register uploaded asset in database');
    }

    const regData = await regRes.json();
    return {
      url: regData.url,
      size: fileToUpload.size,
      mimeType: fileToUpload.type,
    };
  } else {
    // Fallback: standard upload via Vercel gateway
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
}
