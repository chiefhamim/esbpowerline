'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { TipTapEditor } from './TipTapEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createArticle, updateArticle } from '@/lib/actions/articles';
import { CATEGORIES } from '@/lib/constants';
import { slugify } from '@/lib/utils';
import { Eye } from 'lucide-react';

interface ArticleFormProps {
  mode: 'create' | 'edit';
  article?: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
    category: string;
    status: string;
    imageUrl?: string | null;
    tags?: unknown;
    isFeatured: boolean;
    isBreaking: boolean;
    seo?: unknown;
  };
}

export function ArticleForm({ mode, article }: ArticleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  const [title, setTitle] = useState(article?.title ?? '');
  const [slug, setSlug] = useState(article?.slug ?? '');
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? '');
  const [content, setContent] = useState(article?.content ?? '<p></p>');
  const [category, setCategory] = useState(article?.category ?? CATEGORIES[0]);
  const [status, setStatus] = useState(article?.status ?? 'DRAFT');
  const [imageUrl, setImageUrl] = useState(article?.imageUrl ?? '');
  const [tags, setTags] = useState(((article?.tags as string[]) ?? []).join(', '));
  const [isFeatured, setIsFeatured] = useState(article?.isFeatured ?? false);
  const [isBreaking, setIsBreaking] = useState(article?.isBreaking ?? false);
  const [metaTitle, setMetaTitle] = useState((article?.seo as any)?.metaTitle ?? '');
  const [metaDescription, setMetaDescription] = useState((article?.seo as any)?.metaDescription ?? '');

  async function handleSubmit(publishStatus?: string) {
    setLoading(true);
    try {
      const data = {
        title,
        slug: slug || slugify(title),
        excerpt,
        content,
        category,
        status: (publishStatus ?? status) as any,
        imageUrl: imageUrl || undefined,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        isFeatured,
        isBreaking,
        seo: { metaTitle, metaDescription },
      };

      if (mode === 'create') {
        const created = await createArticle(data);
        toast.success('Article created');
        router.push(`/cms/articles/${created.id}/edit`);
      } else if (article) {
        await updateArticle(article.id, data);
        toast.success('Article saved');
        router.refresh();
      }
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to save');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (mode === 'create') setSlug(slugify(e.target.value));
            }}
            className="mt-1 text-lg font-medium"
            placeholder="Article title"
          />
        </div>

        <Tabs defaultValue="editor">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>
          <TabsContent value="editor">
            <TipTapEditor content={content} onChange={setContent} />
          </TabsContent>
          <TabsContent value="seo" className="space-y-4">
            <div>
              <Label>Meta Title</Label>
              <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Meta Description</Label>
              <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} className="mt-1" rows={3} />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1 font-mono text-sm" />
            </div>
          </TabsContent>
        </Tabs>

        <div>
          <Label>Excerpt</Label>
          <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="mt-1" rows={2} placeholder="Short summary for cards and search" />
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Publish</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Status</Label>
              <Select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="ARCHIVED">Archived</option>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div>
              <Label>Tags (comma-separated)</Label>
              <Input value={tags} onChange={(e) => setTags(e.target.value)} className="mt-1" placeholder="solar, policy, grid" />
            </div>
            <div>
              <Label>Featured Image URL</Label>
              <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="mt-1" placeholder="https://..." />
            </div>
            <div className="flex items-center justify-between">
              <Label>Featured</Label>
              <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Breaking News</Label>
              <Switch checked={isBreaking} onCheckedChange={setIsBreaking} />
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Button onClick={() => handleSubmit()} disabled={loading}>
                {loading ? 'Saving…' : 'Save Draft'}
              </Button>
              <Button variant="secondary" onClick={() => handleSubmit('PUBLISHED')} disabled={loading}>
                Publish
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setPreview(!preview)}>
                <Eye className="h-4 w-4 mr-2" /> Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6" onClick={() => setPreview(false)}>
          <div className="bg-background rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto p-8" onClick={(e) => e.stopPropagation()}>
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            {imageUrl && <img src={imageUrl} alt="" className="w-full rounded-lg mb-4" />}
            <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
      )}
    </div>
  );
}