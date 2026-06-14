'use client';

import { useEffect, useState } from 'react';

export type ChartTheme = {
  trendStroke: string;
  trendFill: string;
  axisTick: string;
  hoverFill: string;
};

function readChartTheme(): ChartTheme {
  if (typeof document === 'undefined') {
    return {
      trendStroke: '#fafafa',
      trendFill: '#fafafa',
      axisTick: '#a1a1aa',
      hoverFill: 'rgba(255,255,255,0.07)',
    };
  }
  const isLight = document.documentElement.classList.contains('theme-white');
  return {
    trendStroke: isLight ? '#18181b' : '#fafafa',
    trendFill: isLight ? '#18181b' : '#fafafa',
    axisTick: isLight ? '#71717a' : '#a1a1aa',
    hoverFill: isLight ? 'rgba(24,24,27,0.06)' : 'rgba(255,255,255,0.07)',
  };
}

export function useChartTheme(): ChartTheme {
  const [theme, setTheme] = useState<ChartTheme>(readChartTheme);

  useEffect(() => {
    const sync = () => setTheme(readChartTheme());
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return theme;
}