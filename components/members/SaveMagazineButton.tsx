'use client';

import { useState, useTransition } from 'react';
import { Bookmark } from 'lucide-react';
import { toast } from 'sonner';
import { toggleSaveMagazine } from '@/lib/actions/members';
import { cn } from '@/lib/utils';

export function SaveMagazineButton({
  magazineId,
  initialSaved,
}: {
  magazineId: string;
  initialSaved: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      try {
        const result = await toggleSaveMagazine(magazineId);
        setSaved(result.saved);
        toast.success(result.saved ? 'Issue saved to your library' : 'Removed from saved');
      } catch {
        toast.error('Could not update saved issue');
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={pending}
      className={cn(
        'btn inline-flex items-center gap-2 text-sm',
        saved ? 'btn-primary' : 'btn-secondary',
      )}
    >
      <Bookmark className={cn('h-4 w-4', saved && 'fill-current')} />
      {saved ? 'Saved' : 'Save issue'}
    </button>
  );
}