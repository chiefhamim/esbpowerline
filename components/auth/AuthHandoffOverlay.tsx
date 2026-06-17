'use client';

import { Loader2 } from 'lucide-react';

export function AuthHandoffOverlay({ message }: { message: string }) {
  return (
    <div className="auth-handoff" role="status" aria-live="polite" aria-busy="true">
      <div className="auth-handoff__card">
        <Loader2 className="auth-handoff__spinner h-5 w-5" aria-hidden />
        <p className="auth-handoff__message">{message}</p>
      </div>
    </div>
  );
}