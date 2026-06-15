import Link from 'next/link';
import { Bookmark, Download, MessageSquare } from 'lucide-react';
import { AdminCard } from '@/components/admin/AdminUI';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { formatDate } from '@/lib/utils';
import type { UserMemberActivity } from '@/lib/actions/users';

export function MemberActivityPanel({ activity }: { activity: UserMemberActivity }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3 mb-8">
      <AdminCard title="Saved items" icon={Bookmark} bodyClassName="admin-card-body--dense">
        {activity.savedItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">No saved articles or magazine issues.</p>
        ) : (
          <ul className="space-y-2">
            {activity.savedItems.map((item) => (
              <li key={item.id} className="text-sm">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {item.itemType}
                </span>
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{formatDate(item.createdAt.toISOString())}</p>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>

      <AdminCard title="Comments" icon={MessageSquare} bodyClassName="admin-card-body--dense">
        {activity.comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No comments posted.</p>
        ) : (
          <ul className="space-y-3">
            {activity.comments.map((comment) => (
              <li key={comment.id} className="text-sm border-b border-border/40 pb-2 last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={comment.status} />
                  <span className="text-xs text-muted-foreground">
                    {formatDate(comment.createdAt.toISOString())}
                  </span>
                </div>
                <p className="text-foreground/90 line-clamp-2">{comment.content}</p>
                {comment.articleSlug ? (
                  <Link href={`/admin/comments?status=${comment.status}`} className="text-[11px] text-rose-400 hover:text-rose-300">
                    Moderate →
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        )}
        <Link href="/admin/comments" className="admin-analytics-link mt-3 inline-block">
          Open comment queue →
        </Link>
      </AdminCard>

      <AdminCard title="Downloads" icon={Download} bodyClassName="admin-card-body--dense">
        {activity.downloads.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data downloads yet.</p>
        ) : (
          <ul className="space-y-2">
            {activity.downloads.map((item) => (
              <li key={item.id} className="text-sm">
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{formatDate(item.createdAt.toISOString())}</p>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
    </div>
  );
}