import type { Prisma } from '@prisma/client';

/** Audit log types shown in admin “Recent activity” feeds (oversight & platform ops). */
export const ADMIN_AUDIT_LOG_WHERE: Prisma.AuditLogWhereInput = {
  OR: [
    { type: { startsWith: 'platform.' } },
    { type: { startsWith: 'user.' } },
    { type: { startsWith: 'category.' } },
    { type: { startsWith: 'comment.' } },
    { type: { startsWith: 'article.review_' } },
    { type: { startsWith: 'article.bulk_' } },
    { type: { startsWith: 'article.revision_' } },
    { type: { startsWith: 'media.' } },
    { type: { startsWith: 'settings.' } },
    { type: 'system' },
  ],
};

export function adminActivityBadgeLabel(type: string): string {
  const map: Record<string, string> = {
    'platform.revalidate': 'CACHE',
    'user.create': 'USER',
    'category.delete': 'CATEGORY',
    'comment.moderate': 'MODERATE',
    'article.review_submit': 'REVIEW',
    'article.review_approve': 'APPROVE',
    'article.review_publish': 'PUBLISH',
    'article.review_return': 'RETURN',
    'article.revision_request': 'REVISION',
    'media.replace': 'MEDIA',
    'settings.update': 'SETTINGS',
    system: 'SYSTEM',
  };
  if (map[type]) return map[type];
  if (type.startsWith('article.bulk_')) return 'BULK';
  if (type.startsWith('media.')) return 'MEDIA';
  if (type.startsWith('settings.')) return 'SETTINGS';
  const tail = type.split('.').pop();
  return (tail ?? 'ACTIVITY').replace(/_/g, ' ').toUpperCase().slice(0, 12);
}