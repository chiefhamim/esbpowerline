'use client';

import { ExternalLink } from 'lucide-react';
import { usePublicArticleUrl } from '@/hooks/usePublicSiteOrigin';
import { cn } from '@/lib/utils';

export function LiveArticleLink({
  slug,
  className,
  children,
  title = 'View live',
  onClick,
}: {
  slug: string;
  className?: string;
  children?: React.ReactNode;
  title?: string;
  onClick?: () => void;
}) {
  const href = usePublicArticleUrl(slug);

  return (
    <a href={href} target="_blank" rel="noreferrer" className={className} title={title} onClick={onClick}>
      {children ?? <ExternalLink className="h-3 w-3" />}
    </a>
  );
}

export function LiveArticleTextLink({
  slug,
  title,
  className,
}: {
  slug: string;
  title: string;
  className?: string;
}) {
  const href = usePublicArticleUrl(slug);

  return (
    <a href={href} target="_blank" rel="noreferrer" className={cn('hover:underline', className)} title={title}>
      {title}
    </a>
  );
}