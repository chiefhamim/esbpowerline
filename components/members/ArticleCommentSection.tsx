'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { submitArticleComment } from '@/lib/actions/members';
import { toast } from 'sonner';

type CommentRow = {
  id: string;
  authorName: string;
  content: string;
  createdAt: Date;
};

export function ArticleCommentSection({
  articleId,
  articleSlug,
  signedIn,
  initialComments,
}: {
  articleId: string;
  articleSlug: string;
  signedIn: boolean;
  initialComments: CommentRow[];
}) {
  const [content, setContent] = useState('');
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    startTransition(async () => {
      try {
        await submitArticleComment(articleId, articleSlug, content);
        setContent('');
        toast.success('Comment submitted for review');
      } catch {
        toast.error('Could not submit comment');
      }
    });
  }

  return (
    <section className="member-comments">
      <h3 className="member-comments__title">Discussion</h3>

      {initialComments.length > 0 ? (
        <ul className="member-comments__list">
          {initialComments.map((comment) => (
            <li key={comment.id} className="member-comments__item">
              <div className="member-comments__meta">
                <span className="font-medium text-foreground">{comment.authorName}</span>
                <span>{formatDate(comment.createdAt.toISOString())}</span>
              </div>
              <p className="member-comments__body">{comment.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="member-comments__empty">No published comments yet. Be the first to join the discussion.</p>
      )}

      {signedIn ? (
        <form onSubmit={handleSubmit} className="member-comments__form">
          <label htmlFor="article-comment" className="sr-only">
            Your comment
          </label>
          <textarea
            id="article-comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="Share your perspective on this story…"
            className="member-comments__textarea"
            required
            minLength={3}
          />
          <p className="member-comments__hint">Comments are reviewed before they appear publicly.</p>
          <button type="submit" disabled={pending} className="btn btn-primary text-sm">
            {pending ? 'Submitting…' : 'Post comment'}
          </button>
        </form>
      ) : (
        <p className="member-comments__signin">
          <Link href={`/members/login?callbackUrl=${encodeURIComponent(`/articles/${articleSlug}`)}`} className="text-primary hover:underline">
            Sign in as a member
          </Link>{' '}
          to join the discussion.
        </p>
      )}
    </section>
  );
}