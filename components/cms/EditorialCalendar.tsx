'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, Star, Pin, Clock, Zap, FileEdit, CalendarDays,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from '@/lib/actions/articles';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { CmsCard } from '@/components/cms/CmsUI';
import { ModernTooltip } from '@/components/shared/ModernTooltip';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

const STATUS_COLORS: Record<string, string> = {
  PUBLISHED: 'editorial-cal-event--published',
  SCHEDULED: 'editorial-cal-event--scheduled',
  DRAFT: 'editorial-cal-event--draft',
};

function startOfMonth(year: number, month: number) {
  return new Date(year, month, 1);
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
  );
}

function dateKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function formatMonthLabel(year: number, month: number) {
  return new Date(year, month, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });
}

function formatDayLabel(d: Date) {
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function statusLabel(status: string) {
  if (status === 'PUBLISHED') return 'Published';
  if (status === 'SCHEDULED') return 'Scheduled';
  return 'Draft activity';
}

function formatEventWhen(date: string) {
  return new Date(date).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function EditorialCalendar({
  events,
  year: initialYear,
  month: initialMonth,
  seeAll,
}: {
  events: CalendarEvent[];
  year: number;
  month: number;
  seeAll: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const today = useMemo(() => new Date(), []);

  const [selectedDay, setSelectedDay] = useState<Date | null>(today);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const d = new Date(event.date);
      const key = dateKey(d);
      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    }
    return map;
  }, [events]);

  const monthStats = useMemo(() => {
    let scheduled = 0;
    let published = 0;
    let drafts = 0;
    for (const e of events) {
      if (e.status === 'SCHEDULED') scheduled += 1;
      else if (e.status === 'PUBLISHED') published += 1;
      else if (e.status === 'DRAFT') drafts += 1;
    }
    return { scheduled, published, drafts, total: events.length };
  }, [events]);

  const selectedEvents = useMemo(() => {
    if (!selectedDay) return [];
    return eventsByDay.get(dateKey(selectedDay)) ?? [];
  }, [selectedDay, eventsByDay]);

  function navigateMonth(delta: number) {
    const d = startOfMonth(initialYear, initialMonth);
    d.setMonth(d.getMonth() + delta);
    const params = new URLSearchParams(searchParams.toString());
    params.set('year', String(d.getFullYear()));
    params.set('month', String(d.getMonth()));
    router.push(`/cms/calendar?${params.toString()}`);
    setSelectedDay(new Date(d.getFullYear(), d.getMonth(), 1));
  }

  function goToday() {
    const params = new URLSearchParams(searchParams.toString());
    params.set('year', String(today.getFullYear()));
    params.set('month', String(today.getMonth()));
    router.push(`/cms/calendar?${params.toString()}`);
    setSelectedDay(today);
  }

  const firstWeekday = startOfMonth(initialYear, initialMonth).getDay();
  const totalDays = daysInMonth(initialYear, initialMonth);
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let day = 1; day <= totalDays; day++) {
    cells.push(new Date(initialYear, initialMonth, day));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="editorial-calendar">
      <div className="editorial-calendar__toolbar">
        <div className="editorial-calendar__nav">
          <button type="button" className="editorial-calendar__nav-btn" onClick={() => navigateMonth(-1)} aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h2 className="editorial-calendar__month">{formatMonthLabel(initialYear, initialMonth)}</h2>
          <button type="button" className="editorial-calendar__nav-btn" onClick={() => navigateMonth(1)} aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <button type="button" className="editorial-calendar__today-btn" onClick={goToday}>
          Today
        </button>
      </div>

      <div className="editorial-calendar__stats">
        <div className="editorial-calendar__stat" data-accent="sky">
          <div className="editorial-calendar__stat-head">
            <small>Events</small>
            <CalendarDays className="h-3.5 w-3.5" />
          </div>
          <span>{monthStats.total}</span>
        </div>
        <div className="editorial-calendar__stat" data-accent="amber">
          <div className="editorial-calendar__stat-head">
            <small>Scheduled</small>
            <Clock className="h-3.5 w-3.5" />
          </div>
          <span>{monthStats.scheduled}</span>
        </div>
        <div className="editorial-calendar__stat" data-accent="emerald">
          <div className="editorial-calendar__stat-head">
            <small>Published</small>
            <Zap className="h-3.5 w-3.5" />
          </div>
          <span>{monthStats.published}</span>
        </div>
        <div className="editorial-calendar__stat" data-accent="violet">
          <div className="editorial-calendar__stat-head">
            <small>Drafts touched</small>
            <FileEdit className="h-3.5 w-3.5" />
          </div>
          <span>{monthStats.drafts}</span>
        </div>
      </div>

      <div className="editorial-calendar__layout">
        <CmsCard title="Month view" icon={CalendarDays} className="editorial-calendar__grid-card" bodyClassName="p-0">
          <div className="editorial-calendar__weekdays">
            {WEEKDAYS.map((d) => (
              <div key={d} className="editorial-calendar__weekday">{d}</div>
            ))}
          </div>
          <div className="editorial-calendar__grid">
            {cells.map((date, i) => {
              if (!date) {
                return <div key={`empty-${i}`} className="editorial-calendar__cell editorial-calendar__cell--empty" />;
              }
              const key = dateKey(date);
              const dayEvents = eventsByDay.get(key) ?? [];
              const isToday = isSameDay(date, today);
              const isSelected = selectedDay ? isSameDay(date, selectedDay) : false;
              const inMonth = date.getMonth() === initialMonth;

              return (
                <button
                  key={key}
                  type="button"
                  className={cn(
                    'editorial-calendar__cell',
                    isToday && 'editorial-calendar__cell--today',
                    isSelected && 'editorial-calendar__cell--selected',
                    !inMonth && 'editorial-calendar__cell--muted',
                  )}
                  onClick={() => setSelectedDay(date)}
                >
                  <span className="editorial-calendar__day-num">{date.getDate()}</span>
                  {dayEvents.length > 0 && (
                    <div className="editorial-calendar__chips">
                      {dayEvents.slice(0, 3).map((e) => {
                        const flags = [
                          e.isFeatured ? 'Featured' : null,
                          e.isPinned ? 'Pinned' : null,
                        ].filter(Boolean).join(' · ');
                        const hint = [
                          statusLabel(e.status),
                          e.category,
                          seeAll ? e.authorName : null,
                          formatEventWhen(e.date),
                          flags || null,
                        ].filter(Boolean).join(' · ');

                        return (
                          <ModernTooltip
                            key={e.id}
                            label={e.title}
                            hint={hint}
                            variant="editor"
                            fast
                            side="top"
                            showDelayMs={180}
                            className="editorial-cal-event-tooltip"
                          >
                            <span
                              className={cn(
                                'editorial-cal-event',
                                STATUS_COLORS[e.status] ?? 'editorial-cal-event--draft',
                              )}
                            >
                              {e.title}
                            </span>
                          </ModernTooltip>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <ModernTooltip
                          label={`${dayEvents.length - 3} more on this day`}
                          hint={dayEvents.slice(3).map((e) => e.title).join(' · ')}
                          variant="editor"
                          fast
                          side="top"
                          showDelayMs={180}
                          className="editorial-cal-event-tooltip"
                        >
                          <span className="editorial-cal-event editorial-cal-event--more">
                            +{dayEvents.length - 3} more
                          </span>
                        </ModernTooltip>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </CmsCard>

        <CmsCard
          title={selectedDay ? formatDayLabel(selectedDay) : 'Select a day'}
          icon={Clock}
          className="editorial-calendar__detail-card"
        >
          {selectedEvents.length === 0 ? (
            <p className="text-[13px] text-muted-foreground py-6 text-center">
              {seeAll ? 'No editorial activity on this day.' : 'No stories on this day.'}
            </p>
          ) : (
            <div className="editorial-calendar__detail-list">
              {selectedEvents.map((event) => (
                <div key={event.id} className="editorial-calendar__detail-item">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <Link
                      href={`/cms/articles/${event.id}/edit`}
                      className="font-medium text-[13px] hover:text-sky-400 transition-colors line-clamp-2"
                    >
                      {event.title}
                    </Link>
                    <StatusBadge status={event.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{event.category}</span>
                    {seeAll && <span>· {event.authorName}</span>}
                    {event.isPinned && (
                      <span className="inline-flex items-center gap-0.5 text-violet-500">
                        <Pin className="h-3 w-3" /> Pinned
                      </span>
                    )}
                    {event.isFeatured && (
                      <span className="inline-flex items-center gap-0.5 text-amber-500">
                        <Star className="h-3 w-3" /> Featured
                      </span>
                    )}
                  </div>
                  <time className="text-[10px] text-muted-foreground tabular-nums mt-1 block">
                    {new Date(event.date).toLocaleString(undefined, {
                      hour: 'numeric',
                      minute: '2-digit',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                </div>
              ))}
            </div>
          )}
        </CmsCard>
      </div>

      <div className="editorial-calendar__legend">
        <span className="editorial-cal-legend-item editorial-cal-event--published">Published</span>
        <span className="editorial-cal-legend-item editorial-cal-event--scheduled">Scheduled</span>
        <span className="editorial-cal-legend-item editorial-cal-event--draft">Draft activity</span>
      </div>
    </div>
  );
}