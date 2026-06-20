const BLOCKED_UPLOAD_MIME_TYPES = new Set(['image/svg+xml', 'image/svg', 'text/svg', 'text/xml']);

export function isBlockedUploadMime(mimeType: string, fileName?: string): boolean {
  const normalized = mimeType.trim().toLowerCase();
  if (BLOCKED_UPLOAD_MIME_TYPES.has(normalized)) return true;
  if (fileName?.toLowerCase().endsWith('.svg')) return true;
  return false;
}

export function assertAllowedUploadMime(mimeType: string, fileName?: string): void {
  if (isBlockedUploadMime(mimeType, fileName)) {
    throw new Error('SVG uploads are not allowed');
  }
}