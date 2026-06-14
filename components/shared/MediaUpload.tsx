'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Upload, Trash2 } from 'lucide-react';
import { deleteMedia } from '@/lib/actions/media';

export function MediaUpload({ items }: { items: { id: string; name: string; url: string; type: string; size?: number | null; createdAt: Date }[] }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  async function handleUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,application/pdf';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploading(true);
      const form = new FormData();
      form.append('file', file);
      try {
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
    if (!confirm('Delete this file?')) return;
    try {
      await deleteMedia(id);
      toast.success('Deleted');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div>
      <Button onClick={handleUpload} disabled={uploading} className="mb-6">
        <Upload className="h-4 w-4 mr-2" />
        {uploading ? 'Uploading…' : 'Upload File'}
      </Button>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map((m) => (
          <div key={m.id} className="card overflow-hidden group relative">
            {m.type === 'image' ? (
              <img src={m.url} alt={m.name} className="w-full aspect-square object-cover" />
            ) : (
              <div className="w-full aspect-square flex items-center justify-center bg-muted text-xs p-2 text-center">{m.name}</div>
            )}
            <div className="p-2 text-xs truncate">{m.name}</div>
            <button
              onClick={() => handleDelete(m.id)}
              className="absolute top-2 right-2 p-1 rounded bg-destructive/80 text-white opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted-foreground col-span-full">No media uploaded yet</p>}
      </div>
    </div>
  );
}