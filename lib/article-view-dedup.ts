export const VIEW_DEDUP_HOURS = 24;

/** Rolling window bucket id — one view per visitor/article per bucket. */
export function viewDedupBucket(now = Date.now()): string {
  const bucketMs = VIEW_DEDUP_HOURS * 60 * 60 * 1000;
  return String(Math.floor(now / bucketMs));
}