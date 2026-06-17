'use client';

import { useTransition } from 'react';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

export function DownloadGridButton() {
  const [pending, startTransition] = useTransition();

  function handleDownload() {
    startTransition(async () => {
      try {
        const res = await fetch('/api/members/grid-export');
        if (!res.ok) {
          throw new Error('Download failed');
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'esb-grid-snapshot.csv';
        anchor.click();
        URL.revokeObjectURL(url);
        toast.success('Grid snapshot downloaded');
      } catch {
        toast.error('Could not download data package');
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={pending}
      className="btn btn-primary inline-flex items-center gap-2 text-sm"
    >
      <Download className="h-4 w-4" />
      {pending ? 'Preparing…' : 'Download grid snapshot (CSV)'}
    </button>
  );
}