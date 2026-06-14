'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

type Placement = 'top' | 'bottom';

export function ModernTooltip({
  label,
  hint,
  children,
  className,
  side = 'top',
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
  side?: Placement;
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState<Placement>(side);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const gap = 8;
    let nextPlacement: Placement = side;

    if (side === 'top' && rect.top < 72) {
      nextPlacement = 'bottom';
    } else if (side === 'bottom' && rect.bottom > window.innerHeight - 72) {
      nextPlacement = 'top';
    }

    const top = nextPlacement === 'top' ? rect.top - gap : rect.bottom + gap;
    const left = rect.left + rect.width / 2;

    setPlacement(nextPlacement);
    setCoords({ top, left });
  }, [side]);

  const show = useCallback(() => {
    updatePosition();
    setVisible(true);
  }, [updatePosition]);

  const hide = useCallback(() => setVisible(false), []);

  useEffect(() => {
    if (!visible) return;
    const onScroll = () => updatePosition();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    };
  }, [visible, updatePosition]);

  return (
    <>
      <div
        ref={triggerRef}
        className={cn('modern-tooltip-wrap inline-flex', className)}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </div>
      {mounted && visible && createPortal(
        <div
          role="tooltip"
          className={cn(
            'modern-tooltip modern-tooltip--portal',
            placement === 'top' ? 'modern-tooltip--top' : 'modern-tooltip--bottom'
          )}
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            transform: placement === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
            zIndex: 99999,
          }}
        >
          <span className="modern-tooltip-label">{label}</span>
          {hint && <span className="modern-tooltip-hint">{hint}</span>}
          <span className="modern-tooltip-arrow" aria-hidden />
        </div>,
        document.body
      )}
    </>
  );
}