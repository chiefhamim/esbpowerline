/** Editor-private trash retention — not visible to admins */

export const EDITOR_TRASH_RETENTION_DAYS = 7;

export function editorTrashExpiryDate(from = new Date()): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + EDITOR_TRASH_RETENTION_DAYS);
  return d;
}

export function daysUntilPurge(trashedAt: Date | string): number {
  const expiry = editorTrashExpiryDate(new Date(trashedAt)).getTime();
  const remaining = Math.ceil((expiry - Date.now()) / (1000 * 60 * 60 * 24));
  return Math.max(0, remaining);
}

export function purgeCutoffDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() - EDITOR_TRASH_RETENTION_DAYS);
  return d;
}