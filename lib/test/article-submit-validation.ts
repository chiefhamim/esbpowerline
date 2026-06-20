/**
 * Article form payload validation helpers — test-only utilities.
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

export type ArticleSubmitValidationResult = {
  ok: boolean;
  payload: ArticleSubmitPayload;
  parsed: ArticleInput;
  errors: string[];
};

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

export function validateArticleSubmitPayload(data: unknown): ArticleSubmitValidationResult {
  const errors: string[] = [];

  const structural = articleSubmitPayloadSchema.safeParse(data);
  if (!structural.success) {
    return {
      ok: false,
      payload: data as ArticleSubmitPayload,
      parsed: data as ArticleInput,
      errors: structural.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
    };
  }
  const payload = structural.data;

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

    return { ok: errors.length === 0, payload, parsed, errors };
  } catch (e) {
    errors.push(e instanceof Error ? e.message : 'Schema validation failed');
    return { ok: false, payload, parsed: payload as unknown as ArticleInput, errors };
  }
}