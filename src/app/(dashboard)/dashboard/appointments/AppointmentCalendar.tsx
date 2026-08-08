"use client";

import { useMemo, useState } from "react";
import {
  BOOKING_STATUS_LABELS,
  bookingDateKey,
  formatBookingDateTime,
  type BookingDTO,
} from "@/lib/booking-domain";
import styles from "./AppointmentsClient.module.css";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function AppointmentCalendar({
  bookings,
  timezone,
  referenceNow,
  onSelect,
}: {
  bookings: BookingDTO[];
  timezone: string;
  referenceNow: string;
  onSelect: (booking: BookingDTO) => void;
}) {
  const [monthKey, setMonthKey] = useState(() => currentMonthKey());
  const monthCells = useMemo(() => buildMonthCells(monthKey), [monthKey]);
  const grouped = useMemo(() => {
    const next = new Map<string, BookingDTO[]>();
    for (const booking of bookings) {
      const key = bookingDateKey(booking.startsAt, booking.timezone || timezone);
      next.set(key, [...(next.get(key) ?? []), booking]);
    }
    return next;
  }, [bookings, timezone]);
  const upcoming = useMemo(
    () =>
      bookings
        .filter(
          (booking) =>
            new Date(booking.endsAt).getTime() >=
              new Date(referenceNow).getTime() &&
            booking.status !== "cancelled" &&
            booking.status !== "declined"
        )
        .slice(0, 8),
    [bookings, referenceNow]
  );

  return (
    <div className={styles.calendarLayout}>
      <section className={styles.calendarPanel}>
        <div className={styles.calendarToolbar}>
          <div>
            <p className={styles.eyebrow}>Schedule</p>
            <h2 className={styles.monthTitle}>{monthLabel(monthKey)}</h2>
          </div>
          <div className={styles.monthControls}>
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Previous month"
              title="Previous month"
              onClick={() => setMonthKey(shiftMonth(monthKey, -1))}
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              className={styles.todayButton}
              onClick={() => setMonthKey(currentMonthKey())}
            >
              Today
            </button>
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Next month"
              title="Next month"
              onClick={() => setMonthKey(shiftMonth(monthKey, 1))}
            >
              <ChevronIcon direction="right" />
            </button>
          </div>
        </div>

        <div className={styles.calendarGrid} role="grid" aria-label={monthLabel(monthKey)}>
          {WEEKDAYS.map((day) => (
            <div key={day} className={styles.weekday} role="columnheader">
              {day}
            </div>
          ))}
          {monthCells.map((cell) => {
            const dayBookings = grouped.get(cell.key) ?? [];
            return (
              <div
                key={cell.key}
                className={`${styles.dayCell} ${
                  cell.inMonth ? "" : styles.outsideMonth
                } ${cell.isToday ? styles.todayCell : ""}`}
                role="gridcell"
              >
                <div className={styles.dayNumberRow}>
                  <span className={styles.dayNumber}>{cell.day}</span>
                  {dayBookings.length > 0 && (
                    <span className={styles.dayCount}>{dayBookings.length}</span>
                  )}
                </div>
                <div className={styles.dayEvents}>
                  {dayBookings.slice(0, 3).map((booking) => (
                    <button
                      key={booking.id}
                      type="button"
                      className={`${styles.eventChip} ${
                        styles[`event_${booking.status}`]
                      }`}
                      onClick={() => onSelect(booking)}
                    >
                      <span>{timeOnly(booking.startsAt, booking.timezone)}</span>
                      <strong>{booking.serviceName}</strong>
                    </button>
                  ))}
                  {dayBookings.length > 3 && (
                    <span className={styles.moreEvents}>
                      +{dayBookings.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.mobileAgenda}>
          <AppointmentAgenda
            bookings={upcoming}
            emptyMessage="No upcoming appointments."
            onSelect={onSelect}
          />
        </div>
      </section>

      <aside className={styles.upcomingPanel}>
        <div className={styles.upcomingHeader}>
          <p className={styles.eyebrow}>Next up</p>
          <span>{upcoming.length}</span>
        </div>
        <AppointmentAgenda
          bookings={upcoming}
          emptyMessage="Your upcoming schedule will appear here."
          onSelect={onSelect}
          compact
        />
      </aside>
    </div>
  );
}

export function AppointmentAgenda({
  bookings,
  emptyMessage,
  onSelect,
  compact = false,
}: {
  bookings: BookingDTO[];
  emptyMessage: string;
  onSelect: (booking: BookingDTO) => void;
  compact?: boolean;
}) {
  if (!bookings.length) {
    return (
      <div className={compact ? styles.compactEmpty : styles.agendaEmpty}>
        <CalendarIcon />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={compact ? styles.compactAgenda : styles.fullAgenda}>
      {bookings.map((booking) => (
        <button
          key={booking.id}
          type="button"
          className={styles.agendaRow}
          onClick={() => onSelect(booking)}
        >
          <span className={styles.agendaDate}>
            <strong>
              {formatBookingDateTime(booking.startsAt, booking.timezone, {
                month: "short",
                day: "numeric",
                year: undefined,
                hour: undefined,
                minute: undefined,
              })}
            </strong>
            <small>{timeOnly(booking.startsAt, booking.timezone)}</small>
          </span>
          <span className={styles.agendaBody}>
            <strong>{booking.serviceName}</strong>
            <small>{booking.provider.name}</small>
          </span>
          <span
            className={`${styles.statusDot} ${
              styles[`status_${booking.status}`]
            }`}
            title={BOOKING_STATUS_LABELS[booking.status]}
          />
          <ChevronIcon direction="right" />
        </button>
      ))}
    </div>
  );
}

function buildMonthCells(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  const first = new Date(year, month - 1, 1);
  const start = new Date(year, month - 1, 1 - first.getDay());
  const today = localDateKey(new Date());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const key = localDateKey(date);
    return {
      key,
      day: date.getDate(),
      inMonth: date.getMonth() === month - 1,
      isToday: key === today,
    };
  });
}

function currentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function localDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

function shiftMonth(monthKey: string, amount: number) {
  const [year, month] = monthKey.split("-").map(Number);
  const next = new Date(year, month - 1 + amount, 1);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
}

function timeOnly(value: string, timezone: string) {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={direction === "left" ? { transform: "rotate(180deg)" } : undefined}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M8 2v4M16 2v4M3 9h18" />
    </svg>
  );
}
