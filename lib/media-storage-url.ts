const DEFAULT_BUCKET = 'media';

export function mediaStorageBucket() {
  return process.env.SUPABASE_STORAGE_BUCKET?.trim() || DEFAULT_BUCKET;
}

export function isSupabaseStorageUrl(url: string, supabaseUrl: string, bucket = mediaStorageBucket()): boolean {
  if (!url || !supabaseUrl) return false;
  return url.startsWith(`${supabaseUrl}/storage/v1/object/public/${bucket}/`);
}

export function storagePathFromUrl(
  url: string,
  supabaseUrl: string,
  bucket = mediaStorageBucket(),
): string | null {
  if (!isSupabaseStorageUrl(url, supabaseUrl, bucket)) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx < 0) return null;
  return url.slice(idx + marker.length);
}