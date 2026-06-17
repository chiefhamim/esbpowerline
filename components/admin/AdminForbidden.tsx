import Link from 'next/link';
import { ShieldOff } from 'lucide-react';
export function AdminForbidden({
  title = 'Access restricted',
  description = 'Your role does not have permission to view this section. Contact a Super Admin if you need access.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="admin-forbidden flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card/40 px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
        <ShieldOff className="h-6 w-6" />
      </div>
      <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
      <Link href="/admin" className="btn btn-secondary mt-6">
        Back to dashboard
      </Link>
    </div>
  );
}