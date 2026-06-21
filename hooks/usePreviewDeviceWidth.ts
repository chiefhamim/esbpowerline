'use client';

import { useEffect, useState } from 'react';
import type { PreviewDevice } from '@/components/editor/ArticlePreviewPanel';

const TABLET_WIDTH = 768;
const MOBILE_WIDTH = 390;

export function usePreviewDeviceWidth(device: PreviewDevice, active: boolean) {
  const [desktopWidth, setDesktopWidth] = useState(1280);

  useEffect(() => {
    if (!active || device !== 'desktop') return;

    function measure() {
      setDesktopWidth(window.innerWidth);
    }

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [device, active]);

  if (device === 'desktop') {
    return { width: desktopWidth, label: `${desktopWidth}px · your screen` };
  }
  if (device === 'tablet') {
    return { width: TABLET_WIDTH, label: `${TABLET_WIDTH}px · tablet` };
  }
  return { width: MOBILE_WIDTH, label: `${MOBILE_WIDTH}px · smartphone` };
}