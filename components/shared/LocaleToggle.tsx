'use client';

import { useEffect, useRef, useState } from 'react';
import {
  SITE_LOCALES,
  SITE_LOCALE_PREVIEW,
  type SiteLocale,
} from '@/lib/locale';
import { cn } from '@/lib/utils';
import { useLocale } from '@/components/shared/LocaleProvider';

type LocaleToggleProps = {
  className?: string;
};

const TIP_VISIBLE_MS = 500;
const TIP_FADE_MS = 500;

export function LocaleToggle({ className = '' }: LocaleToggleProps) {
  const { locale, setLocale, t } = useLocale();
  const [openTip, setOpenTip] = useState<SiteLocale | null>(null);
  const [closingTip, setClosingTip] = useState<SiteLocale | null>(null);
  const lockedTipRef = useRef<SiteLocale | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  function clearTipLock() {
    lockedTipRef.current = null;
    setOpenTip(null);
    setClosingTip(null);
    hideTimerRef.current = null;
  }

  function startTipFade() {
    const tipId = lockedTipRef.current;
    if (!tipId) return;
    setClosingTip(tipId);
    setOpenTip(null);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(clearTipLock, TIP_FADE_MS);
  }

  function scheduleTipDismiss(tipId: SiteLocale) {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setClosingTip(null);
    lockedTipRef.current = tipId;
    setOpenTip(tipId);
    hideTimerRef.current = setTimeout(startTipFade, TIP_VISIBLE_MS);
  }

  function showTip(tipId: SiteLocale) {
    if (lockedTipRef.current) return;
    setOpenTip(tipId);
  }

  function hideTip() {
    if (lockedTipRef.current) return;
    setOpenTip(null);
  }

  function selectLocale(next: SiteLocale, button: HTMLButtonElement) {
    setLocale(next);
    button.blur();
    scheduleTipDismiss(next);
    setIsOpen(false);
  }

  return (
    <div
      ref={containerRef}
      className={cn('locale-toggle-wrapper', isOpen && 'is-open', className)}
      role="group"
      aria-label={t('locale.toggle')}
    >
      <div className={cn('locale-toggle', isOpen && 'is-open')}>
        <div className="locale-toggle__swatches">
          {SITE_LOCALES.map((item) => {
            const active = locale === item.id;
            const preview = SITE_LOCALE_PREVIEW[item.id];
            const tipOpen = openTip === item.id || closingTip === item.id;

            return (
              <div
                key={item.id}
                className="locale-toggle__item relative"
                onMouseEnter={() => showTip(item.id)}
                onMouseLeave={hideTip}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    if (active) {
                      setIsOpen(!isOpen);
                    } else {
                      selectLocale(item.id, e.currentTarget);
                    }
                  }}
                  onFocus={() => showTip(item.id)}
                  onBlur={hideTip}
                  className={cn('locale-toggle__btn', active && 'locale-toggle__btn--active')}
                  aria-pressed={active}
                  aria-label={item.label}
                >
                  <span
                    className={cn(
                      'locale-toggle__label',
                      `locale-toggle__label--${item.id}`,
                    )}
                  >
                    {item.short}
                  </span>
                </button>
                <div
                  className={cn(
                    'locale-toggle__flyout',
                    tipOpen && 'locale-toggle__flyout--visible',
                    closingTip === item.id && 'locale-toggle__flyout--closing',
                  )}
                  aria-hidden={!tipOpen}
                >
                  <div
                    className="locale-toggle__tip"
                    style={
                      {
                        '--locale-preview-bg': preview.background,
                        '--locale-preview-border': preview.border,
                        '--locale-preview-fg': preview.foreground,
                      } as React.CSSProperties
                    }
                  >
                    <div className="locale-toggle__flyout-arrow" aria-hidden />
                    <span
                      className={cn(
                        'locale-toggle__preview',
                        item.id === 'bn' && 'font-bengali',
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}