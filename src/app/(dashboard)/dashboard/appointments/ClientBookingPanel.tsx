"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  formatBookingMoney,
  type AvailabilityResponseDTO,
  type BookableProviderDTO,
  type BookingDTO,
  type BookingServiceDTO,
} from "@/lib/booking-domain";
import styles from "./AppointmentsClient.module.css";

interface ComposerSelection {
  provider: BookableProviderDTO;
  service: BookingServiceDTO;
}

export function ClientBookingPanel({
  providers,
  initialProviderId,
  initialServiceId,
  onCreated,
}: {
  providers: BookableProviderDTO[];
  initialProviderId: string;
  initialServiceId: string;
  onCreated: (booking: BookingDTO) => void;
}) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | "salon" | "braider">("all");
  const [selection, setSelection] = useState<ComposerSelection | null>(() => {
    if (!initialProviderId) return null;
    const provider = providers.find((item) => item.id === initialProviderId);
    if (!provider) return null;
    const service =
      provider.services.find((item) => item.id === initialServiceId) ??
      provider.services[0];
    return service ? { provider, service } : null;
  });
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return providers.filter(
      (provider) =>
        (type === "all" || provider.type === type) &&
        (!normalized ||
          provider.name.toLowerCase().includes(normalized) ||
          provider.city.toLowerCase().includes(normalized) ||
          provider.services.some((service) =>
            service.name.toLowerCase().includes(normalized)
          ))
    );
  }, [providers, query, type]);

  return (
    <>
      <section className={styles.discoverySection}>
        <div className={styles.sectionIntro}>
          <div>
            <p className={styles.eyebrow}>Book with confidence</p>
            <h2>Find the right service and time</h2>
            <p>
              Availability is calculated from each provider&apos;s live calendar.
            </p>
          </div>
          <div className={styles.discoveryFilters}>
            <label className={styles.searchField}>
              <SearchIcon />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search provider, city, or service"
                aria-label="Search bookable providers"
              />
            </label>
            <div className={styles.segmented} aria-label="Provider type">
              {(["all", "braider", "salon"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={type === value ? styles.segmentActive : ""}
                  onClick={() => setType(value)}
                >
                  {value === "all"
                    ? "All"
                    : value === "braider"
                      ? "Braiders"
                      : "Salons"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.providerList}>
          {filtered.map((provider) => (
            <article key={provider.id} className={styles.providerRow}>
              <div className={styles.providerIdentity}>
                <span className={styles.providerAvatar}>
                  {initials(provider.name)}
                </span>
                <div>
                  <span className={styles.providerType}>
                    {provider.type === "salon" ? "Salon" : "Independent braider"}
                  </span>
                  <h3>{provider.name}</h3>
                  <p>
                    {[provider.city, provider.state].filter(Boolean).join(", ") ||
                      "Location available on request"}
                  </p>
                </div>
              </div>
              <div className={styles.serviceList}>
                {provider.services.map((service) => (
                  <div key={service.id} className={styles.serviceChoice}>
                    <div>
                      <strong>{service.name}</strong>
                      <span>
                        {service.durationMinutes} min
                        {service.braidStyleName
                          ? ` · ${service.braidStyleName}`
                          : ""}
                      </span>
                    </div>
                    <div className={styles.serviceAction}>
                      <strong>
                        {formatBookingMoney(service.priceCents, service.currency)}
                      </strong>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setSelection({ provider, service })}
                      >
                        Choose time
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
          {!filtered.length && (
            <div className={styles.discoveryEmpty}>
              <SearchIcon />
              <h3>No bookable providers found</h3>
              <p>
                Try a broader search. Providers appear here after publishing a
                service and weekly hours.
              </p>
            </div>
          )}
        </div>
      </section>

      <BookingComposer
        key={
          selection
            ? `${selection.provider.id}:${selection.service.id}`
            : "closed"
        }
        selection={selection}
        onClose={() => setSelection(null)}
        onCreated={(booking) => {
          onCreated(booking);
          setSelection(null);
        }}
      />
    </>
  );
}

function BookingComposer({
  selection,
  onClose,
  onCreated,
}: {
  selection: ComposerSelection | null;
  onClose: () => void;
  onCreated: (booking: BookingDTO) => void;
}) {
  const [date, setDate] = useState(tomorrowKey);
  const [availabilityResult, setAvailabilityResult] = useState<{
    key: string;
    data: AvailabilityResponseDTO | null;
    error: string;
  }>({ key: "", data: null, error: "" });
  const [selectedSlot, setSelectedSlot] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [requestKey] = useState(() => crypto.randomUUID());
  const availabilityKey = selection
    ? `${selection.provider.id}:${selection.service.id}:${date}`
    : "";
  const availability =
    availabilityResult.key === availabilityKey
      ? availabilityResult.data
      : null;
  const loading = Boolean(
    selection && date && availabilityResult.key !== availabilityKey
  );
  const error =
    submitError ||
    (availabilityResult.key === availabilityKey
      ? availabilityResult.error
      : "");

  useEffect(() => {
    if (!selection || !date) return;
    let cancelled = false;
    const params = new URLSearchParams({
      providerId: selection.provider.id,
      serviceId: selection.service.id,
      startDate: date,
      days: "1",
    });
    fetch(`/api/booking/availability?${params}`)
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error ?? "Availability failed.");
        return data as AvailabilityResponseDTO;
      })
      .then((data) => {
        if (!cancelled) {
          setAvailabilityResult({ key: availabilityKey, data, error: "" });
        }
      })
      .catch((reason) => {
        if (!cancelled) {
          setAvailabilityResult({
            key: availabilityKey,
            data: null,
            error:
              reason instanceof Error
                ? reason.message
                : "Could not load availability.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [availabilityKey, date, selection]);

  async function submit() {
    if (!selection || !selectedSlot || !requestKey) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: selection.provider.id,
          serviceOfferingId: selection.service.id,
          startsAt: selectedSlot,
          clientNote: note,
          requestKey,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error ?? "Could not request this appointment.");
      }
      onCreated(data.booking as BookingDTO);
    } catch (reason) {
      setSubmitError(
        reason instanceof Error
          ? reason.message
          : "Could not request this appointment."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const footer = (
    <>
      <Button
        type="button"
        variant="outline"
        disabled={submitting}
        onClick={onClose}
      >
        Cancel
      </Button>
      <Button
        type="button"
        disabled={!selectedSlot || submitting}
        onClick={submit}
      >
        {submitting ? "Requesting..." : "Request appointment"}
      </Button>
    </>
  );

  return (
    <Drawer
      open={Boolean(selection)}
      title="Request an appointment"
      description={
        selection
          ? `${selection.service.name} with ${selection.provider.name}`
          : undefined
      }
      closeDisabled={submitting}
      onClose={onClose}
      footer={footer}
    >
      {selection && (
        <div className={styles.composer}>
          <div className={styles.serviceSummary}>
            <span className={styles.summaryIcon}>
              <ScissorsIcon />
            </span>
            <div>
              <strong>{selection.service.name}</strong>
              <p>
                {selection.service.durationMinutes} minutes ·{" "}
                {formatBookingMoney(
                  selection.service.priceCents,
                  selection.service.currency
                )}
              </p>
            </div>
          </div>

          <Input
            label="Appointment date"
            type="date"
            min={todayKey()}
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setSelectedSlot("");
              setSubmitError("");
            }}
          />

          <div>
            <div className={styles.fieldLabel}>Available times</div>
            {loading ? (
              <div className={styles.slotLoading}>Checking the live calendar...</div>
            ) : availability?.slots.length ? (
              <div className={styles.slotGrid}>
                {availability.slots.map((slot) => (
                  <button
                    key={slot.startsAt}
                    type="button"
                    className={
                      selectedSlot === slot.startsAt ? styles.slotSelected : ""
                    }
                    onClick={() => setSelectedSlot(slot.startsAt)}
                  >
                    {formatSlotTime(slot.startsAt, selection.provider.timezone)}
                  </button>
                ))}
              </div>
            ) : (
              <div className={styles.slotEmpty}>
                No openings on this date. Try another day.
              </div>
            )}
          </div>

          <Textarea
            label="Note for the provider"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={4}
            maxLength={500}
            placeholder="Share hair length, preferred size, or anything helpful."
            hint={`${note.length}/500`}
          />

          <div className={styles.requestNotice}>
            <ShieldIcon />
            <p>
              This sends a request. Your appointment is final after the provider
              confirms it.
            </p>
          </div>
          {error && (
            <p className={styles.formError} role="alert">
              {error}
            </p>
          )}
        </div>
      )}
    </Drawer>
  );
}

function tomorrowKey() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return localDateKey(date);
}

function todayKey() {
  return localDateKey(new Date());
}

function localDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatSlotTime(value: string, timezone: string) {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function SearchIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function ScissorsIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="6" cy="7" r="3" />
      <circle cx="6" cy="17" r="3" />
      <path d="m8.7 8.4 11.3 6.1M8.7 15.6 20 9.5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
