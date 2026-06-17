import Link from 'next/link';
import { cn } from '@/lib/utils';
import { DevCompileHint } from '@/components/shared/DevCompileHint';

type LayoutProps = {
  children: React.ReactNode;
  className?: string;
};

type StatGridProps = LayoutProps & {
  cols?: 2 | 3 | 4;
};

type CardGridProps = LayoutProps & {
  cols?: 2 | 3;
};

export function StaffSectionStack({ children, className }: LayoutProps) {
  return <div className={cn('admin-section-stack', className)}>{children}</div>;
}

export function StaffStatGrid({ children, className, cols = 4 }: StatGridProps) {
  return (
    <div
      className={cn(
        'admin-stat-grid',
        cols === 3 && 'admin-stat-grid--cols-3',
        cols === 2 && 'admin-stat-grid--cols-2',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function StaffCardGrid({ children, className, cols = 2 }: CardGridProps) {
  return (
    <div
      className={cn(
        'admin-card-grid',
        cols === 3 && 'admin-card-grid--cols-3',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function StaffActionsGrid({ children, className }: LayoutProps) {
  return <div className={cn('admin-actions-grid', className)}>{children}</div>;
}

export function StaffListStack({ children, className }: LayoutProps) {
  return <div className={cn('admin-list-stack', className)}>{children}</div>;
}

export function StaffDenseList({ children, className }: LayoutProps) {
  return <div className={cn('admin-dense-list', className)}>{children}</div>;
}

export function StaffScheduleList({ children, className }: LayoutProps) {
  return <div className={cn('admin-schedule-list', className)}>{children}</div>;
}

export function StaffFilterTabs({ children, className }: LayoutProps) {
  return <div className={cn('admin-filter-tabs', className)}>{children}</div>;
}

export function StaffCardFooter({
  children,
  className,
  href,
  external,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  external?: boolean;
}) {
  const classes = cn('admin-card-footer', className);

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <div className={classes}>{children}</div>;
}

export function StaffPageSkeleton({ children, className }: LayoutProps) {
  return (
    <div className={cn('admin-page-skeleton animate-pulse', className)}>
      <DevCompileHint />
      {children}
    </div>
  );
}