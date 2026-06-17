import type { CSSProperties } from 'react';

export type HeroImageFilter = 'none' | 'warm' | 'cool' | 'mono' | 'contrast';
export type HeroFitMode = 'fit' | 'fill';

export type HeroImageMeta = {
  caption?: string;
  alt?: string;
  filter?: HeroImageFilter;
  /** fit = letterbox inside frame; fill = crop to cover frame */
  fitMode?: HeroFitMode;
  /** 100–200 — fine-tune zoom after fit/fill */
  zoom?: number;
};

const FILTER_STYLES: Record<HeroImageFilter, string> = {
  none: 'none',
  warm: 'sepia(0.22) saturate(1.15) brightness(1.03)',
  cool: 'saturate(0.9) hue-rotate(12deg) brightness(1.02)',
  mono: 'grayscale(1) contrast(1.05)',
  contrast: 'contrast(1.18) saturate(1.1)',
};

export function heroImageStyle(
  meta?: HeroImageMeta,
  options?: { animate?: boolean },
): CSSProperties {
  const fitMode = meta?.fitMode ?? 'fill';
  const zoom = Math.min(200, Math.max(100, meta?.zoom ?? 100)) / 100;
  const animate = options?.animate !== false;

  return {
    filter: FILTER_STYLES[meta?.filter ?? 'none'],
    objectFit: fitMode === 'fit' ? 'contain' : 'cover',
    objectPosition: 'center',
    transform: zoom !== 1 ? `scale(${zoom})` : undefined,
    transformOrigin: 'center center',
    transition: animate
      ? 'transform 140ms cubic-bezier(0.22, 1, 0.36, 1), object-fit 220ms ease, filter 180ms ease'
      : 'none',
  };
}