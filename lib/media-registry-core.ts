import type { PrismaClient } from '@prisma/client';

function inferMediaType(url: string, mimeType?: string | null): string {
  if (mimeType?.startsWith('image/')) return 'image';
  if (mimeType?.startsWith('video/')) return 'video';
  if (mimeType === 'application/pdf') return 'pdf';
  const lower = url.toLowerCase();
  if (/\.(jpe?g|png|gif|webp|avif|svg)(\?|$)/.test(lower)) return 'image';
  if (/\.(mp4|webm|mov)(\?|$)/.test(lower)) return 'video';
  if (/\.pdf(\?|$)/.test(lower)) return 'pdf';
  return 'image';
}

function mediaNameFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const base = pathname.split('/').pop() ?? 'asset';
    return decodeURIComponent(base).slice(0, 200) || 'asset';
  } catch {
    const segment = url.split('/').pop() ?? 'asset';
    return segment.split('?')[0].slice(0, 200) || 'asset';
  }
}

export async function registerMediaUrl(
  prisma: PrismaClient,
  opts: {
    url: string | null | undefined;
    uploadedById?: string | null;
    altText?: string | null;
    mimeType?: string | null;
    name?: string;
  },
): Promise<string | null> {
  const url = opts.url?.trim();
  if (!url) return null;

  const existing = await prisma.media.findFirst({ where: { url }, select: { id: true } });
  if (existing) return existing.id;

  const created = await prisma.media.create({
    data: {
      name: opts.name?.trim() || mediaNameFromUrl(url),
      url,
      type: inferMediaType(url, opts.mimeType),
      mimeType: opts.mimeType ?? null,
      uploadedById: opts.uploadedById ?? null,
      altText: opts.altText?.trim() || null,
    },
  });
  return created.id;
}

export async function registerArticleMedia(
  prisma: PrismaClient,
  opts: {
    imageUrl?: string | null;
    content?: string | null;
    uploadedById?: string | null;
    title?: string;
  },
): Promise<void> {
  await registerMediaUrl(prisma, {
    url: opts.imageUrl,
    uploadedById: opts.uploadedById,
    altText: opts.title,
    name: opts.title ? `${opts.title.slice(0, 80)} — cover` : undefined,
  });

  const content = opts.content ?? '';
  if (!content.includes('<img')) return;

  const matches = content.matchAll(/<img[^>]+src=["']([^"']+)["']/gi);
  for (const match of matches) {
    const src = match[1]?.trim();
    if (!src || src === opts.imageUrl) continue;
    await registerMediaUrl(prisma, { url: src, uploadedById: opts.uploadedById });
  }
}