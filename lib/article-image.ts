/** Normalize article/media image URLs — never fall back to demo placeholder files. */
export function normalizeArticleImageUrl(url?: string | null): string | null {
  const trimmed = url?.trim();
  return trimmed ? trimmed : null;
}

export function hasArticleImage(url?: string | null): url is string {
  return normalizeArticleImageUrl(url) !== null;
}