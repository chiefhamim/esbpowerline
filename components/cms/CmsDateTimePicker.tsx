'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, RotateCcw } from 'lucide-react';
import {
  CmsDayGridSelect,
  CmsHourGridSelect,
  CmsMinuteGridSelect,
  CmsMonthGridSelect,
  CmsYearGridSelect,
} from '@/components/cms/CmsDateGridPickers';
import {
  formatDatetimeLocalDate,
  parseDatetimeLocal,
  toDatetimeLocalFromDate,
} from '@/lib/datetime-local';
import { cn } from '@/lib/utils';
import { useEditorPreferences } from '@/components/cms/EditorPreferencesProvider';
import { EDITOR_CLOCK_FORMAT_KEY } from '@/lib/editor-preferences';

type ClockFormat = '12' | '24';

function CmsClockFormatToggle({
  value,
  onChange,
}: {
  value: ClockFormat;
  onChange: (next: ClockFormat) => void;
}) {
  return (
    <div className="cms-clock-segment" role="group" aria-label="Clock format">
      <button
        type="button"
        className={cn('cms-clock-segment__btn', value === '12' && 'cms-clock-segment__btn--active')}
        onClick={() => onChange('12')}
        aria-pressed={value === '12'}
      >
        12h
      </button>
      <button
        type="button"
        className={cn('cms-clock-segment__btn', value === '24' && 'cms-clock-segment__btn--active')}
        onClick={() => onChange('24')}
        aria-pressed={value === '24'}
      >
        24h
      </button>
    </div>
  );
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function formatPreviewTime(d: Date, clockFormat: ClockFormat) {
  return clockFormat === '12' ? format(d, 'h:mm a') : format(d, 'HH:mm');
}

export function CmsDateTimePicker({
  value,
  onChange,
  className,
  yearSpan = 30,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  yearSpan?: number;
}) {
  const current = parseDatetimeLocal(value);
  const { preferences, setClockFormat, showGuidanceHints } = useEditorPreferences();
  const clockFormat = preferences.clockFormat;

  const setFormat = (next: ClockFormat) => {
    setClockFormat(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(EDITOR_CLOCK_FORMAT_KEY, next);
    }
  };

  const yearRange = useMemo(() => {
    if (!current) return { start: 0, count: yearSpan };
    const anchor = current.getFullYear();
    return { start: anchor - Math.floor(yearSpan / 2), count: yearSpan };
  }, [current, yearSpan]);

  if (!current) {
    return (
      <div className={cn('cms-datetime-panel cms-datetime-panel--empty', className)}>
        <p className="cms-datetime-panel__hint">Loading date &amp; time…</p>
      </div>
    );
  }

  const updatePart = (part: 'y' | 'm' | 'd' | 'h' | 'min', val: string) => {
    const next = new Date(current);
    if (part === 'y') next.setFullYear(parseInt(val, 10));
    else if (part === 'm') next.setMonth(parseInt(val, 10) - 1);
    else if (part === 'd') next.setDate(parseInt(val, 10));
    else if (part === 'h') next.setHours(parseInt(val, 10));
    else if (part === 'min') next.setMinutes(parseInt(val, 10));

    const maxDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
    if (next.getDate() > maxDay) next.setDate(maxDay);

    onChange(toDatetimeLocalFromDate(next));
  };

  const setNow = () => onChange(toDatetimeLocalFromDate(new Date()));

  return (
    <div className={cn('cms-datetime-panel', className)}>
      <div className="cms-datetime-panel__preview">
        <div className="cms-datetime-panel__preview-date">
          <Calendar className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
          <span>{formatDatetimeLocalDate(value)}</span>
        </div>
        <div className="cms-datetime-panel__preview-time">
          <Clock className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
          <span>{formatPreviewTime(current, clockFormat)}</span>
          <span className="cms-datetime-panel__format-badge">{clockFormat}h</span>
        </div>
      </div>

      <div className="cms-datetime-panel__grid">
        <div className="cms-datetime-panel__row">
          <span className="cms-datetime-panel__row-label">Date</span>
          <div className="cms-datetime-panel__pills">
            <CmsMonthGridSelect
              value={pad(current.getMonth() + 1)}
              onChange={(v) => updatePart('m', v)}
            />
            <CmsDayGridSelect
              value={pad(current.getDate())}
              onChange={(v) => updatePart('d', v)}
              year={current.getFullYear()}
              month={current.getMonth() + 1}
            />
            <CmsYearGridSelect
              value={String(current.getFullYear())}
              onChange={(v) => updatePart('y', v)}
              startYear={yearRange.start}
              count={yearRange.count}
            />
          </div>
        </div>
        <div className="cms-datetime-panel__row">
          <span className="cms-datetime-panel__row-label">Time</span>
          <div className="cms-datetime-panel__pills">
            <CmsHourGridSelect
              value={pad(current.getHours())}
              onChange={(v) => updatePart('h', v)}
              clockFormat={clockFormat}
            />
            <CmsMinuteGridSelect
              value={pad(current.getMinutes())}
              onChange={(v) => updatePart('min', v)}
            />
            <CmsClockFormatToggle value={clockFormat} onChange={setFormat} />
          </div>
        </div>
      </div>

      <button type="button" className="cms-datetime-panel__now" onClick={setNow}>
        <RotateCcw className="h-3 w-3 shrink-0" aria-hidden />
        Use current date &amp; time
      </button>

      {showGuidanceHints && (
        <p className="cms-datetime-panel__hint">
          Applied on publish or schedule — backdate archive stories to sort among older news
        </p>
      )}
    </div>
  );
}