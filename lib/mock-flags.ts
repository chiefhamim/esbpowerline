/** QA mock switches — never active in production builds. */

export function isMockAnalyticsEnabled(): boolean {
  if (process.env.NODE_ENV === 'production') return false;
  return process.env.NEXT_PUBLIC_MOCK_ANALYTICS === 'true';
}

export function isMockArticleSubmitEnabled(): boolean {
  if (process.env.NODE_ENV === 'production') return false;
  return process.env.NEXT_PUBLIC_MOCK_ARTICLE_SUBMIT === 'true';
}