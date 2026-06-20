import Link from 'next/link';
import { requireMemberSession } from '@/lib/member-auth';
import { getMemberComments } from '@/lib/actions/members';
import { formatDate } from '@/lib/utils';

export const metadata = {
  title: 'Comments | Member library',
};

const STATUS_LABELS: Record<string, string> = {
  APPROVED: 'Published',
  PENDING: 'Pending review',
  SPAM: 'Spam',
  TRASH: 'Removed',
};

export default async function MemberCommentsPage() {
  const session = await requireMemberSession();
  const comments = await getMemberComments();

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground max-w-2xl">
        Comments you post on articles appear here with moderation status. Published comments are visible on the article page.
      </p>

      {comments.length === 0 ? (
        <div className="member-empty">
          <p>You have not posted any comments yet.</p>
          <Link href="/articles" className="btn btn-primary text-sm mt-4">Read latest news</Link>
        </div>
      ) : (
        <ul className="member-comment-list">
          {comments.map((comment) => (
            <li key={comment.id} className="member-comment-card">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {comment.articleSlug ? (
                  <Link href={`/articles/${comment.articleSlug}`} className="font-medium text-foreground hover:text-primary">
                    {comment.articleTitle}
                  </Link>
                ) : (
                  <span className="font-medium text-foreground">{comment.articleTitle}</span>
                )}
                <span className={`member-comment-status member-comment-status--${comment.status.toLowerCase()}`}>
                  {STATUS_LABELS[comment.status] ?? comment.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{comment.content}</p>
              <p className="text-xs text-muted-foreground/80 mt-3">
                {formatDate(comment.createdAt.toISOString())}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}