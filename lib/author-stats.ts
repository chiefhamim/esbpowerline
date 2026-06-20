import 'server-only';

import prisma from '@/lib/prisma';
import { syncAuthorArticleCounts as syncAuthorArticleCountsCore } from '@/lib/author-stats-core';

export async function syncAuthorArticleCounts(authorId: string): Promise<void> {
  return syncAuthorArticleCountsCore(prisma, authorId);
}