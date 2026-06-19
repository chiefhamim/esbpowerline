/**
 * Dry-run article form submission for QA — validates payload shape,
 * logs JSON to the console, and returns a mock response without INSERT.
 *
 * Enable in the browser via NEXT_PUBLIC_MOCK_ARTICLE_SUBMIT=true.
 */

import { z } from 'zod';
import {
  draftArticleSchema,
  publishArticleSchema,
  parseArticleInput,
  type ArticleInput,
} from '@/lib/validations/article';

const coverPhotoUrlSchema = z
  .string()
  .url('Cover photo must be a valid URL')
  .optional()
  .or(z.literal(''));

export const articleSubmitPayloadSchema = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  content: z.string(),
  category: z.string().min(1),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED', 'TRASH', 'IN_REVIEW']),
  imageUrl: coverPhotoUrlSchema,
  tags: z.array(z.string()),
  collaboratorIds: z.array(z.string()).optional(),
  isFeatured: z.boolean(),
  isBreaking: z.boolean(),
  isPinned: z.boolean(),
  publishedAt: z.string().nullable().optional(),
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
});

export type ArticleSubmitPayload = z.infer<typeof articleSubmitPayloadSchema>;

export type MockArticleSubmitResult = {
  ok: boolean;
  payload: ArticleSubmitPayload;
  parsed: ArticleInput;
  errors: string[];
  mockId: string;
};

export { isMockArticleSubmitEnabled } from '@/lib/mock-flags';

/** Mirrors the object built inside ArticleForm.handleSubmit */
export function buildArticleSubmitPayload(input: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  status: ArticleSubmitPayload['status'];
  imageUrl?: string;
  tags: string[];
  collaboratorIds?: string[];
  isFeatured: boolean;
  isBreaking: boolean;
  isPinned: boolean;
  publishedAt?: string | null;
  seo?: ArticleSubmitPayload['seo'];
}): ArticleSubmitPayload {
  return {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    content: input.content,
    category: input.category,
    status: input.status,
    imageUrl: input.imageUrl || undefined,
    tags: input.tags,
    collaboratorIds: input.collaboratorIds,
    isFeatured: input.isFeatured,
    isBreaking: input.isBreaking,
    isPinned: input.isPinned,
    publishedAt: input.publishedAt ?? null,
    seo: input.seo,
  };
}

export function validateArticleSubmitPayload(data: unknown): MockArticleSubmitResult {
  const errors: string[] = [];
  let payload: ArticleSubmitPayload;

  const structural = articleSubmitPayloadSchema.safeParse(data);
  if (!structural.success) {
    return {
      ok: false,
      payload: data as ArticleSubmitPayload,
      parsed: data as ArticleInput,
      errors: structural.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
      mockId: '',
    };
  }
  payload = structural.data;

  try {
    const parsed = parseArticleInput(payload);
    if (payload.status === 'PUBLISHED' || payload.status === 'SCHEDULED') {
      const strict = publishArticleSchema.safeParse(payload);
      if (!strict.success) {
        errors.push(...strict.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`));
      }
    } else if (payload.status === 'DRAFT') {
      const relaxed = draftArticleSchema.safeParse(payload);
      if (!relaxed.success) {
        errors.push(...relaxed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`));
      }
    }

    if (payload.imageUrl && !coverPhotoUrlSchema.safeParse(payload.imageUrl).success) {
      errors.push('imageUrl: Cover photo must be a valid URL');
    }

    const mockId = `mock-${Date.now().toString(36)}`;

    return { ok: errors.length === 0, payload, parsed, errors, mockId };
  } catch (e) {
    errors.push(e instanceof Error ? e.message : 'Schema validation failed');
    return { ok: false, payload, parsed: payload as unknown as ArticleInput, errors, mockId: '' };
  }
}

/**
 * Intercepts a form submission: validates, logs exact JSON, returns mock ID.
 * Never calls createArticle / updateArticle.
 */
export async function mockArticleSubmit(data: unknown): Promise<MockArticleSubmitResult> {
  const result = validateArticleSubmitPayload(data);

  const logPayload = {
    mode: 'MOCK_SUBMIT',
    ok: result.ok,
    mockId: result.mockId,
    headline: result.payload?.title,
    coverPhotoUrl: result.payload?.imageUrl ?? null,
    category: result.payload?.category,
    status: result.payload?.status,
    errors: result.errors,
    payload: result.payload,
  };

  if (typeof window !== 'undefined') {
    console.group('[ESB QA] Article form — dry-run submit');
    console.log(JSON.stringify(logPayload, null, 2));
    console.groupEnd();
  } else {
    console.log('[ESB QA] Article form — dry-run submit\n', JSON.stringify(logPayload, null, 2));
  }

  if (!result.ok) {
    throw new Error(result.errors.join('; ') || 'Payload validation failed');
  }

  return result;
}