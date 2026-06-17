'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';

const PowerGridExplorer = dynamic(
  () => import('@/components/news/PowerGridExplorer').then((mod) => mod.PowerGridExplorer),
  {
    ssr: false,
    loading: () => (
      <div className="h-[28rem] rounded-2xl border border-border/50 bg-muted/15 animate-pulse" />
    ),
  },
);

export function PowerGridExplorerClient(props: ComponentProps<typeof PowerGridExplorer>) {
  return <PowerGridExplorer {...props} />;
}