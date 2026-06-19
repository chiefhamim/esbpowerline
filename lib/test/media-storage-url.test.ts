import { describe, it, expect } from 'vitest';
import { isSupabaseStorageUrl, storagePathFromUrl } from '@/lib/media-storage-url';

const BASE = 'https://abc.supabase.co';

describe('media storage URL helpers', () => {
  it('detects Supabase public object URLs', () => {
    const url = `${BASE}/storage/v1/object/public/media/library/123-photo.jpg`;
    expect(isSupabaseStorageUrl(url, BASE)).toBe(true);
    expect(storagePathFromUrl(url, BASE)).toBe('library/123-photo.jpg');
  });

  it('rejects local upload paths', () => {
    expect(isSupabaseStorageUrl('/uploads/photo.jpg', BASE)).toBe(false);
    expect(storagePathFromUrl('/uploads/photo.jpg', BASE)).toBeNull();
  });
});