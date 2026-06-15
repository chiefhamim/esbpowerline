export type SiteTheme = 'midnight' | 'dark' | 'white';

export type SiteThemePreview = {
  background: string;
  card: string;
  primary: string;
  muted: string;
  border: string;
  foreground: string;
};

export const SITE_THEMES: { id: SiteTheme; label: string; color: string }[] = [
  { id: 'midnight', label: 'Midnight', color: '#04070f' },
  { id: 'dark', label: 'Dark', color: '#09090b' },
  { id: 'white', label: 'White', color: '#f8fafc' },
];

/** Tooltip swatch — card/elevated surfaces read clearer than near-black page backgrounds */
export const SITE_THEME_PREVIEW: Record<SiteTheme, SiteThemePreview> = {
  midnight: {
    background: 'hsl(220 40% 11%)',
    card: 'hsl(220 40% 9.5%)',
    primary: 'hsl(217 91% 60%)',
    muted: 'hsl(215 20% 70%)',
    border: 'hsl(220 30% 22%)',
    foreground: 'hsl(210 40% 98%)',
  },
  dark: {
    background: 'hsl(240 4% 14%)',
    card: 'hsl(240 5% 9%)',
    primary: 'hsl(220 85% 57%)',
    muted: 'hsl(240 5% 65%)',
    border: 'hsl(240 5% 22%)',
    foreground: 'hsl(0 0% 96%)',
  },
  white: {
    background: 'hsl(210 40% 98%)',
    card: 'hsl(0 0% 100%)',
    primary: 'hsl(224 85% 42%)',
    muted: 'hsl(215 16% 40%)',
    border: 'hsl(214 32% 90%)',
    foreground: 'hsl(222 47% 11%)',
  },
};

const THEME_CLASSES = ['theme-midnight', 'theme-dark', 'theme-white'] as const;

export function applySiteTheme(theme: SiteTheme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove(...THEME_CLASSES);
  root.classList.add(`theme-${theme}`);
  localStorage.setItem('theme', theme);
}

export function getSavedSiteTheme(): SiteTheme {
  if (typeof window === 'undefined') return 'midnight';
  const saved = localStorage.getItem('theme') as SiteTheme | null;
  return saved && SITE_THEMES.some((t) => t.id === saved) ? saved : 'midnight';
}