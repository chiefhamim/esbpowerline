'use client';

import {
  cloneElement,
  isValidElement,
  useState,
  useRef,
  useCallback,
  useEffect,
  type FocusEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { useEditorPreferences } from '@/components/cms/EditorPreferencesProvider';

type Placement = 'top' | 'bottom';

type ModernTooltipProps = {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
  side?: Placement;
  /** Snappier show animation (public chrome, icon controls) */
  fast?: boolean;
  /** Public navbar styling — matches theme swatch flyouts */
  variant?: 'default' | 'chrome' | 'editor' | 'member';
  /** Show even when CMS editor guidance is in pro mode (no tooltips) */
  alwaysShow?: boolean;
  /** Force hide even when guidance mode allows tooltips */
  disabled?: boolean;
  /** Delay before showing on hover/focus (avoids accidental flicker) */
  showDelayMs?: number;
  /** Fade-out duration on mouse leave */
  hideFadeMs?: number;
  /** Brief hold + fade after clicking the trigger (e.g. nav links) */
  dismissOnClick?: boolean;
  clickVisibleMs?: number;
  clickFadeMs?: number;
};

export function ModernTooltip({
  label,
  hint,
  children,
  className,
  side = 'top',
  fast = false,
  variant = 'default',
  alwaysShow = false,
  disabled = false,
  showDelayMs = 0,
  hideFadeMs = 200,
  dismissOnClick = false,
  clickVisibleMs = 500,
  clickFadeMs = 500,
}: ModernTooltipProps) {
  const { showTooltips } = useEditorPreferences();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [placement, setPlacement] = useState<Placement>(side);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lockedRef = useRef(false);

  useEffect(() => setMounted(true), []);

  const clearTimers = useCallback(() => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

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

  const finishClose = useCallback(() => {
    setOpen(false);
    setClosing(false);
    lockedRef.current = false;
    hideTimerRef.current = null;
  }, []);

  const startClose = useCallback(
    (fadeMs: number) => {
      if (!open && !closing) return;
      setClosing(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(finishClose, fadeMs);
    },
    [open, closing, finishClose],
  );

  const reveal = useCallback(() => {
    updatePosition();
    setClosing(false);
    setOpen(true);
  }, [updatePosition]);

  const scheduleShow = useCallback(() => {
    if (lockedRef.current) return;
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
      setClosing(false);
      if (open) return;
    }
    if (showTimerRef.current) return;
    if (showDelayMs <= 0) {
      reveal();
      return;
    }
    showTimerRef.current = setTimeout(() => {
      showTimerRef.current = null;
      if (!lockedRef.current) reveal();
    }, showDelayMs);
  }, [open, reveal, showDelayMs]);

  const scheduleHide = useCallback(() => {
    if (lockedRef.current) return;
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
      return;
    }
    if (!open) return;
    startClose(hideFadeMs);
  }, [hideFadeMs, open, startClose]);

  const scheduleClickDismiss = useCallback(() => {
    if (!dismissOnClick) return;
    clearTimers();
    lockedRef.current = true;
    setClosing(false);
    reveal();
    hideTimerRef.current = setTimeout(() => {
      startClose(clickFadeMs);
    }, clickVisibleMs);
  }, [clearTimers, clickFadeMs, clickVisibleMs, dismissOnClick, reveal, startClose]);

  const handleTriggerClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const target = event.currentTarget;
      target.blur();
      scheduleClickDismiss();
    },
    [scheduleClickDismiss],
  );

  useEffect(() => {
    if (!open && !closing) return;
    const onScroll = () => updatePosition();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    };
  }, [open, closing, updatePosition]);

  const child = dismissOnClick && isValidElement(children)
    ? cloneElement(children as ReactElement<{ onClick?: (e: MouseEvent<HTMLElement>) => void }>, {
        onClick: (event: MouseEvent<HTMLElement>) => {
          (children as ReactElement<{ onClick?: (e: MouseEvent<HTMLElement>) => void }>).props.onClick?.(event);
          if (!event.defaultPrevented) handleTriggerClick(event);
        },
      })
    : children;

  const showPortal = open || closing;
  const tooltipsEnabled = (alwaysShow || showTooltips) && !disabled;

  if (!tooltipsEnabled) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        ref={triggerRef}
        className={cn('modern-tooltip-wrap inline-flex', className)}
        onMouseEnter={scheduleShow}
        onMouseLeave={scheduleHide}
        onFocusCapture={scheduleShow}
        onBlurCapture={(event: FocusEvent<HTMLDivElement>) => {
          const next = event.relatedTarget as Node | null;
          if (next && triggerRef.current?.contains(next)) return;
          scheduleHide();
        }}
      >
        {child}
      </div>
      {mounted && showPortal && createPortal(
        <div
          role="tooltip"
          className={cn(
            'modern-tooltip modern-tooltip--portal',
            fast && 'modern-tooltip--fast',
            variant === 'chrome' && 'modern-tooltip--chrome',
            variant === 'editor' && 'modern-tooltip--editor',
            variant === 'member' && 'modern-tooltip--member',
            closing && 'modern-tooltip--out',
            closing && clickFadeMs >= 400 && 'modern-tooltip--out-slow',
            placement === 'top' ? 'modern-tooltip--top' : 'modern-tooltip--bottom',
          )}
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            transform: placement === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
            zIndex: 99999,
            ...(closing && clickFadeMs >= 400
              ? { animationDuration: `${clickFadeMs}ms` }
              : closing && hideFadeMs
                ? { animationDuration: `${hideFadeMs}ms` }
                : {}),
          }}
        >
          <span className="modern-tooltip-label">{label}</span>
          {hint && <span className="modern-tooltip-hint">{hint}</span>}
          <span className="modern-tooltip-arrow" aria-hidden />
        </div>,
        document.body,
      )}
    </>
  );
}