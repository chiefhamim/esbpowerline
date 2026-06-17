const DESK_DISMISSED_KEY = 'esb-cms-desk-dismissed';

function readIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(DESK_DISMISSED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function writeIds(ids: string[]) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(DESK_DISMISSED_KEY, JSON.stringify([...new Set(ids)]));
}

export function getDeskDismissedIds(): Set<string> {
  return new Set(readIds());
}

export function dismissDeskNotices(ids: string[]) {
  const next = new Set(readIds());
  ids.forEach((id) => next.add(id));
  writeIds([...next]);
}

export function clearDeskSession() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(DESK_DISMISSED_KEY);
}