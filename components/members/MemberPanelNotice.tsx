'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { X } from 'lucide-react';

const NOTICES: Record<string, { title: string; body: string }> = {
  'member-area': {
    title: 'Member library',
    body: 'Editorial and admin tools use staff sign-in. This area is for saved reading, magazine archive, and downloads.',
  },
  'wrong-portal': {
    title: 'Signed in as a member',
    body: 'You used staff sign-in with a member account. Your library is always available here.',
  },
};

export function MemberPanelNotice() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const noticeKey = searchParams.get('notice');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!!noticeKey && !!NOTICES[noticeKey]);
  }, [noticeKey]);

  if (!visible || !noticeKey || !NOTICES[noticeKey]) return null;

  const copy = NOTICES[noticeKey];

  function dismiss() {
    setVisible(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('notice');
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div className="member-panel-notice" role="status">
      <div className="member-panel-notice__copy">
        <p className="member-panel-notice__title">{copy.title}</p>
        <p className="member-panel-notice__body">{copy.body}</p>
      </div>
      <button type="button" className="member-panel-notice__dismiss" onClick={dismiss} aria-label="Dismiss">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}