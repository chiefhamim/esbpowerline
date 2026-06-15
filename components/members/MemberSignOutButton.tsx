'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export function MemberSignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/' })}
      className="btn btn-secondary inline-flex items-center gap-2 text-sm"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </button>
  );
}