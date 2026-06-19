import { describe, expect, it } from 'vitest';
import { canSubmitArticleForReview } from '@/lib/editorial-review';

describe('canSubmitArticleForReview', () => {
  const authorId = 'author-1';
  const userId = 'author-1';

  it('allows authors with article.create on their own draft', () => {
    expect(
      canSubmitArticleForReview({
        role: 'AUTHOR',
        userId,
        authorId,
        status: 'DRAFT',
      }),
    ).toBe(true);
  });

  it('denies authors on articles they do not own', () => {
    expect(
      canSubmitArticleForReview({
        role: 'AUTHOR',
        userId: 'other-user',
        authorId,
        status: 'DRAFT',
      }),
    ).toBe(false);
  });

  it('allows collaborators with article.create', () => {
    expect(
      canSubmitArticleForReview({
        role: 'CONTRIBUTOR',
        userId: 'collab-1',
        authorId,
        collaboratorIds: ['collab-1'],
        status: 'DRAFT',
      }),
    ).toBe(true);
  });

  it('allows editors with article.review on any draft', () => {
    expect(
      canSubmitArticleForReview({
        role: 'EDITOR',
        userId: 'editor-1',
        authorId,
        status: 'DRAFT',
      }),
    ).toBe(true);
  });

  it('blocks submit when already in review', () => {
    expect(
      canSubmitArticleForReview({
        role: 'AUTHOR',
        userId,
        authorId,
        status: 'IN_REVIEW',
      }),
    ).toBe(false);
  });

  it('blocks published articles', () => {
    expect(
      canSubmitArticleForReview({
        role: 'AUTHOR',
        userId,
        authorId,
        status: 'PUBLISHED',
      }),
    ).toBe(false);
  });
});