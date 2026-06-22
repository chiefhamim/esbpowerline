'use client';

import type { PreviewDevice } from '@/components/editor/ArticlePreviewPanel';

const DESKTOP_WIDTH = 1920;
const TABLET_WIDTH = 768;
const MOBILE_WIDTH = 390;

export function usePreviewDeviceWidth(device: PreviewDevice, _active: boolean) {
  if (device === 'desktop') {
    return { width: DESKTOP_WIDTH, label: `${DESKTOP_WIDTH}px · 24-27" monitor` };
  }
  if (device === 'tablet') {
    return { width: TABLET_WIDTH, label: `${TABLET_WIDTH}px · tablet` };
  }
  return { width: MOBILE_WIDTH, label: `${MOBILE_WIDTH}px · smartphone` };
}