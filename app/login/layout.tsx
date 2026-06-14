import { Suspense } from 'react';

function LoginFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[var(--bg)]">
      <div className="admin-loading-spinner" />
      <span className="text-sm text-muted-foreground">Preparing sign in…</span>
    </div>
  );
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoginFallback />}>{children}</Suspense>;
}