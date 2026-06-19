'use client';

import {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
  useSyncExternalStore,
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from '@/utils/supabase/auth-context';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

const TipTapEditor = dynamic(
  () => import('./TipTapEditor').then((m) => m.TipTapEditor),
  {
    ssr: false,
    loading: () => (
      <div className="tiptap-editor" aria-busy="true" aria-label="Loading editor">
        <div className="tiptap-toolbar tiptap-toolbar--loading" />
        <div className="tiptap-editor__body tiptap-editor__body--loading">
          <div className="h-4 w-3/4 rounded bg-muted/50 animate-pulse" />
          <div className="h-4 w-full rounded bg-muted/40 animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-muted/40 animate-pulse" />
        </div>
      </div>
    ),
  },
);
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CmsPlacementIcon } from '@/components/cms/CmsPlacementIcon';
import { CmsPlacementSwitch } from '@/components/cms/CmsPlacementSwitch';
import { PLACEMENT_FLAGS } from '@/lib/article-placement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createArticle, updateArticle } from '@/lib/actions/articles';
import { submitDraftForAdminReview } from '@/lib/actions/review-workflow';
import { can, type Role } from '@/lib/constants';
import { canSubmitArticleForReview } from '@/lib/editorial-review';
import type { PublicCategory } from '@/lib/category-types';
import { slugify } from '@/lib/utils';
import type { MediaItem } from '@/components/cms/MediaPicker';
import { FeaturedImageEditor } from '@/components/cms/FeaturedImageEditor';
import type { HeroImageMeta } from '@/lib/hero-image';
import { ArticlePreviewModal } from '@/components/editor/ArticlePreviewModal';
import { CmsFormSelect } from '@/components/cms/CmsFormSelect';
import { CmsCategorySelect } from '@/components/cms/CmsCategorySelect';
import { CmsDateTimePicker } from '@/components/cms/CmsDateTimePicker';
import { ModernTooltip } from '@/components/shared/ModernTooltip';
import { CharBudgetHint } from '@/components/editor/CharBudgetHint';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { LiveArticleLink } from '@/components/shared/LiveArticleLink';
import { ArticleAuthorSticky } from '@/components/shared/ArticleAuthorSticky';
import { EditorCollaborators } from '@/components/editor/EditorCollaborators';
import { HEADLINE_BUDGET, EXCERPT_BUDGET, SLUG_BUDGET } from '@/lib/editorial-limits';
import {
  formatPublishBlockerMessage,
  getPublishBlockers,
  requiresPublishValidation,
  stripArticleHtml,
} from '@/lib/validations/article';
import { useCmsArticleEditor } from '@/components/cms/CmsArticleEditorContext';
import { useEditorPreferences } from '@/components/cms/EditorPreferencesProvider';
import { datetimeLocalToISO, toDatetimeLocal } from '@/lib/datetime-local';
import {
  Eye, Save, Send, Clock, Sparkles, Tag, Layers, Globe, FileText,
  FolderOpen, Archive, Link2, PenLine, ShieldCheck,
} from 'lucide-react';

type ArticleFormPermissions = {
  canPublish?: boolean;
  canFeature?: boolean;
  canBreaking?: boolean;
  canPin?: boolean;
};

interface ArticleFormProps {
  mode: 'create' | 'edit';
  permissions?: ArticleFormPermissions;
  mediaItems?: MediaItem[];
  writeMeta?: {
    title: string;
    subtitle?: string;
    status?: string;
    showLiveLink?: boolean;
    showBackLink?: boolean;
  };
  article?: {
    id: string;
    authorId?: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
    category: string;
    status: string;
    imageUrl?: string | null;
    tags?: unknown;
    collaboratorIds?: unknown;
    isFeatured: boolean;
    isBreaking: boolean;
    isPinned?: boolean;
    publishedAt?: string | Date | null;
    seo?: unknown;
  };
}

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft', description: 'Work in progress, not visible' },
  { value: 'IN_REVIEW', label: 'In review', description: 'Awaiting admin approval' },
  { value: 'PUBLISHED', label: 'Published', description: 'Live on the public site' },
  { value: 'SCHEDULED', label: 'Scheduled', description: 'Go live when date passes (cron or manual publish)' },
  { value: 'ARCHIVED', label: 'Archived', description: 'Removed from live site' },
];



export function ArticleForm({
  mode,
  article,
  categories = [],
  mediaItems = [],
  permissions = {},
  writeMeta,
}: ArticleFormProps & { categories?: Pick<PublicCategory, 'name' | 'color' | 'icon' | 'iconImageUrl'>[] }) {
  const {
    canPublish = true,
    canFeature = true,
    canBreaking = true,
    canPin = true,
  } = permissions;
  const categoryOptions = categories.map((c) => c.name);
  const hasCategories = categoryOptions.length > 0;
  const router = useRouter();
  const { data: session } = useSession();
  const editorCtx = useCmsArticleEditor();
  const { showGuidanceHints } = useEditorPreferences();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState('');
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');

  const [title, setTitle] = useState(article?.title ?? '');
  const [slug, setSlug] = useState(article?.slug ?? '');
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? '');
  const [content, setContent] = useState(article?.content ?? '<p></p>');
  const [category, setCategory] = useState(() => {
    const initial = article?.category;
    if (initial && categoryOptions.includes(initial)) return initial;
    return categoryOptions[0] ?? '';
  });
  const [status, setStatus] = useState(article?.status ?? 'DRAFT');
  const [imageUrl, setImageUrl] = useState(article?.imageUrl ?? '');
  const [tags, setTags] = useState(((article?.tags as string[]) ?? []).join(', '));
  const [collaboratorIds, setCollaboratorIds] = useState<string[]>(
    Array.isArray(article?.collaboratorIds)
      ? (article.collaboratorIds as string[])
      : [],
  );
  const [autosaveError, setAutosaveError] = useState<string | null>(null);
  const [isFeatured, setIsFeatured] = useState(article?.isFeatured ?? false);
  const [isBreaking, setIsBreaking] = useState(article?.isBreaking ?? false);
  const [isPinned, setIsPinned] = useState(article?.isPinned ?? false);
  const [publishedAt, setPublishedAt] = useState(() => toDatetimeLocal(article?.publishedAt));
  const articleSeo = (article?.seo ?? {}) as {
    metaTitle?: string;
    metaDescription?: string;
    focusKeyword?: string;
    heroImage?: HeroImageMeta;
  };
  const [metaTitle, setMetaTitle] = useState(articleSeo.metaTitle ?? '');
  const [metaDescription, setMetaDescription] = useState(articleSeo.metaDescription ?? '');
  const [focusKeyword, setFocusKeyword] = useState(articleSeo.focusKeyword ?? '');
  const [heroMeta, setHeroMeta] = useState<HeroImageMeta>(articleSeo.heroImage ?? {});

  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const defaultPublishedAtRef = useRef('');
  if (!publishedAt && isClient && !defaultPublishedAtRef.current) {
    defaultPublishedAtRef.current = toDatetimeLocal(new Date());
  }
  const resolvedPublishedAt = publishedAt || defaultPublishedAtRef.current;
  const authorName = session?.user?.name ?? 'ESB Staff';
  const readTime = useMemo(
    () => Math.max(1, Math.ceil(stripArticleHtml(content).length / 1000)),
    [content],
  );

  const role = session?.user?.role as Role | undefined;
  const canSubmitForReview = canSubmitArticleForReview({
    role,
    userId: session?.user?.id,
    authorId: article?.authorId ?? '',
    collaboratorIds,
    status,
  });

  const statusSelectOptions = useMemo(() => {
    return STATUS_OPTIONS.filter((opt) => {
      if (opt.value === 'PUBLISHED' || opt.value === 'SCHEDULED') return canPublish;
      if (opt.value === 'IN_REVIEW') {
        return status === 'IN_REVIEW' || can(role, 'admin.access');
      }
      return true;
    });
  }, [canPublish, role, status]);

  const buildSavePayload = useCallback(
    (saveStatus: string) => ({
      title,
      slug: slug || slugify(title),
      excerpt,
      content,
      category,
      status: saveStatus as 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED' | 'TRASH' | 'IN_REVIEW',
      imageUrl: imageUrl || undefined,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      collaboratorIds,
      isFeatured,
      isBreaking,
      isPinned,
      publishedAt: resolvedPublishedAt ? datetimeLocalToISO(resolvedPublishedAt) : null,
      seo: { metaTitle, metaDescription, focusKeyword, heroImage: heroMeta },
    }),
    [
      title, slug, excerpt, content, category, imageUrl, tags, collaboratorIds,
      isFeatured, isBreaking, isPinned, resolvedPublishedAt, metaTitle, metaDescription,
      focusKeyword, heroMeta,
    ],
  );

  const handleSubmitForReview = useCallback(async () => {
    if (!article) return;
    setLoading(true);
    try {
      await updateArticle(article.id, buildSavePayload('DRAFT'));
      await submitDraftForAdminReview(article.id, reviewNote.trim() || undefined);
      setStatus('IN_REVIEW');
      setReviewDialogOpen(false);
      setReviewNote('');
      toast.success('Draft saved and sent to admin for review');
      router.refresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Could not submit for review');
    } finally {
      setLoading(false);
    }
  }, [article, buildSavePayload, reviewNote, router]);

  const handleTitleChange = useCallback((value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }, [slugTouched]);

  const handleSlugChange = useCallback((value: string) => {
    setSlugTouched(true);
    setSlug(slugify(value));
  }, []);

  const handleSubmit = useCallback(async (publishStatus?: string) => {
    const finalStatus = (publishStatus ?? status) as string;

    if (!hasCategories || !category.trim()) {
      toast.error('Choose a category from the admin list before saving.');
      return;
    }

    if (requiresPublishValidation(finalStatus)) {
      const blockers = getPublishBlockers({ title, excerpt, content });
      if (blockers.length > 0) {
        toast.error(formatPublishBlockerMessage(blockers), {
          description: 'Add a headline, deck, and story body before publishing or scheduling.',
        });
        return;
      }
    }

    setLoading(true);
    editorCtx?.setLoading(true);
    try {
      const data = buildSavePayload(finalStatus);

      if (mode === 'create') {
        const created = await createArticle(data);
        setStatus(finalStatus);
        toast.success(
          finalStatus === 'PUBLISHED'
            ? 'Article published'
            : finalStatus === 'SCHEDULED'
              ? 'Article scheduled'
              : 'Article created',
        );
        router.push(`/cms/articles/${created.id}/edit`);
      } else if (article) {
        await updateArticle(article.id, data);
        setStatus(finalStatus);
        toast.success(
          finalStatus === 'PUBLISHED'
            ? 'Article published'
            : finalStatus === 'SCHEDULED'
              ? 'Article scheduled'
              : 'Article saved',
        );
        router.refresh();
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setLoading(false);
      editorCtx?.setLoading(false);
    }
  }, [
    article, buildSavePayload, editorCtx, mode, router, status,
  ]);

  useEffect(() => {
    editorCtx?.registerSave(() => handleSubmit());
    return () => editorCtx?.registerSave(null);
  }, [editorCtx, handleSubmit]);

  useEffect(() => {
    if (mode === 'edit' && status === 'DRAFT' && article) {
      const interval = setInterval(() => {
        updateArticle(article.id, buildSavePayload('DRAFT'))
          .then(() => setAutosaveError(null))
          .catch((err: unknown) => {
            const message = err instanceof Error ? err.message : 'Autosave failed';
            setAutosaveError(message);
          });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [mode, status, article, buildSavePayload]);

  const heroTitle = writeMeta?.title ?? (mode === 'create' ? 'New story' : 'Edit story');
  const heroSubtitle = writeMeta?.subtitle
    ?? (mode === 'create'
      ? 'Headline, body, media, SEO, and publish settings — one editorial flow.'
      : 'Update copy, placement, and publish settings.');

  return (
    <div className="cms-article-editor">
      <section className="cms-editor-panel cms-write-hero">
        <div className="cms-write-hero__inner">
          <div className="cms-write-hero__icon">
            <PenLine className="h-4 w-4" strokeWidth={2.25} />
          </div>
          <div className="cms-write-hero__copy min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="cms-write-hero__title">{heroTitle}</h1>
              {writeMeta?.status ? (
                <StatusBadge status={writeMeta.status} />
              ) : (
                <span className="cms-write-page__badge">
                  <Sparkles className="h-3 w-3" /> Editorial Suite
                </span>
              )}
            </div>
            <p className="cms-write-hero__desc">{heroSubtitle}</p>
            {(writeMeta?.showLiveLink || writeMeta?.showBackLink) && (
              <div className="cms-write-hero__extras">
                {writeMeta.showLiveLink && article?.slug ? (
                  <LiveArticleLink slug={article.slug} className="cms-write-hero__link" />
                ) : null}
                {writeMeta.showBackLink ? (
                  <Link href="/cms/articles" className="cms-write-hero__link">
                    ← All articles
                  </Link>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="cms-article-editor__workspace">
        <div className="cms-article-editor__main">
        <section className="cms-editor-panel cms-article-editor__headline">
          <div className="cms-editor-panel__head">
            <FileText className="h-4 w-4 text-sky-500" />
            <div>
              <h2 className="cms-editor-panel__title">Headline &amp; deck</h2>
              <p className="cms-editor-panel__desc">Sized for hero carousel, cards, and social</p>
            </div>
          </div>
          <div className="cms-editor-panel__body cms-editor-panel__body--stack">
            {(canFeature || canBreaking || canPin) && (
              <div className="cms-placement-strip">
                <div className="cms-placement-strip__head">
                  <Sparkles className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                  <span className="cms-placement-strip__title">Placement</span>
                  <span className="cms-placement-strip__desc">Carousel (featured/breaking) or All Coverage pin</span>
                </div>
                <div className="cms-placement-strip__grid">
                  {canFeature && (
                    <div className="cms-placement-row cms-placement-row--strip">
                      <div className="cms-placement-row__copy">
                        <CmsPlacementIcon type="featured" />
                        <div className="min-w-0">
                          <span className="cms-placement-row__label">{PLACEMENT_FLAGS.featured.label}</span>
                          <span className="cms-placement-row__hint">{PLACEMENT_FLAGS.featured.hint}</span>
                        </div>
                      </div>
                      <CmsPlacementSwitch
                        checked={isFeatured}
                        onCheckedChange={(v) => {
                          setIsFeatured(v);
                          if (v) setIsPinned(false);
                        }}
                        accent="amber"
                        aria-label={PLACEMENT_FLAGS.featured.label}
                      />
                    </div>
                  )}
                  {canBreaking && (
                    <div className="cms-placement-row cms-placement-row--strip">
                      <div className="cms-placement-row__copy">
                        <CmsPlacementIcon type="breaking" />
                        <div className="min-w-0">
                          <span className="cms-placement-row__label">{PLACEMENT_FLAGS.breaking.label}</span>
                          <span className="cms-placement-row__hint">{PLACEMENT_FLAGS.breaking.hint}</span>
                        </div>
                      </div>
                      <CmsPlacementSwitch
                        checked={isBreaking}
                        onCheckedChange={setIsBreaking}
                        accent="red"
                        aria-label={PLACEMENT_FLAGS.breaking.label}
                      />
                    </div>
                  )}
                  {canPin && (
                    <div className="cms-placement-row cms-placement-row--strip">
                      <div className="cms-placement-row__copy">
                        <CmsPlacementIcon type="pin" />
                        <div className="min-w-0">
                          <span className="cms-placement-row__label">{PLACEMENT_FLAGS.pin.label}</span>
                          <span className="cms-placement-row__hint">{PLACEMENT_FLAGS.pin.hint}</span>
                        </div>
                      </div>
                      <CmsPlacementSwitch
                        checked={isPinned}
                        onCheckedChange={(v) => {
                          setIsPinned(v);
                          if (v) setIsFeatured(false);
                        }}
                        accent="violet"
                        aria-label={PLACEMENT_FLAGS.pin.label}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="cms-field">
              <div className="cms-field__label-row">
                <label htmlFor="title" className="cms-field__label">Headline</label>
                <CharBudgetHint length={title.length} budget={HEADLINE_BUDGET} />
              </div>
              <Textarea
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="cms-field__input cms-field__input--headline"
                placeholder={!showGuidanceHints ? "Headline" : "Write a compelling headline…"}
                maxLength={HEADLINE_BUDGET.max + 20}
                rows={2}
              />
              <span className="cms-field__hint">Drag corner to expand — keep within ideal length for carousel</span>
            </div>
            <div className="cms-field">
              <div className="cms-field__label-row">
                <label htmlFor="excerpt" className="cms-field__label">Deck / excerpt</label>
                <CharBudgetHint length={excerpt.length} budget={EXCERPT_BUDGET} />
              </div>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="cms-field__input cms-field__input--deck resize-y min-h-[4.5rem]"
                rows={3}
                placeholder={!showGuidanceHints ? "Deck / excerpt" : "Summary for hero carousel, homepage cards, and social"}
                maxLength={EXCERPT_BUDGET.max + 30}
              />
            </div>
          </div>
        </section>

        <section className="cms-editor-panel cms-editor-panel--body cms-article-editor__story">
          <Tabs defaultValue="editor" className="cms-editor-tabs cms-editor-tabs--fill">
            <div className="cms-editor-panel__head cms-editor-panel__head--tabs">
              <div className="flex items-center gap-2 min-w-0">
                <Layers className="h-4 w-4 text-sky-500 shrink-0" />
                <div className="min-w-0">
                  <h2 className="cms-editor-panel__title">Story content</h2>
                  <p className="cms-editor-panel__desc hidden sm:block">Grows automatically as you write and paste</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <TabsList className="cms-story-tabs h-9">
                  <TabsTrigger value="editor" className="cms-story-tabs__btn cms-story-tabs__btn--body text-xs gap-1.5 px-3">
                    <FileText className="h-3.5 w-3.5" /> Body
                  </TabsTrigger>
                  <TabsTrigger value="seo" className="cms-story-tabs__btn cms-story-tabs__btn--seo text-xs gap-1.5 px-3">
                    <Globe className="h-3.5 w-3.5" /> SEO
                  </TabsTrigger>
                </TabsList>
                <ModernTooltip label="Preview" hint="See how readers will see it" variant="editor" fast side="top">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setPreview(true)} className="h-9 text-xs shrink-0">
                    <Eye className="h-3.5 w-3.5 mr-1.5" /> Preview
                  </Button>
                </ModernTooltip>
              </div>
            </div>

            <TabsContent value="editor" className="cms-editor-panel__body cms-editor-panel__body--fill mt-0">
              <EditorCollaborators 
                authorName={authorName} 
                collaboratorIds={collaboratorIds} 
                onChange={setCollaboratorIds} 
              />
              <div className="cms-editor-surface cms-editor-surface--resizable cms-editor-surface--aligned mt-2">
                <TipTapEditor content={content} onChange={setContent} minBodyHeight={320} />
              </div>
            </TabsContent>

            <TabsContent value="seo" className="cms-editor-panel__body cms-editor-panel__body--stack mt-0">
              <div className="cms-field">
                <label className="cms-field__label">Meta title</label>
                <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="cms-field__input" placeholder={title || 'Defaults to headline'} />
              </div>
              <div className="cms-field">
                <label className="cms-field__label">Meta description</label>
                <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} className="cms-field__input resize-y min-h-[5rem]" rows={3} placeholder="~155 characters for search snippets" />
                <span className="cms-field__hint cms-field__hint--keep">{metaDescription.length} characters</span>
              </div>
              <div className="cms-field">
                <label className="cms-field__label">Focus keyword</label>
                <Input value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} className="cms-field__input" placeholder="e.g. solar policy Bangladesh" />
              </div>
              <div className="cms-field">
                <div className="cms-field__label-row">
                  <label htmlFor="slug" className="cms-field__label flex items-center gap-1.5">
                    <Link2 className="h-3 w-3" /> URL slug
                  </label>
                  <CharBudgetHint length={slug.length} budget={SLUG_BUDGET} />
                </div>
                <div className="cms-slug-field">
                  <span className="cms-slug-field__prefix">/articles/</span>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    className="cms-field__input cms-slug-field__input font-mono text-sm"
                    placeholder="auto-from-headline"
                    maxLength={SLUG_BUDGET.max}
                  />
                </div>
                {!slugTouched && title && (
                  <span className="cms-field__hint">Auto-generated from headline — edit to customize</span>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </section>
        </div>

        <aside className="cms-article-editor__sidebar">
        <section className="cms-sidebar-card cms-article-editor__publish">
          <div className="cms-sidebar-card__head">
            <Send className="h-4 w-4" />
            <h3>Publish</h3>
          </div>
          <div className="cms-sidebar-card__body">
            <div className="cms-field">
              <label className="cms-field__label">Status</label>
              <CmsFormSelect
                value={status}
                onChange={setStatus}
                options={statusSelectOptions}
                placeholder="Status"
                menuTitle="Article status"
              />
            </div>
            {canPublish && (
              <div className="cms-field cms-field--datetime">
                <label className="cms-field__label flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  {status === 'SCHEDULED'
                    ? 'Go live at'
                    : status === 'PUBLISHED'
                      ? 'Publish date'
                      : 'Go-live date'}
                </label>
                <CmsDateTimePicker value={resolvedPublishedAt} onChange={setPublishedAt} />
              </div>
            )}
            <div className="cms-publish-actions cms-publish-actions--sidebar">
              <Button onClick={() => handleSubmit()} disabled={loading || !hasCategories} className="cms-publish-btn w-full">
                <Save className="h-4 w-4" />
                {loading ? 'Saving…' : 'Save changes'}
              </Button>
              {canPublish && (
                <>
                  <Button variant="secondary" onClick={() => handleSubmit('PUBLISHED')} disabled={loading} className="cms-publish-btn cms-publish-btn--publish w-full">
                    <Send className="h-4 w-4" /> Publish now
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSubmit('SCHEDULED')}
                    disabled={loading}
                    className="cms-publish-btn cms-publish-btn--schedule w-full"
                  >
                    <Clock className="h-4 w-4" /> Schedule
                  </Button>
                </>
              )}
              {mode === 'edit' && status === 'PUBLISHED' && (
                <Button
                  variant="ghost"
                  onClick={() => handleSubmit('DRAFT')}
                  disabled={loading}
                  className="cms-publish-btn w-full text-muted-foreground"
                >
                  <Archive className="h-4 w-4" /> Move to draft
                </Button>
              )}
              {canSubmitForReview && article && status !== 'IN_REVIEW' && (
                <Button
                  variant="outline"
                  onClick={() => setReviewDialogOpen(true)}
                  disabled={loading}
                  className="cms-publish-btn cms-publish-btn--review w-full"
                >
                  <ShieldCheck className="h-4 w-4" /> Send to admin for review
                </Button>
              )}
              {status === 'IN_REVIEW' && (
                <p className="cms-field__hint text-center">
                  Awaiting admin sign-off. You will be notified in Editorial when approved or returned.
                </p>
              )}
              {autosaveError && status === 'DRAFT' && (
                <p className="cms-field__hint text-center text-destructive">
                  Autosave failed: {autosaveError}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="cms-sidebar-card cms-article-editor__organize">
          <div className="cms-sidebar-card__head">
            <FolderOpen className="h-4 w-4" />
            <h3>Organize</h3>
          </div>
          <div className="cms-sidebar-card__body">
            <div className="cms-field">
              <label className="cms-field__label">Category</label>
              <CmsCategorySelect
                value={category}
                onChange={setCategory}
                categories={categories}
              />
            </div>
            <div className="cms-field">
              <label className="cms-field__label flex items-center gap-1.5">
                <Tag className="h-3 w-3" /> Tags
              </label>
              <Input value={tags} onChange={(e) => setTags(e.target.value)} className="cms-field__input" placeholder="solar, policy, grid" />
              <span className="cms-field__hint">Comma-separated topics</span>
            </div>
            <FeaturedImageEditor
              items={mediaItems}
              value={imageUrl}
              onChange={setImageUrl}
              meta={heroMeta}
              onMetaChange={setHeroMeta}
            />
          </div>
        </section>
        </aside>
      </div>

      {reviewDialogOpen && (
        <div className="cms-review-submit-backdrop" onClick={() => !loading && setReviewDialogOpen(false)}>
          <div
            className="cms-review-submit-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cms-review-submit-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="cms-review-submit-title" className="cms-review-submit-dialog__title">Send to admin for review</h3>
            <p className="cms-review-submit-dialog__desc">
              Admins receive this in Platform desk. They can approve, publish, or return with notes via Editorial notices.
            </p>
            <label htmlFor="review-submit-note" className="cms-field__label">Note for reviewers (optional)</label>
            <textarea
              id="review-submit-note"
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              rows={4}
              className="cms-review-submit-dialog__input"
              placeholder="Deadline, legal sensitivity, sources to verify…"
            />
            <div className="cms-review-submit-dialog__actions">
              <Button type="button" variant="outline" disabled={loading} onClick={() => setReviewDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" disabled={loading} onClick={handleSubmitForReview}>
                <ShieldCheck className="h-4 w-4" />
                {loading ? 'Sending…' : 'Submit for review'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ArticlePreviewModal
        open={preview}
        onClose={() => setPreview(false)}
        title={title}
        excerpt={excerpt}
        content={content}
        imageUrl={imageUrl}
        category={category}
        authorName={authorName}
        readTime={readTime}
        publishedAt={resolvedPublishedAt}
        slug={slug || 'preview'}
        heroMeta={heroMeta}
        isFeatured={isFeatured}
        isPinned={isPinned}
        isBreaking={isBreaking}
      />
    </div>
  );
}