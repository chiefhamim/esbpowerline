import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** CMS / revision timestamps — e.g. "Tue, Jun 16, 2026 at 3:45:02 PM" */
export function formatEditorialTimestamp(dateStr: string | Date): string {
  const date = new Date(dateStr);
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
  const body = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
  return `${weekday}, ${body} at ${time}`;
}

export function formatDate(dateStr: string | Date): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatExactDate(dateStr: string | Date): string {
  const date = new Date(dateStr);
  const now = new Date();
  
  const day = date.getDate();
  const suffix = ["th", "st", "nd", "rd"][day % 10 > 3 ? 0 : (day - day % 10 !== 10 ? day % 10 : 0)] || 'th';
  
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.toLocaleDateString('en-US', { year: '2-digit' });
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  
  const exact = `${day}${suffix} ${month}, '${year} at ${time}`;
  
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffDay < 30) {
    if (diffMin < 1) return `${exact} (Just now)`;
    if (diffMin < 60) return `${exact} (${diffMin} min ago)`;
    if (diffHr < 24) return `${exact} (${diffHr}h ago)`;
    return `${exact} (${diffDay}d ago)`;
  }
  
  return exact;
}

export function truncate(text: string, length = 120): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

/** Subcontinental grouping (en-IN): 15,000 · 13,40,606 */
export function formatNumber(num: number, maxFractionDigits = 0): string {
  if (!Number.isFinite(num)) return '0';
  return num.toLocaleString('en-IN', { maximumFractionDigits: maxFractionDigits });
}
