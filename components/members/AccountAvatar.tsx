'use client';

import { BookOpenCheck, PenLine, Shield } from 'lucide-react';
import type { AccountKind } from '@/lib/account-kind';
import { cn } from '@/lib/utils';

const KIND_ICONS = {
  member: BookOpenCheck,
  admin: Shield,
  editor: PenLine,
} as const;

type AccountAvatarProps = {
  kind: AccountKind;
  initial: string;
  size?: 'sm' | 'md';
  /** Navbar size — initial + online dot only, no role badge */
  compact?: boolean;
  showStatus?: boolean;
  className?: string;
};

export function AccountAvatar({
  kind,
  initial,
  size = 'sm',
  compact = false,
  showStatus = true,
  className,
}: AccountAvatarProps) {
  const Icon = KIND_ICONS[kind];

  return (
    <span
      className={cn(
        'account-avatar',
        `account-avatar--${kind}`,
        size === 'md' && 'account-avatar--md',
        compact && 'account-avatar--compact',
        className,
      )}
      aria-hidden
    >
      <span className="account-avatar__face">
        <span className="account-avatar__initial">{initial}</span>
      </span>
      {!compact && (
        <span className="account-avatar__badge">
          <Icon className="account-avatar__badge-icon" strokeWidth={2.25} />
        </span>
      )}
      {showStatus && <span className="account-avatar__status" title="Signed in" />}
    </span>
  );
}