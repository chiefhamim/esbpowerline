'use client';

import { useEffect, useState } from 'react';

export function DevCompileHint({
  label = 'First load — compiling routes…',
  delayMs = 2_500,
}: {
  label?: string;
  delayMs?: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    const timer = window.setTimeout(() => setVisible(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs]);

  if (!visible) return null;

  return (
    <p className="dev-compile-hint" role="status">
      {label}
      <span className="dev-compile-hint__sub">
        Split dev runs three Next servers — this one-time compile can take 1–3 minutes.
      </span>
    </p>
  );
}