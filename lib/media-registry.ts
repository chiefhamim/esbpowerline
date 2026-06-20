import 'server-only';

import prisma from '@/lib/prisma';
import {
  registerArticleMedia as registerArticleMediaCore,
  registerMediaUrl as registerMediaUrlCore,
} from '@/lib/media-registry-core';

export async function registerMediaUrl(
  opts: Parameters<typeof registerMediaUrlCore>[1],
): Promise<string | null> {
  return registerMediaUrlCore(prisma, opts);
}

export async function registerArticleMedia(
  opts: Parameters<typeof registerArticleMediaCore>[1],
): Promise<void> {
  return registerArticleMediaCore(prisma, opts);
}