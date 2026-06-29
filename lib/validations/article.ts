import { z } from 'zod';

const articleStatusEnum = z.enum(['DRAFT', 'IN_REVIEW', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED', 'TRASH']);

const articleFields = {
  title: z.string(),
  shortTitle: z.string().optional().nullable(),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string(),
  category: z.string().min(1, 'Category is required'),
  status: articleStatusEnum,
  imageUrl: z.string().optional(),
  imageCredit: z.string().optional().nullable(),

  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isBreaking: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  isTrending: z.boolean().optional(),
  postAsNewsDesk: z.boolean().optional(),
  publishedAt: z.string().optional().nullable(),
  collaboratorIds: z.array(z.string()).optional(),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      focusKeyword: z.string().optional(),
      heroImage: z
        .object({
          caption: z.string().optional(),
          alt: z.string().optional(),
          filter: z.enum(['none', 'warm', 'cool', 'mono', 'contrast']).optional(),
          fitMode: z.enum(['fit', 'fill']).optional(),
          zoom: z.number().min(100).max(200).optional(),
        })
        .optional(),
    })
    .optional(),
};

export function stripArticleHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isArticleBodyEmpty(content: string): boolean {
  return stripArticleHtml(content).length === 0;
}

export const PUBLISH_SECTION_LABELS = {
  headline: 'Headline',
  excerpt: 'Deck / excerpt',
  content: 'Story content',
} as const;

export function requiresPublishValidation(status: string): boolean {
  return status === 'PUBLISHED' || status === 'SCHEDULED';
}

export function getPublishBlockers(input: {
  title: string;
  excerpt: string;
  content: string;
}): string[] {
  const blockers: string[] = [];
  if (input.title.trim().length < 3) {
    blockers.push(PUBLISH_SECTION_LABELS.headline);
  }
  if (input.excerpt.trim().length < 3) {
    blockers.push(PUBLISH_SECTION_LABELS.excerpt);
  }
  if (isArticleBodyEmpty(input.content)) {
    blockers.push(PUBLISH_SECTION_LABELS.content);
  }
  return blockers;
}

export function formatPublishBlockerMessage(blockers: string[]): string {
  return `Complete these sections before publishing: ${blockers.join(', ')}`;
}

/** Strict validation for publish / schedule flows */
export const publishArticleSchema = z.object({
  ...articleFields,
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3).optional(),
  excerpt: z.string().min(3, 'Deck must be at least 3 characters'),
  content: z.string().refine((value) => !isArticleBodyEmpty(value), 'Story content is required'),
  status: z.enum(['PUBLISHED', 'SCHEDULED']),
});

/** Relaxed validation — drafts can be saved incomplete */
export const draftArticleSchema = z.object({
  ...articleFields,
  title: z.string().default(''),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().default('<p></p>'),
  status: z.literal('DRAFT'),
});

export const articleSchema = z.object({
  ...articleFields,
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3).optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
});

export type ArticleInput = z.infer<typeof articleSchema>;

export function parseArticleInput(data: unknown): ArticleInput {
  const status = (data as { status?: string })?.status;

  if (status === 'DRAFT') {
    return draftArticleSchema.parse(data) as ArticleInput;
  }
  if (status === 'PUBLISHED' || status === 'SCHEDULED') {
    return publishArticleSchema.parse(data) as ArticleInput;
  }
  return articleSchema.parse(data);
}