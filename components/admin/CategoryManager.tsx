'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createCategory, deleteCategory } from '@/lib/actions/categories';
import { Trash2 } from 'lucide-react';

export function CategoryManager({ categories }: { categories: { id: string; name: string; slug: string; description?: string | null; color?: string | null }[] }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createCategory({ name: name.trim() });
      toast.success('Category created');
      setName('');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      toast.success('Deleted');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name" className="max-w-xs" />
        <Button type="submit" disabled={loading}>Add</Button>
      </form>
      <div className="grid sm:grid-cols-2 gap-3">
        {categories.map((c) => (
          <div key={c.id} className="card p-4 flex items-center justify-between">
            <div>
              <div className="font-medium flex items-center gap-2">
                {c.color && <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />}
                {c.name}
              </div>
              <div className="text-xs text-muted-foreground">{c.slug}</div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}