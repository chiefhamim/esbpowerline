import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';

/* ── Page header ── */
export function AdminPageHeader({
  title,
  description,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('admin-page-header', className)}>
      <div className="flex items-start gap-4 min-w-0">
        {Icon && (
          <div className="admin-page-icon shrink-0">
            <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="admin-page-title">{title}</h1>
          {description && <p className="admin-page-desc">{description}</p>}
        </div>
      </div>
      {children && <div className="admin-page-actions shrink-0">{children}</div>}
    </div>
  );
}

/* ── Stat card ── */
export function AdminStatCard({
  title,
  value,
  change,
  icon: Icon,
  accent = 'rose',
  className,
}: {
  title: string;
  value: string | number;
  change?: string;
  icon?: LucideIcon;
  accent?: 'rose' | 'violet' | 'emerald' | 'amber' | 'sky';
  className?: string;
}) {
  return (
    <div className={cn('admin-stat-card group', className)} data-accent={accent}>
      <div className="flex items-start justify-between gap-3">
        <span className="admin-stat-label">{title}</span>
        {Icon && (
          <div className="admin-stat-icon">
            <Icon className="h-[15px] w-[15px]" strokeWidth={2} />
          </div>
        )}
      </div>
      <div className="admin-stat-value">{value}</div>
      {change && <p className="admin-stat-change">{change}</p>}
    </div>
  );
}

/* ── Content card ── */
export function AdminCard({
  title,
  icon: Icon,
  action,
  children,
  className,
  bodyClassName,
  colSpan,
  style,
}: {
  title?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  colSpan?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={cn('admin-card', colSpan, className)} style={style}>
      {(title || action) && (
        <div className="admin-card-header">
          {title && (
            <div className="flex items-center gap-2.5 min-w-0">
              {Icon && (
                <span className="admin-card-icon">
                  <Icon className="h-[15px] w-[15px]" strokeWidth={2} />
                </span>
              )}
              <h2 className="admin-card-title">{title}</h2>
            </div>
          )}
          {action && <div className="admin-card-action shrink-0">{action}</div>}
        </div>
      )}
      <div className={cn('admin-card-body', bodyClassName)}>{children}</div>
    </div>
  );
}

/* ── Quick action pill ── */
export function AdminActionPill({
  href,
  label,
  icon: Icon,
  description,
  accent,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  description?: string;
  accent?: 'default' | 'emerald';
}) {
  return (
    <Link href={href} className={cn('admin-action-pill group', accent === 'emerald' && 'admin-action-pill--emerald')}>
      <span className="admin-action-icon">
        <Icon className="h-[15px] w-[15px]" strokeWidth={2} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="admin-action-label">{label}</span>
        {description && <span className="admin-action-desc">{description}</span>}
      </span>
      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all shrink-0" />
    </Link>
  );
}

/* ── Ranked list row ── */
export function AdminListRow({
  rank,
  title,
  href,
  meta,
  value,
}: {
  rank?: number;
  title: string;
  href?: string;
  meta?: string;
  value?: string | number;
}) {
  const content = (
    <>
      {rank !== undefined && <span className="admin-rank">{rank}</span>}
      <span className="flex-1 min-w-0 truncate admin-list-title">{title}</span>
      {meta && <span className="admin-list-meta hidden sm:inline">{meta}</span>}
      {value !== undefined && <span className="admin-list-value tabular-nums">{value}</span>}
    </>
  );

  if (href) {
    const external = href.startsWith('http');
    if (external) {
      return (
        <a href={href} target="_blank" rel="noreferrer" className="admin-list-row group">
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className="admin-list-row group">
        {content}
      </Link>
    );
  }

  return <div className="admin-list-row">{content}</div>;
}

/* ── Activity feed item ── */
export function AdminActivityItem({
  badge,
  date,
  message,
}: {
  badge: React.ReactNode;
  date: string;
  message: string;
}) {
  return (
    <div className="admin-activity-item">
      <div className="flex items-center gap-2 flex-wrap">
        {badge}
        <span className="admin-activity-date">{date}</span>
      </div>
      <p className="admin-activity-msg">{message}</p>
    </div>
  );
}

/* ── Table wrapper ── */
export function AdminTableShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('admin-table-shell', className)}>{children}</div>;
}

/* ── Metric row (key-value) ── */
export function AdminMetricRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn('admin-metric-row', highlight && 'admin-metric-row--highlight')}>
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

/* ── Tag capsule ── */
export function AdminTagCapsule({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('admin-tag-capsule', className)}>{children}</span>;
}

/* ── Form card ── */
export function AdminFormCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('admin-form-card', className)}>{children}</div>;
}

/* ── Loading state ── */
export function AdminLoading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="admin-loading">
      <div className="admin-loading-spinner" />
      <span>{label}</span>
    </div>
  );
}