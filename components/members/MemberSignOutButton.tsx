'use client';

import { LogOut } from 'lucide-react';
import { signOutToPublicSite } from '@/lib/staff-sign-out';

export function MemberSignOutButton() {
  return (
    <button
      type="button"
      onClick={() => void signOutToPublicSite()}
      className="sign-out-control btn btn-secondary inline-flex items-center gap-2 text-sm"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </button>
  );
}