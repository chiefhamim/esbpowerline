'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

export type DatetimeMenuPlacement = 'above' | 'below';

export type DatetimeMenuRect = {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  placement: DatetimeMenuPlacement;
};

export function parseMenuWidth(width?: string, fallbackPx = 216): number {
  if (!width) return fallbackPx;
  const rem = width.match(/^([\d.]+)rem$/);
  if (rem) return parseFloat(rem[1]) * 16;
  const px = width.match(/^([\d.]+)px$/);
  if (px) return parseFloat(px[1]);
  return fallbackPx;
}

export function computeDatetimeMenuRect(
  trigger: DOMRect,
  menuWidthPx: number,
  menuMinHeight = 160,
): DatetimeMenuRect {
  const gap = 6;
  const pad = 8;
  const spaceBelow = window.innerHeight - trigger.bottom - gap;
  const openAbove = spaceBelow < menuMinHeight && trigger.top > spaceBelow + menuMinHeight;

  const idealLeft = trigger.left + (trigger.width - menuWidthPx) / 2;
  const left = Math.max(pad, Math.min(idealLeft, window.innerWidth - menuWidthPx - pad));

  if (openAbove) {
    return {
      bottom: window.innerHeight - trigger.top + gap,
      left,
      width: menuWidthPx,
      placement: 'above',
    };
  }

  return {
    top: trigger.bottom + gap,
    left,
    width: menuWidthPx,
    placement: 'below',
  };
}

export function datetimeMenuStyle(rect: DatetimeMenuRect | null): CSSProperties | undefined {
  if (!rect) return undefined;
  return {
    position: 'fixed',
    left: rect.left,
    width: rect.width,
    minWidth: rect.width,
    zIndex: 250,
    ...(rect.placement === 'above'
      ? { bottom: rect.bottom, top: 'auto' }
      : { top: rect.top, bottom: 'auto' }),
  };
}

export function useDatetimeMenuPosition(
  open: boolean,
  menuWidth: string | undefined,
  options?: { menuMinHeight?: number; fallbackWidthPx?: number },
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DatetimeMenuRect | null>(null);
  const menuMinHeight = options?.menuMinHeight ?? 160;
  const menuWidthPx = parseMenuWidth(menuWidth, options?.fallbackWidthPx ?? 216);

  useEffect(() => {
    if (!open || !rootRef.current) {
      setRect(null);
      return;
    }

    function update() {
      const el = rootRef.current;
      if (!el) return;
      setRect(computeDatetimeMenuRect(el.getBoundingClientRect(), menuWidthPx, menuMinHeight));
    }

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, menuWidthPx, menuMinHeight]);

  return { rootRef, rect, menuWidthPx };
}