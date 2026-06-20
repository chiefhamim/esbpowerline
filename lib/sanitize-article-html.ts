import sanitizeHtml from 'sanitize-html';

const ARTICLE_ALLOWED_TAGS = [
  ...sanitizeHtml.defaults.allowedTags,
  'img',
  'h1',
  'h2',
  'figure',
  'figcaption',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'hr',
  'span',
  'div',
];

const ARTICLE_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ARTICLE_ALLOWED_TAGS,
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    a: ['href', 'name', 'target', 'rel'],
    td: ['colspan', 'rowspan', 'align'],
    th: ['colspan', 'rowspan', 'align'],
    table: ['class'],
    span: ['class'],
    div: ['class'],
    p: ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: {
    img: ['http', 'https'],
  },
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
  },
  disallowedTagsMode: 'discard',
};

/** Strip scripts, event handlers, and other XSS vectors from rich article HTML. */
export function sanitizeArticleHtml(html: string): string {
  if (!html?.trim()) return '<p></p>';
  return sanitizeHtml(html, ARTICLE_SANITIZE_OPTIONS);
}