import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { AdminPageHeader, AdminCard, AdminSectionStack, AdminFilterTabs } from '@/components/admin/AdminUI';
import { CommentModerationTable } from '@/components/admin/CommentModerationTable';
import {
  getCommentModerationCounts,
  getCommentsForModeration,
  type CommentModerationStatus,
} from '@/lib/actions/comments';
import { cn } from '@/lib/utils';

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

const TABS: { id: CommentModerationStatus; label: string }[] = [
  { id: 'PENDING', label: 'Pending' },
  { id: 'APPROVED', label: 'Approved' },
  { id: 'SPAM', label: 'Spam' },
  { id: 'TRASH', label: 'Trash' },
  { id: 'ALL', label: 'All' },
];

export default async function AdminCommentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = (TABS.some((t) => t.id === params.status) ? params.status : 'PENDING') as CommentModerationStatus;

  const [comments, counts] = await Promise.all([
    getCommentsForModeration(status),
    getCommentModerationCounts(),
  ]);

  const emptyMessages: Record<CommentModerationStatus, string> = {
    PENDING: 'No comments awaiting review.',
    APPROVED: 'No approved comments in this view.',
    SPAM: 'No spam comments.',
    TRASH: 'No trashed comments.',
    ALL: 'No comments yet.',
  };

  return (
    <AdminSectionStack>
      <AdminPageHeader
        icon={MessageSquare}
        title="Comment Moderation"
        description="Review member discussion posts. Approved comments appear on public article pages."
      />

      <AdminFilterTabs>
        {TABS.map((tab) => {
          const count =
            tab.id === 'PENDING' ? counts.pending
            : tab.id === 'APPROVED' ? counts.approved
            : tab.id === 'SPAM' ? counts.spam
            : tab.id === 'TRASH' ? counts.trash
            : counts.total;
          return (
            <Link
              key={tab.id}
              href={`/admin/comments?status=${tab.id}`}
              className={cn(
                'admin-filter-tab',
                status === tab.id && 'admin-filter-tab--active',
              )}
            >
              {tab.label}
              <span className="admin-filter-tab__count">{count}</span>
            </Link>
          );
        })}
      </AdminFilterTabs>

      <AdminCard title={`${status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()} comments`}>
        <CommentModerationTable comments={comments} emptyMessage={emptyMessages[status]} />
      </AdminCard>
    </AdminSectionStack>
  );
}