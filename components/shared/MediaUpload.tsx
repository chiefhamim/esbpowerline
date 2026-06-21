'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Upload, Trash2, FileImage, FileText, Lock, Copy, ExternalLink, Pencil, X, Check, Newspaper,
} from 'lucide-react';
import { formatEditorialTimestamp } from '@/lib/utils';
import { publicArticleUrl } from '@/lib/public-site-url';
import { deleteMedia, updateMedia, type MediaLibraryItem } from '@/lib/actions/media';
import { optimizeImageToWebP } from '@/lib/image-optimizer';


function formatBytes(bytes: number | null | undefined) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatMime(mime: string | null | undefined, type: string) {
  if (!mime) return type.toUpperCase();
  const ext = mime.split('/')[1]?.toUpperCase();
  return ext ?? mime;
}

function MediaCard({
  item,
  onDelete,
  onUpdated,
  pending,
}: {
  item: MediaLibraryItem;
  onDelete: (id: string) => void;
  onUpdated: () => void;
  pending: boolean;
}) {
  const [dims, setDims] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [altText, setAltText] = useState(item.altText ?? '');
  const [saving, setSaving] = useState(false);

  const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      const ratio = img.naturalWidth / img.naturalHeight;
      const aspect = ratio >= 1.2 ? 'Landscape' : ratio <= 0.85 ? 'Portrait' : 'Square';
      setDims(`${img.naturalWidth}×${img.naturalHeight} · ${aspect}`);
    }
  }, []);

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(item.url);
      toast.success('URL copied');
    } catch {
      toast.error('Could not copy URL');
    }
  }

  async function saveEdits() {
    setSaving(true);
    try {
      await updateMedia(item.id, { name, altText });
      toast.success('Media updated');
      setEditing(false);
      onUpdated();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="media-library-card media-library-card--v2">
      <div className="media-library-card__preview">
        {item.type === 'image' ? (
          <img
            src={item.url}
            alt={item.altText ?? item.name}
            className="media-library-card__image"
            onLoad={handleLoad}
          />
        ) : (
          <div className="media-library-card__file">
            <FileText className="h-9 w-9 opacity-45" />
          </div>
        )}
        <div className="media-library-card__badge">
          {formatMime(item.mimeType, item.type)}
        </div>
      </div>

      <div className="media-library-card__body">
        <div className="media-library-card__head">
          <h3 className="media-library-card__name" title={item.name}>{item.name}</h3>
          <span className="media-library-card__size">{formatBytes(item.size)}</span>
        </div>

        <dl className="media-library-card__facts">
          <div><dt>Uploaded</dt><dd>{formatEditorialTimestamp(item.createdAt)}</dd></div>
          {dims && <div><dt>Size</dt><dd>{dims}</dd></div>}
        </dl>

        {item.usedInArticles.length > 0 && (
          <div className="media-library-card__usage">
            <span className="media-library-card__usage-label">
              <Newspaper className="h-3 w-3" />
              Used in {item.usageCount} stor{item.usageCount === 1 ? 'y' : 'ies'}
            </span>
            <ul className="media-library-card__article-links">
              {item.usedInArticles.slice(0, 3).map((article) => (
                <li key={article.id}>
                  <Link href={`/cms/articles/${article.id}/edit`} className="media-library-card__article-link">
                    {article.title}
                  </Link>
                  <a
                    href={publicArticleUrl(article.slug)}
                    target="_blank"
                    rel="noreferrer"
                    className="media-library-card__article-public"
                    title="View live article"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
              {item.usedInArticles.length > 3 && (
                <li className="media-library-card__article-more">
                  +{item.usedInArticles.length - 3} more
                </li>
              )}
            </ul>
          </div>
        )}

        {editing ? (
          <div className="media-library-card__edit">
            <Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 text-xs" placeholder="File name" />
            {item.type === 'image' && (
              <Input value={altText} onChange={(e) => setAltText(e.target.value)} className="h-8 text-xs" placeholder="Alt text" />
            )}
            <div className="media-library-card__edit-actions">
              <Button type="button" size="sm" variant="ghost" className="h-7 px-2" onClick={() => setEditing(false)} disabled={saving}>
                <X className="h-3 w-3" />
              </Button>
              <Button type="button" size="sm" className="h-7 px-2" onClick={saveEdits} disabled={saving}>
                <Check className="h-3 w-3 mr-1" /> Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="media-library-card__actions">
            <button type="button" className="media-library-card__action" onClick={copyUrl} title="Copy URL">
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </button>
            <a href={item.url} target="_blank" rel="noreferrer" className="media-library-card__action" title="Open file">
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Open</span>
            </a>
            <button type="button" className="media-library-card__action" onClick={() => setEditing(true)} title="Edit details">
              <Pencil className="h-3.5 w-3.5" />
              <span>Edit</span>
            </button>
            {item.canDelete ? (
              <button
                type="button"
                className="media-library-card__action media-library-card__action--danger"
                onClick={() => onDelete(item.id)}
                disabled={pending}
                title="Delete file"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
            ) : (
              <span className="media-library-card__action media-library-card__action--locked" title={item.usageCount > 0 ? 'In use by articles' : 'Cannot delete'}>
                <Lock className="h-3.5 w-3.5" />
                <span>Locked</span>
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export function MediaUpload({ items }: { items: MediaLibraryItem[] }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,application/pdf';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const optimizedFile = await optimizeImageToWebP(file);
        const form = new FormData();
        form.append('file', optimizedFile);
        const res = await fetch('/api/upload', { method: 'POST', body: form });

        if (!res.ok) throw new Error('Upload failed');
        toast.success('Uploaded');
        router.refresh();
      } catch {
        toast.error('Upload failed');
      } finally {
        setUploading(false);
      }
    };
    input.click();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this file permanently?')) return;
    setPending(true);
    try {
      await deleteMedia(id);
      toast.success('Deleted');
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setPending(false);
    }
  }

  const images = items.filter((m) => m.type === 'image').length;
  const files = items.length - images;

  return (
    <div className="media-library media-library--v2">
      <div className="media-library__toolbar">
        <div className="media-library__summary">
          <span className="media-library__summary-icon">
            <FileImage className="h-4 w-4" />
          </span>
          <div>
            <p className="media-library__summary-title">{items.length} asset{items.length !== 1 ? 's' : ''}</p>
            <p className="media-library__summary-sub">
              {images > 0 && `${images} image${images !== 1 ? 's' : ''}`}
              {images > 0 && files > 0 && ' · '}
              {files > 0 && `${files} document${files !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        <Button onClick={handleUpload} disabled={uploading} size="sm" className="media-library__upload-btn">
          <Upload className="h-3.5 w-3.5 mr-1.5" />
          {uploading ? 'Uploading…' : 'Upload'}
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="media-library__empty">
          <FileImage className="h-10 w-10 opacity-30" />
          <p>No media uploaded yet</p>
          <Button onClick={handleUpload} disabled={uploading} variant="outline" size="sm">
            Upload your first file
          </Button>
        </div>
      ) : (
        <div className="media-library__grid media-library__grid--v2">
          {items.map((m) => (
            <MediaCard
              key={m.id}
              item={m}
              onDelete={handleDelete}
              onUpdated={() => router.refresh()}
              pending={pending}
            />
          ))}
        </div>
      )}

      <p className="media-library__hint">
        Each file links directly to stories that use it. Edit metadata, copy URLs, or delete when not in use.
      </p>
    </div>
  );
}