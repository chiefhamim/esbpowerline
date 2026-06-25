'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from '@/utils/supabase/auth-context';
import { triggerGridRefresh } from '@/lib/actions/members';

export function RefreshGridDataButton() {
  const router = useRouter();
  const { status } = useSession();
  const [pending, startTransition] = useTransition();

  const signedIn = status === 'authenticated';

  function handleRefresh() {
    if (!signedIn) {
      toast.error('Member authentication required to refresh live grid data.', {
        description: 'Please sign in to your subscriber account first.',
      });
      return;
    }

    startTransition(async () => {
      const promise = triggerGridRefresh();

      toast.promise(promise, {
        loading: 'Connecting to PGCB/NLDC SCADA & parsing daily reports...',
        success: () => {
          router.refresh();
          return 'Grid explorer data successfully synchronized!';
        },
        error: (err) => {
          return `Sync failed: ${err.message || err}`;
        },
      });

      try {
        await promise;
      } catch (err: any) {
        console.error('Refresh click error:', err);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleRefresh}
      disabled={pending}
      className="btn btn-secondary custom-tooltip-trigger flex items-center justify-center gap-1.5 text-xs w-full py-2 hover:bg-secondary transition-colors"
      data-tooltip={signedIn ? 'Trigger database update from latest SCADA reports' : 'Subscriber sign-in required to refresh grid data'}
    >
      <RefreshCw className={`h-3.5 w-3.5 ${pending ? 'animate-spin text-primary' : ''}`} />
      {pending ? 'Refreshing…' : 'Refresh Data'}
    </button>
  );
}
