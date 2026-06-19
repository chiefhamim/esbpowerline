import type { CSSProperties } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Zap, Sun, Flame, Atom, Cable, Scale, Home, Gauge, Globe, TrendingUp, Tag,
  Leaf, Wind, Droplets, Factory, Building2, Truck, Ship, Train, Battery,
  Lightbulb, BarChart3, Shield, Landmark, Radio,
} from 'lucide-react';

export const CATEGORY_ICON_OPTIONS: { key: string; label: string; Icon: LucideIcon }[] = [
  { key: 'Zap', label: 'Power', Icon: Zap },
  { key: 'Sun', label: 'Solar', Icon: Sun },
  { key: 'Wind', label: 'Wind', Icon: Wind },
  { key: 'Flame', label: 'Gas', Icon: Flame },
  { key: 'Atom', label: 'Nuclear', Icon: Atom },
  { key: 'Cable', label: 'Grid', Icon: Cable },
  { key: 'Scale', label: 'Policy', Icon: Scale },
  { key: 'Home', label: 'Rural', Icon: Home },
  { key: 'Gauge', label: 'Efficiency', Icon: Gauge },
  { key: 'Globe', label: 'Global', Icon: Globe },
  { key: 'TrendingUp', label: 'Finance', Icon: TrendingUp },
  { key: 'Leaf', label: 'Green', Icon: Leaf },
  { key: 'Droplets', label: 'Hydro', Icon: Droplets },
  { key: 'Factory', label: 'Industrial', Icon: Factory },
  { key: 'Building2', label: 'Urban', Icon: Building2 },
  { key: 'Truck', label: 'Logistics', Icon: Truck },
  { key: 'Ship', label: 'Maritime', Icon: Ship },
  { key: 'Train', label: 'Rail', Icon: Train },
  { key: 'Battery', label: 'Storage', Icon: Battery },
  { key: 'Lightbulb', label: 'Ideas', Icon: Lightbulb },
  { key: 'BarChart3', label: 'Data', Icon: BarChart3 },
  { key: 'Shield', label: 'Safety', Icon: Shield },
  { key: 'Landmark', label: 'Government', Icon: Landmark },
  { key: 'Radio', label: 'Broadcast', Icon: Radio },
  { key: 'Tag', label: 'General', Icon: Tag },
];

const ICON_BY_KEY = Object.fromEntries(
  CATEGORY_ICON_OPTIONS.map((o) => [o.key, o.Icon])
) as Record<string, LucideIcon>;

const ICON_BY_NAME: Record<string, LucideIcon> = {
  'Energy Policy & Regulators': Scale,
  'Power Generation': Zap,
  'Fossil Fuels & Commodities': Flame,
  'Renewables & Nuclear': Sun,
  'Grid & Transmission': Cable,
  'Distribution & Utilities': Building2,
  'Consumers & Tariffs': Lightbulb,
  'Market, Finance & Subsidies': TrendingUp,
  'International & Cross-Border': Globe,
  'Environment & Efficiency': Leaf,
};

export function resolveCategoryIcon(iconKey?: string | null, fallbackName?: string): LucideIcon {
  if (iconKey && ICON_BY_KEY[iconKey]) return ICON_BY_KEY[iconKey];
  if (fallbackName && ICON_BY_NAME[fallbackName]) return ICON_BY_NAME[fallbackName];
  return Tag;
}

/** @deprecated use resolveCategoryIcon */
export function getCategoryIcon(name: string): LucideIcon {
  return resolveCategoryIcon(null, name);
}

export function hasCategoryColor(color?: string | null): color is string {
  return Boolean(color?.trim());
}

export function categoryColorVars(color?: string | null): CSSProperties | undefined {
  if (!hasCategoryColor(color)) return undefined;
  return { '--cat-color': color } as CSSProperties;
}

export function categoryTextStyle(color?: string | null): CSSProperties | undefined {
  if (!hasCategoryColor(color)) return undefined;
  return { color };
}

export function categoryIconWrapStyle(color?: string | null): CSSProperties | undefined {
  if (!hasCategoryColor(color)) return undefined;
  return {
    color,
    backgroundColor: `${color}18`,
    border: `1px solid ${color}30`,
  };
}

export function categoryUnderlineStyle(color?: string | null): CSSProperties | undefined {
  if (!hasCategoryColor(color)) return undefined;
  return { backgroundColor: color };
}

export function getCategoryTextClass(name: string, color?: string | null): string {
  if (hasCategoryColor(color)) return '';
  const lower = name.toLowerCase();
  if (lower.includes('generation')) return 'text-blue-400';
  if (lower.includes('renewable')) return 'text-emerald-400';
  if (lower.includes('lng') || lower.includes('gas') || lower.includes('fossil') || lower.includes('commodit')) return 'text-amber-400';
  if (lower.includes('nuclear')) return 'text-violet-400';
  if (lower.includes('grid') || lower.includes('transmission')) return 'text-cyan-400';
  if (lower.includes('policy')) return 'text-indigo-400';
  if (lower.includes('rural') || lower.includes('distribution') || lower.includes('utilit')) return 'text-lime-400';
  if (lower.includes('efficiency')) return 'text-teal-400';
  if (lower.includes('international')) return 'text-sky-400';
  if (lower.includes('market') || lower.includes('finance')) return 'text-rose-400';
  return 'text-primary';
}

export function getCategoryHoverBorderClass(name: string, color?: string | null): string {
  if (hasCategoryColor(color)) return 'category-card--custom';
  const lower = name.toLowerCase();
  if (lower.includes('generation')) return 'hover:border-blue-500/40';
  if (lower.includes('renewable')) return 'hover:border-emerald-500/40';
  if (lower.includes('lng') || lower.includes('gas') || lower.includes('fossil') || lower.includes('commodit')) return 'hover:border-amber-500/40';
  if (lower.includes('nuclear')) return 'hover:border-violet-500/40';
  if (lower.includes('grid') || lower.includes('transmission')) return 'hover:border-cyan-500/40';
  if (lower.includes('policy')) return 'hover:border-indigo-500/40';
  if (lower.includes('rural') || lower.includes('distribution') || lower.includes('utilit')) return 'hover:border-lime-500/40';
  if (lower.includes('efficiency')) return 'hover:border-teal-500/40';
  if (lower.includes('international')) return 'hover:border-sky-500/40';
  if (lower.includes('market') || lower.includes('finance')) return 'hover:border-rose-500/40';
  return 'hover:border-primary/40';
}

export function getCategoryHoverTextClass(name: string, color?: string | null): string {
  if (hasCategoryColor(color)) return 'category-text--custom';
  const lower = name.toLowerCase();
  if (lower.includes('generation')) return 'group-hover:text-blue-400';
  if (lower.includes('renewable')) return 'group-hover:text-emerald-400';
  if (lower.includes('lng') || lower.includes('gas') || lower.includes('fossil') || lower.includes('commodit')) return 'group-hover:text-amber-400';
  if (lower.includes('nuclear')) return 'group-hover:text-violet-400';
  if (lower.includes('grid') || lower.includes('transmission')) return 'group-hover:text-cyan-400';
  if (lower.includes('policy')) return 'group-hover:text-indigo-400';
  if (lower.includes('rural') || lower.includes('distribution') || lower.includes('utilit')) return 'group-hover:text-lime-400';
  if (lower.includes('efficiency')) return 'group-hover:text-teal-400';
  if (lower.includes('international')) return 'group-hover:text-sky-400';
  if (lower.includes('market') || lower.includes('finance')) return 'group-hover:text-rose-400';
  return 'group-hover:text-primary';
}

/** Solid accent for CMS/editor controls (navbar parity) */
export function getCategoryAccentColor(name: string, color?: string | null): string {
  if (hasCategoryColor(color)) return color;
  const ACCENTS: Record<string, string> = {
    'Energy Policy & Regulators': '#4f46e5',
    'Power Generation': '#2563eb',
    'Fossil Fuels & Commodities': '#d97706',
    'Renewables & Nuclear': '#059669',
    'Grid & Transmission': '#0891b2',
    'Distribution & Utilities': '#65a30d',
    'Consumers & Tariffs': '#dc2626',
    'Market, Finance & Subsidies': '#e11d48',
    'International & Cross-Border': '#0284c7',
    'Environment & Efficiency': '#0d9488',
  };
  return ACCENTS[name] ?? 'hsl(199 89% 48%)';
}

export function getNavbarColorClasses(name: string, color?: string | null) {
  if (hasCategoryColor(color)) {
    return {
      text: 'category-nav--custom',
      underline: 'category-nav-underline--custom',
      hoverBg: 'category-nav-cell--custom',
      activeBg: 'category-nav-cell--custom category-nav-cell--active',
      useCustom: true as const,
    };
  }
  const CATEGORY_COLORS: Record<string, { text: string; underline: string; hoverBg: string; activeBg: string }> = {
    'Energy Policy & Regulators': {
      text: 'text-indigo-600 dark:text-indigo-400',
      underline: 'bg-indigo-500',
      hoverBg: 'hover:bg-indigo-500/30',
      activeBg: 'bg-indigo-500/20',
    },
    'Power Generation': {
      text: 'text-blue-600 dark:text-blue-400',
      underline: 'bg-blue-500',
      hoverBg: 'hover:bg-blue-500/30',
      activeBg: 'bg-blue-500/20',
    },
    'Fossil Fuels & Commodities': {
      text: 'text-amber-600 dark:text-amber-400',
      underline: 'bg-amber-500',
      hoverBg: 'hover:bg-amber-500/30',
      activeBg: 'bg-amber-500/20',
    },
    'Renewables & Nuclear': {
      text: 'text-emerald-600 dark:text-emerald-400',
      underline: 'bg-emerald-500',
      hoverBg: 'hover:bg-emerald-500/30',
      activeBg: 'bg-emerald-500/20',
    },
    'Grid & Transmission': {
      text: 'text-cyan-600 dark:text-cyan-400',
      underline: 'bg-cyan-500',
      hoverBg: 'hover:bg-cyan-500/30',
      activeBg: 'bg-cyan-500/20',
    },
    'Distribution & Utilities': {
      text: 'text-lime-600 dark:text-lime-600',
      underline: 'bg-lime-500',
      hoverBg: 'hover:bg-lime-500/30',
      activeBg: 'bg-lime-500/20',
    },
    'Consumers & Tariffs': {
      text: 'text-red-600 dark:text-red-400',
      underline: 'bg-red-500',
      hoverBg: 'hover:bg-red-500/30',
      activeBg: 'bg-red-500/20',
    },
    'Market, Finance & Subsidies': {
      text: 'text-rose-600 dark:text-rose-400',
      underline: 'bg-rose-500',
      hoverBg: 'hover:bg-rose-500/30',
      activeBg: 'bg-rose-500/20',
    },
    'International & Cross-Border': {
      text: 'text-sky-600 dark:text-sky-400',
      underline: 'bg-sky-500',
      hoverBg: 'hover:bg-sky-500/30',
      activeBg: 'bg-sky-500/20',
    },
    'Environment & Efficiency': {
      text: 'text-teal-600 dark:text-teal-400',
      underline: 'bg-teal-500',
      hoverBg: 'hover:bg-teal-500/30',
      activeBg: 'bg-teal-500/20',
    },
  };
  return {
    ...(CATEGORY_COLORS[name] ?? {
      text: 'text-primary',
      underline: 'bg-primary',
      hoverBg: 'hover:bg-primary/30',
      activeBg: 'bg-primary/20',
    }),
    useCustom: false as const,
  };
}