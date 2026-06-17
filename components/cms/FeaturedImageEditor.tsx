'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Image as ImageIcon, Upload, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import type { MediaItem } from '@/components/cms/MediaPicker';
import {
  heroImageStyle,
  type HeroImageFilter,
  type HeroImageMeta,
  type HeroFitMode,
} from '@/lib/hero-image';

export type { HeroImageMeta, HeroImageFilter, HeroFitMode };
export { heroImageStyle };

export function FeaturedImageEditor({
  items,
  value,
  onChange,
  meta,
  onMetaChange,
  label = 'Featured image',
}: {
  items: MediaItem[];
  value: string;
  onChange: (url: string) => void;
  meta: HeroImageMeta;
  onMetaChange: (meta: HeroImageMeta) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showAdjust, setShowAdjust] = useState(false);
  const images = items.filter((m) => m.type === 'image');

  useBodyScrollLock(open);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploading(true);
      const form = new FormData();
      form.append('file', file);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: form });
        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        onChange(data.url ?? data.path ?? '');
        toast.success('Image uploaded');
        setShowAdjust(true);
      } catch {
        toast.error('Upload failed');
      } finally {
        setUploading(false);
      }
    };
    input.click();
  }

  function updateMeta(patch: Partial<HeroImageMeta>) {
    onMetaChange({ ...meta, ...patch });
  }

  const fitMode = meta.fitMode ?? 'fill';
  const zoom = meta.zoom ?? 100;
  const [zoomDraft, setZoomDraft] = useState(zoom);
  const [zoomDragging, setZoomDragging] = useState(false);

  useEffect(() => {
    if (!zoomDragging) setZoomDraft(zoom);
  }, [zoom, zoomDragging]);

  const previewStyle = heroImageStyle({ ...meta, zoom: zoomDraft }, { animate: !zoomDragging });

  const modal = open && mounted ? (
    <div
      className="featured-image-editor__modal fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Choose featured image"
    >
      <div
        className="bg-background rounded-2xl border border-border/60 w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
          <div>
            <h3 className="font-semibold text-[15px]">Featured image</h3>
            <p className="text-[12px] text-muted-foreground mt-0.5">Carousel, cards, and article hero</p>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" size="sm" variant="outline" onClick={handleUpload} disabled={uploading}>
              <Upload className="h-3.5 w-3.5 mr-1.5" />
              {uploading ? 'Uploading…' : 'Upload'}
            </Button>
            <button type="button" onClick={() => setOpen(false)} className="ui-close-btn" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-5">
          {images.length === 0 ? (
            <p className="text-center text-muted-foreground text-[13px] py-12">No images yet. Upload one to get started.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((m) => {
                const selected = value === m.url;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => { onChange(m.url); setOpen(false); setShowAdjust(true); }}
                    className={cn(
                      'relative rounded-lg overflow-hidden border-2 transition-all aspect-square',
                      selected ? 'border-sky-500 ring-2 ring-sky-500/30' : 'border-transparent hover:border-border',
                    )}
                  >
                    <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="space-y-2">
      <span className="admin-stat-label">{label}</span>
      {value ? (
        <div className="featured-image-editor">
          <div className="featured-image-editor__frame relative rounded-xl overflow-hidden border border-border/60 group">
            <img
              src={value}
              alt={meta.alt ?? ''}
              className={cn(
                'featured-image-editor__img featured-image-editor__img--smooth',
                zoomDragging && 'featured-image-editor__img--dragging',
              )}
              style={previewStyle}
            />
            <div
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
              onMouseDown={(e) => e.preventDefault()}
            >
              <Button type="button" size="sm" variant="secondary" onMouseDown={(e) => e.preventDefault()} onClick={() => setOpen(true)}>Change</Button>
              <Button type="button" size="sm" variant="secondary" onMouseDown={(e) => e.preventDefault()} onClick={() => setShowAdjust((v) => !v)}>
                <SlidersHorizontal className="h-3.5 w-3.5 mr-1" /> Adjust
              </Button>
              <Button type="button" size="sm" variant="ghost" className="text-white" onMouseDown={(e) => e.preventDefault()} onClick={() => { onChange(''); onMetaChange({}); }}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {(showAdjust || meta.caption || meta.alt || meta.filter || meta.fitMode || (meta.zoom && meta.zoom !== 100)) && (
            <div className="featured-image-editor__adjust mt-2 space-y-3 rounded-xl border border-border/50 bg-muted/10 p-3">
              <div>
                <label className="cms-field__label text-[11px]">Frame fit</label>
                <div className="featured-image-editor__fit-pills mt-1">
                  <button
                    type="button"
                    onClick={() => updateMeta({ fitMode: 'fit', zoom: 100 })}
                    className={cn(
                      'featured-image-editor__fit-pill',
                      fitMode === 'fit' && 'featured-image-editor__fit-pill--active',
                    )}
                  >
                    Auto fit
                  </button>
                  <button
                    type="button"
                    onClick={() => updateMeta({ fitMode: 'fill', zoom: 100 })}
                    className={cn(
                      'featured-image-editor__fit-pill',
                      fitMode === 'fill' && 'featured-image-editor__fit-pill--active',
                    )}
                  >
                    Auto fill
                  </button>
                </div>
                <p className="featured-image-editor__fit-hint text-[10px] text-muted-foreground mt-1.5">
                  {fitMode === 'fit'
                    ? 'Shows the full image inside the frame — letterboxing if needed.'
                    : 'Zooms to cover the frame — edges may crop.'}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2">
                  <label className="cms-field__label text-[11px]">Zoom</label>
                  <span className="text-[10px] tabular-nums text-muted-foreground">{zoomDraft}%</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={200}
                  step={1}
                  value={zoomDraft}
                  onPointerDown={() => setZoomDragging(true)}
                  onChange={(e) => setZoomDraft(Number(e.target.value))}
                  onPointerUp={(e) => {
                    const value = Number(e.currentTarget.value);
                    setZoomDragging(false);
                    updateMeta({ zoom: value });
                  }}
                  onPointerCancel={(e) => {
                    const value = Number(e.currentTarget.value);
                    setZoomDragging(false);
                    updateMeta({ zoom: value });
                  }}
                  className="featured-image-editor__zoom featured-image-editor__zoom--smooth mt-1 w-full"
                />
              </div>

              <div>
                <label className="cms-field__label text-[11px]">Filter</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(['none', 'warm', 'cool', 'mono', 'contrast'] as HeroImageFilter[]).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => updateMeta({ filter: f })}
                      className={cn(
                        'rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize transition-colors',
                        (meta.filter ?? 'none') === f
                          ? 'border-sky-500/50 bg-sky-500/15 text-sky-600'
                          : 'border-border/60 text-muted-foreground hover:border-border',
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="cms-field__label text-[11px]">Alt text</label>
                <Input
                  value={meta.alt ?? ''}
                  onChange={(e) => updateMeta({ alt: e.target.value })}
                  className="cms-field__input mt-1"
                  placeholder="Describe the image for accessibility"
                />
              </div>
              <div>
                <label className="cms-field__label text-[11px]">Caption</label>
                <Textarea
                  value={meta.caption ?? ''}
                  onChange={(e) => updateMeta({ caption: e.target.value })}
                  className="cms-field__input mt-1 resize-y min-h-[3rem]"
                  rows={2}
                  placeholder="Optional caption on the article page"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setOpen(true)}
          className="featured-image-editor__empty w-full aspect-video rounded-xl border border-dashed border-border/80 bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground"
        >
          <ImageIcon className="h-6 w-6 opacity-60" />
          <span className="text-[12px] font-medium">Choose from library or upload</span>
        </button>
      )}

      {mounted && modal ? createPortal(modal, document.body) : null}
    </div>
  );
}