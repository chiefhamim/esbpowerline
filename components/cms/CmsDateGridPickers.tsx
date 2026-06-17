'use client';

import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminSelectMenu } from '@/components/admin/AdminSelectMenu';
import {
  AdminDropdownBackdrop,
  AdminDropdownPanel,
  AdminDropdownTrigger,
  useAdminDropdown,
} from '@/components/admin/AdminDropdown';
import {
  datetimeMenuStyle,
  useDatetimeMenuPosition,
} from '@/components/cms/useDatetimeMenuPosition';

const DATETIME_MENU = 'cms-datetime-select-menu';

const MONTHS = [
  { value: '01', label: 'Jan', full: 'January' },
  { value: '02', label: 'Feb', full: 'February' },
  { value: '03', label: 'Mar', full: 'March' },
  { value: '04', label: 'Apr', full: 'April' },
  { value: '05', label: 'May', full: 'May' },
  { value: '06', label: 'Jun', full: 'June' },
  { value: '07', label: 'Jul', full: 'July' },
  { value: '08', label: 'Aug', full: 'August' },
  { value: '09', label: 'Sep', full: 'September' },
  { value: '10', label: 'Oct', full: 'October' },
  { value: '11', label: 'Nov', full: 'November' },
  { value: '12', label: 'Dec', full: 'December' },
] as const;

const WEEKDAYS = [
  { label: 'Su', weekend: true },
  { label: 'Mo', weekend: false },
  { label: 'Tu', weekend: false },
  { label: 'We', weekend: false },
  { label: 'Th', weekend: false },
  { label: 'Fr', weekend: false },
  { label: 'Sa', weekend: true },
] as const;

const MINUTE_QUICK = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'] as const;

const HOUR_24 = Array.from({ length: 24 }, (_, h) => ({
  value: String(h).padStart(2, '0'),
  label: String(h).padStart(2, '0'),
}));

const HOUR_12 = [
  ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h24) => ({
    value: String(h24).padStart(2, '0'),
    label: h24 === 0 ? '12 AM' : `${h24} AM`,
  })),
  ...[12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((h24) => ({
    value: String(h24).padStart(2, '0'),
    label: h24 === 12 ? '12 PM' : `${h24 - 12} PM`,
  })),
];

function DatetimeSelectShell({
  value,
  onChange,
  placeholder,
  menuTitle,
  menuClassName,
  menuWidth,
  gridColumns,
  options,
  menuMinHeight,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  menuTitle: string;
  menuClassName: string;
  menuWidth: string;
  gridColumns: number;
  options: Array<{ value: string; label: string; description?: string; marked?: boolean }>;
  menuMinHeight?: number;
}) {
  return (
    <div className="cms-form-select relative w-full shrink-0">
      <AdminSelectMenu
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        menuTitle={menuTitle}
        menuClassName={cn(DATETIME_MENU, menuClassName)}
        optionsLayout="grid"
        gridColumns={gridColumns}
        menuWidth={menuWidth}
        menuPosition="datetime"
        menuMinHeight={menuMinHeight}
        portal
        hideDot
        className="w-full"
        minWidth="100%"
      />
    </div>
  );
}

function DateGridTrigger({
  label,
  placeholder,
  open,
  onClick,
}: {
  label: string;
  placeholder: string;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <AdminDropdownTrigger open={open} onClick={onClick} aria-label={placeholder}>
      <span className="admin-select-trigger-label">{label || placeholder}</span>
      <ChevronDown
        className={cn('h-3 w-3 shrink-0 opacity-60 transition-transform duration-150', open && 'rotate-180')}
      />
    </AdminDropdownTrigger>
  );
}

export function CmsMonthGridSelect({
  value,
  onChange,
  placeholder = 'Month',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const options = useMemo(
    () => MONTHS.map((m) => ({ value: m.value, label: m.label, description: m.full })),
    [],
  );

  return (
    <DatetimeSelectShell
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      menuTitle="Month"
      menuClassName={`${DATETIME_MENU}--month`}
      menuWidth="13.5rem"
      gridColumns={4}
      options={options}
      menuMinHeight={140}
    />
  );
}

function buildCalendarCells(year: number, month: number) {
  const firstDow = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: Array<{ day: number | null; weekend: boolean }> = [];

  for (let i = 0; i < firstDow; i += 1) {
    cells.push({ day: null, weekend: false });
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    const dow = new Date(year, month - 1, d).getDay();
    cells.push({ day: d, weekend: dow === 0 || dow === 6 });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: null, weekend: false });
  }
  return cells;
}

export function CmsDayGridSelect({
  value,
  onChange,
  year,
  month,
  placeholder = 'Day',
}: {
  value: string;
  onChange: (value: string) => void;
  year: number;
  month: number;
  placeholder?: string;
}) {
  const { open, toggle, close } = useAdminDropdown();
  const { rootRef, rect } = useDatetimeMenuPosition(open, '16.5rem', { menuMinHeight: 260 });
  const dayNum = parseInt(value, 10);
  const cells = buildCalendarCells(year, month);
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
  const displayLabel = !Number.isNaN(dayNum) ? String(dayNum) : '';

  const menu = open ? (
    <>
      <AdminDropdownBackdrop onClose={close} />
      <AdminDropdownPanel
        className={cn('admin-select-menu', DATETIME_MENU, `${DATETIME_MENU}--day`)}
        align="left"
        style={datetimeMenuStyle(rect)}
      >
        <div className="admin-select-menu-title">Day</div>
        <div className="cms-datetime-custom-menu__body">
          <div className="cms-datetime-day-grid">
            <div className="cms-datetime-day-grid__weekdays" aria-hidden>
              {WEEKDAYS.map((d) => (
                <span
                  key={d.label}
                  className={cn('cms-datetime-day-grid__weekday', d.weekend && 'cms-datetime-day-grid__weekday--weekend')}
                >
                  {d.label}
                </span>
              ))}
            </div>
            <div className="cms-datetime-day-grid__cells">
              {cells.map((cell, idx) => {
                if (cell.day === null) {
                  return <span key={`pad-${idx}`} className="cms-datetime-day-grid__pad" aria-hidden />;
                }
                const padded = String(cell.day).padStart(2, '0');
                const active = padded === value;
                const isToday = isCurrentMonth && cell.day === today.getDate();
                return (
                  <button
                    key={padded}
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => {
                      onChange(padded);
                      close();
                    }}
                    className={cn(
                      'cms-datetime-grid-cell cms-datetime-grid-cell--day',
                      cell.weekend && 'cms-datetime-grid-cell--weekend',
                      isToday && 'cms-datetime-grid-cell--today',
                      active && 'cms-datetime-grid-cell--active',
                    )}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </AdminDropdownPanel>
    </>
  ) : null;

  return (
    <div ref={rootRef} className="cms-form-select relative w-full shrink-0">
      <DateGridTrigger label={displayLabel} placeholder={placeholder} open={open} onClick={toggle} />
      {typeof document !== 'undefined' ? createPortal(menu, document.body) : null}
    </div>
  );
}

export function CmsYearGridSelect({
  value,
  onChange,
  startYear,
  count = 30,
  placeholder = 'Year',
}: {
  value: string;
  onChange: (value: string) => void;
  startYear: number;
  count?: number;
  placeholder?: string;
}) {
  const currentYear = new Date().getFullYear();
  const options = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const year = startYear + i;
        const label = String(year);
        return { value: label, label, marked: year === currentYear };
      }),
    [count, currentYear, startYear],
  );

  return (
    <DatetimeSelectShell
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      menuTitle="Year"
      menuClassName={`${DATETIME_MENU}--year`}
      menuWidth="13.75rem"
      gridColumns={5}
      options={options}
      menuMinHeight={200}
    />
  );
}

export function CmsHourGridSelect({
  value,
  onChange,
  clockFormat = '24',
  placeholder = 'Hour',
}: {
  value: string;
  onChange: (value: string) => void;
  clockFormat?: '12' | '24';
  placeholder?: string;
}) {
  const options = clockFormat === '12' ? HOUR_12 : HOUR_24;

  return (
    <DatetimeSelectShell
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      menuTitle="Hour"
      menuClassName={`${DATETIME_MENU}--hour`}
      menuWidth={clockFormat === '12' ? '14rem' : '13.5rem'}
      gridColumns={clockFormat === '12' ? 4 : 6}
      options={options}
      menuMinHeight={clockFormat === '12' ? 220 : 180}
    />
  );
}

function stepMinute(value: string, delta: number) {
  const current = Number.parseInt(value, 10);
  const base = Number.isNaN(current) ? 0 : current;
  return String((base + delta + 60) % 60).padStart(2, '0');
}

export function CmsMinuteGridSelect({
  value,
  onChange,
  placeholder = 'Min',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const { open, toggle, close } = useAdminDropdown();
  const { rootRef, rect } = useDatetimeMenuPosition(open, '12.5rem', { menuMinHeight: 160 });
  const displayLabel = value ? `:${value}` : '';

  const menu = open ? (
    <>
      <AdminDropdownBackdrop onClose={close} />
      <AdminDropdownPanel
        className={cn('admin-select-menu', DATETIME_MENU, `${DATETIME_MENU}--minute`)}
        align="left"
        style={datetimeMenuStyle(rect)}
      >
        <div className="admin-select-menu-title">Minute</div>
        <div className="cms-datetime-custom-menu__body">
          <div className="cms-datetime-minute-grid">
            <div
              className="cms-datetime-minute-grid__quick"
              style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}
            >
              {MINUTE_QUICK.map((min) => (
                <button
                  key={min}
                  type="button"
                  role="menuitemradio"
                  aria-checked={min === value}
                  onClick={() => {
                    onChange(min);
                    close();
                  }}
                  className={cn(
                    'cms-datetime-grid-cell cms-datetime-grid-cell--minute',
                    min === value && 'cms-datetime-grid-cell--active',
                  )}
                >
                  :{min}
                </button>
              ))}
            </div>
            <div className="cms-datetime-minute-stepper" role="group" aria-label="Fine-tune minute">
              <span className="cms-datetime-minute-stepper__label">Fine-tune</span>
              <div className="cms-datetime-minute-stepper__controls">
                <button
                  type="button"
                  className="cms-datetime-minute-stepper__btn"
                  aria-label="Decrease minute"
                  onClick={() => onChange(stepMinute(value, -1))}
                >
                  −
                </button>
                <span className="cms-datetime-minute-stepper__value">:{value || '00'}</span>
                <button
                  type="button"
                  className="cms-datetime-minute-stepper__btn"
                  aria-label="Increase minute"
                  onClick={() => onChange(stepMinute(value, 1))}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </AdminDropdownPanel>
    </>
  ) : null;

  return (
    <div ref={rootRef} className="cms-form-select relative w-full shrink-0">
      <DateGridTrigger label={displayLabel || value} placeholder={placeholder} open={open} onClick={toggle} />
      {typeof document !== 'undefined' ? createPortal(menu, document.body) : null}
    </div>
  );
}