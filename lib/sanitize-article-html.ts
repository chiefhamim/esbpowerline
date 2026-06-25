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
  'sub',
  'sup',
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
    span: ['class', 'style'],
    div: ['class', 'style'],
    p: ['class', 'style'],
    h1: ['class'],
    h2: ['class'],
    h3: ['class'],
  },
  allowedStyles: {
    // Only allow safe, presentation-only CSS properties — no url(), expressions, or JS
    '*': {
      'font-size': [/^\d+(\.\d+)?(px|em|rem|%)$/],
      'font-family': [/^[a-zA-Z0-9 ,'"_-]+$/],
      color: [/^(#[0-9a-fA-F]{3,8}|rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)|[a-zA-Z]+)$/],
      'background-color': [/^(#[0-9a-fA-F]{3,8}|rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)|[a-zA-Z]+)$/],
      'text-align': [/^(left|right|center|justify)$/],
    },
  },
  // Block data: and javascript: URIs in all attributes
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: {
    img: ['http', 'https'], // no data: URIs in images
  },
  transformTags: {
    // Force external links to open safely
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }, true),
  },
  disallowedTagsMode: 'discard',
};

/** Strip scripts, event handlers, and other XSS vectors from rich article HTML. */
export function sanitizeArticleHtml(html: string): string {
  if (!html?.trim()) return '<p></p>';
  return sanitizeHtml(html, ARTICLE_SANITIZE_OPTIONS);
}