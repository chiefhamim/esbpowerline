'use client';

import Link from 'next/link';
import type { ComponentProps, MouseEvent } from 'react';
import { resolveCrossSurfaceHref } from '@/lib/workspace-urls';

type CrossSurfaceLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

function navigateCrossSurface(href: string) {
  const resolved = resolveCrossSurfaceHref(href);
  if (resolved.startsWith('http')) {
    window.location.assign(resolved);
    return true;
  }
  return false;
}

/**
 * Keeps same-origin soft navigation for in-surface routes; uses a full load when
 * split dev would redirect across ports (avoids "Failed to fetch" RSC errors).
 */
export function CrossSurfaceLink({ href, children, onClick, prefetch = false, ...props }: CrossSurfaceLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (navigateCrossSurface(href)) {
      event.preventDefault();
    }
    onClick?.(event);
  };

  return (
    <Link href={href} prefetch={prefetch} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}