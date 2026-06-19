import { can, type Role } from '@/lib/constants';

/** Whether the user may send this article to admin review (mirrors review-workflow server rules). */
export function canSubmitArticleForReview(input: {
  role: Role | undefined;
  userId: string | undefined;
  authorId: string;
  collaboratorIds?: string[];
  status: string;
}): boolean {
  const { role, userId, authorId, collaboratorIds = [], status } = input;
  if (!role || !userId) return false;
  if (!['DRAFT', 'IN_REVIEW'].includes(status)) return false;
  if (status === 'IN_REVIEW') return false;
  if (can(role, 'article.review')) return true;
  const isContributor =
    authorId === userId || collaboratorIds.includes(userId);
  return isContributor && can(role, 'article.create');
}