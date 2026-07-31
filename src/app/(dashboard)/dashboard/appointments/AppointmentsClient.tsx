"use client";

import { useMemo, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/Button";
import type {
  BookingDTO,
  BookingWorkspaceDTO,
  ProviderBookingWorkspaceDTO,
} from "@/lib/booking-domain";
import {
  AppointmentAgenda,
  AppointmentCalendar,
} from "./AppointmentCalendar";
import { AppointmentDetailsDrawer } from "./AppointmentDetailsDrawer";
import { ClientBookingPanel } from "./ClientBookingPanel";
import { ProviderBookingSetup } from "./ProviderBookingSetup";
import styles from "./AppointmentsClient.module.css";

type View = "calendar" | "agenda" | "discover" | "setup";

export function AppointmentsClient({
  initialWorkspace,
  initialProviderId,
  initialServiceId,
  initialBookingId,
  referenceNow,
}: {
  initialWorkspace: BookingWorkspaceDTO;
  initialProviderId: string;
  initialServiceId: string;
  initialBookingId: string;
  referenceNow: string;
}) {
  const [bookings, setBookings] = useState(initialWorkspace.bookings);
  const [provider, setProvider] = useState(initialWorkspace.provider);
  const [selectedBooking, setSelectedBooking] = useState<BookingDTO | null>(
    () =>
      initialWorkspace.bookings.find((booking) => booking.id === initialBookingId) ??
      null
  );
  const [view, setView] = useState<View>(() =>
    initialWorkspace.role === "client" && initialProviderId
      ? "discover"
      : "calendar"
  );
  const upcoming = useMemo(
    () =>
      bookings.filter(
          (booking) =>
          new Date(booking.endsAt).getTime() >=
            new Date(referenceNow).getTime() &&
          booking.status !== "cancelled" &&
          booking.status !== "declined"
      ),
    [bookings, referenceNow]
  );
  const counts = useMemo(
    () => ({
      upcoming: upcoming.length,
      requested: bookings.filter((item) => item.status === "requested").length,
      confirmed: bookings.filter((item) => item.status === "confirmed").length,
      completed: bookings.filter((item) => item.status === "completed").length,
    }),
    [bookings, upcoming.length]
  );
  const isClient = initialWorkspace.role === "client";
  const timezone =
    provider?.timezone ??
    (initialWorkspace.profileTimezone === "UTC"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : initialWorkspace.profileTimezone);

  function upsertBooking(next: BookingDTO) {
    setBookings((current) => {
      const exists = current.some((item) => item.id === next.id);
      const merged = exists
        ? current.map((item) => (item.id === next.id ? next : item))
        : [...current, next];
      return merged.sort(
        (a, b) =>
          new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
      );
    });
    setSelectedBooking((current) =>
      current?.id === next.id ? next : current
    );
  }

  const tabs: Array<{ value: View; label: string; icon: React.ReactNode }> = [
    { value: "calendar", label: "Calendar", icon: <CalendarIcon /> },
    { value: "agenda", label: "Agenda", icon: <ListIcon /> },
    isClient
      ? { value: "discover", label: "Book", icon: <SearchIcon /> }
      : { value: "setup", label: "Services & availability", icon: <SlidersIcon /> },
  ];

  return (
    <>
      <Topbar
        title="Appointments"
        subtitle={
          isClient
            ? "Book services and keep every appointment in one place."
            : "Manage requests, availability, and your live calendar."
        }
        action={
          <Button
            type="button"
            size="sm"
            iconLeft={isClient ? <PlusIcon /> : <SlidersIcon />}
            onClick={() => setView(isClient ? "discover" : "setup")}
          >
            {isClient ? "Book appointment" : "Booking setup"}
          </Button>
        }
      />

      <main className={styles.page}>
        <section className={styles.summaryStrip} aria-label="Appointment summary">
          <SummaryItem
            label="Upcoming"
            value={counts.upcoming}
            icon={<CalendarIcon />}
            tone="brand"
          />
          <SummaryItem
            label="Requested"
            value={counts.requested}
            icon={<ClockIcon />}
            tone="gold"
          />
          <SummaryItem
            label="Confirmed"
            value={counts.confirmed}
            icon={<CheckIcon />}
            tone="green"
          />
          <SummaryItem
            label="Completed"
            value={counts.completed}
            icon={<SparkIcon />}
            tone="blue"
          />
        </section>

        {!isClient && provider && !provider.isAcceptingBookings && (
          <section className={styles.activationBanner}>
            <div>
              <span className={styles.activationIcon}>
                <CalendarIcon />
              </span>
              <div>
                <strong>Your booking profile is not live yet</strong>
                <p>
                  Complete timezone, services, and weekly hours, then enable
                  appointment requests.
                </p>
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setView("setup")}
            >
              Finish setup
            </Button>
          </section>
        )}

        <div className={styles.viewToolbar}>
          <div className={styles.viewTabs} role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={view === tab.value}
                className={view === tab.value ? styles.viewTabActive : ""}
                onClick={() => setView(tab.value)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          <span className={styles.timezoneLabel}>
            <GlobeIcon />
            {timezone.replaceAll("_", " ")}
          </span>
        </div>

        {view === "calendar" && (
          <AppointmentCalendar
            bookings={bookings}
            timezone={timezone}
            referenceNow={referenceNow}
            onSelect={setSelectedBooking}
          />
        )}
        {view === "agenda" && (
          <section className={styles.agendaSection}>
            <div className={styles.sectionIntro}>
              <div>
                <p className={styles.eyebrow}>All activity</p>
                <h2>Appointment agenda</h2>
                <p>Requests and scheduled services in chronological order.</p>
              </div>
              <span className={styles.resultCount}>
                {bookings.length} appointment{bookings.length === 1 ? "" : "s"}
              </span>
            </div>
            <AppointmentAgenda
              bookings={bookings}
              emptyMessage="No appointments yet."
              onSelect={setSelectedBooking}
            />
          </section>
        )}
        {view === "discover" && isClient && (
          <ClientBookingPanel
            providers={initialWorkspace.bookableProviders}
            initialProviderId={initialProviderId}
            initialServiceId={initialServiceId}
            onCreated={(booking) => {
              upsertBooking(booking);
              setView("calendar");
              setSelectedBooking(booking);
            }}
          />
        )}
        {view === "setup" && !isClient && provider && (
          <ProviderBookingSetup
            initialProvider={provider}
            braidStyles={initialWorkspace.braidStyles}
            onProviderChange={(next: ProviderBookingWorkspaceDTO) =>
              setProvider(next)
            }
          />
        )}
        {view === "setup" && !isClient && !provider && (
          <section className={styles.agendaEmpty}>
            <CalendarIcon />
            <h2>Booking profile unavailable</h2>
            <p>
              Complete your Salon or Braider profile before configuring
              appointments.
            </p>
          </section>
        )}
      </main>

      <AppointmentDetailsDrawer
        key={selectedBooking?.id ?? "closed"}
        booking={selectedBooking}
        role={initialWorkspace.role}
        onClose={() => setSelectedBooking(null)}
        onUpdate={upsertBooking}
      />
    </>
  );
}

function SummaryItem({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: "brand" | "gold" | "green" | "blue";
}) {
  return (
    <div className={styles.summaryItem}>
      <span className={`${styles.summaryIcon} ${styles[`summary_${tone}`]}`}>
        {icon}
      </span>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M8 2v4M16 2v4M3 9h18" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
      <path d="M8 6h13M8 12h13M8 18h13" />
      <path d="M3 6h.01M3 12h.01M3 18h.01" strokeWidth="3" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
function SlidersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="8" cy="17" r="2" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}
function SparkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 3-1.4 4.1a5 5 0 0 1-3.1 3.1L3.5 12l4 1.4a5 5 0 0 1 3.1 3.1l1.4 4 1.4-4a5 5 0 0 1 3.1-3.1l4-1.4-4-1.4a5 5 0 0 1-3.1-3.1L12 3Z" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}
