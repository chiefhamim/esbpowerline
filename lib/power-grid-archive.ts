/**
 * Thin fallback archive — canonical daily reports live in public/data/daily/{YYYY-MM-DD}.json.
 * @deprecated Prefer `@/lib/data/grid/daily-loader` and `@/lib/data/grid/archive-fallback`.
 */
export type { GridDailyData } from '@/lib/data/grid/types';
export { powerGridArchive, getArchiveFallback } from '@/lib/data/grid/archive-fallback';