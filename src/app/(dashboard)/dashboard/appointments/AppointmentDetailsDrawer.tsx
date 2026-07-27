"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  BOOKING_STATUS_LABELS,
  formatBookingDateTime,
  formatBookingMoney,
  type AvailabilityResponseDTO,
  type BookingAction,
  type BookingDTO,
} from "@/lib/booking-domain";
import type { DashboardRole } from "@/lib/roles";
import styles from "./AppointmentsClient.module.css";

export function AppointmentDetailsDrawer({
  booking,
  role,
  onClose,
  onUpdate,
}: {
  booking: BookingDTO | null;
  role: DashboardRole;
  onClose: () => void;
  onUpdate: (booking: BookingDTO) => void;
}) {
  const [mode, setMode] = useState<"details" | "reschedule" | "reason">(
    "details"
  );
  const [reasonAction, setReasonAction] = useState<
    "cancel" | "decline" | null
  >(null);
  const [reason, setReason] = useState("");
  const [date, setDate] = useState(tomorrowKey);
  const [availabilityResult, setAvailabilityResult] = useState<{
    key: string;
    data: AvailabilityResponseDTO | null;
    error: string;
  }>({ key: "", data: null, error: "" });
  const [selectedSlot, setSelectedSlot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");
  const availabilityKey = booking
    ? `${booking.provider.id}:${booking.serviceOfferingId}:${date}`
    : "";
  const availability =
    availabilityResult.key === availabilityKey
      ? availabilityResult.data
      : null;
  const loadingSlots = Boolean(
    booking &&
      mode === "reschedule" &&
      date &&
      availabilityResult.key !== availabilityKey
  );
  const error =
    actionError ||
    (availabilityResult.key === availabilityKey
      ? availabilityResult.error
      : "");

  useEffect(() => {
    if (!booking || mode !== "reschedule" || !date) return;
    let cancelled = false;
    const params = new URLSearchParams({
      providerId: booking.provider.id,
      serviceId: booking.serviceOfferingId,
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
      .catch((reasonValue) => {
        if (!cancelled) {
          setAvailabilityResult({
            key: availabilityKey,
            data: null,
            error:
              reasonValue instanceof Error
                ? reasonValue.message
                : "Could not load availability.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [availabilityKey, booking, date, mode]);

  async function mutate(action: BookingAction, actionReason = "") {
    if (!booking) return;
    setSubmitting(true);
    setActionError("");
    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          version: booking.version,
          reason: actionReason,
          startsAt: action === "reschedule" ? selectedSlot : undefined,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error ?? "Appointment could not be updated.");
      }
      onUpdate(data.booking as BookingDTO);
      setMode("details");
      setReasonAction(null);
      setReason("");
      setSelectedSlot("");
    } catch (reasonValue) {
      setActionError(
        reasonValue instanceof Error
          ? reasonValue.message
          : "Appointment could not be updated."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const footer = booking ? (
    mode === "reschedule" ? (
      <>
        <Button
          type="button"
          variant="outline"
          disabled={submitting}
          onClick={() => setMode("details")}
        >
          Back
        </Button>
        <Button
          type="button"
          disabled={!selectedSlot || submitting}
          onClick={() => mutate("reschedule")}
        >
          {submitting ? "Rescheduling..." : "Request new time"}
        </Button>
      </>
    ) : mode === "reason" && reasonAction ? (
      <>
        <Button
          type="button"
          variant="outline"
          disabled={submitting}
          onClick={() => setMode("details")}
        >
          Back
        </Button>
        <Button
          type="button"
          disabled={submitting}
          onClick={() => mutate(reasonAction, reason)}
        >
          {submitting
            ? "Updating..."
            : reasonAction === "decline"
              ? "Decline request"
              : "Cancel appointment"}
        </Button>
      </>
    ) : (
      <Button type="button" variant="outline" onClick={onClose}>
        Close
      </Button>
    )
  ) : null;

  return (
    <Drawer
      open={Boolean(booking)}
      title={
        mode === "reschedule"
          ? "Choose a new time"
          : mode === "reason"
            ? reasonAction === "decline"
              ? "Decline request"
              : "Cancel appointment"
            : "Appointment details"
      }
      description={
        booking
          ? mode === "details"
            ? `${booking.serviceName} · ${formatBookingDateTime(
                booking.startsAt,
                booking.timezone
              )}`
            : booking.provider.name
          : undefined
      }
      closeDisabled={submitting}
      onClose={onClose}
      footer={footer}
    >
      {booking && mode === "details" && (
        <div className={styles.detailDrawer}>
          <div className={styles.detailHero}>
            <span className={styles.detailDate}>
              <strong>{dayNumber(booking.startsAt, booking.timezone)}</strong>
              <small>{monthName(booking.startsAt, booking.timezone)}</small>
            </span>
            <div>
              <Badge variant={statusVariant(booking.status)} dot>
                {BOOKING_STATUS_LABELS[booking.status]}
              </Badge>
              <h3>{booking.serviceName}</h3>
              <p>
                {formatBookingDateTime(booking.startsAt, booking.timezone, {
                  month: undefined,
                  day: undefined,
                  year: undefined,
                  weekday: "long",
                })}{" "}
                to {timeOnly(booking.endsAt, booking.timezone)}
              </p>
            </div>
          </div>

          <dl className={styles.detailList}>
            <div>
              <dt>{role === "client" ? "Provider" : "Client"}</dt>
              <dd>
                {role === "client" ? booking.provider.name : booking.client.name}
              </dd>
            </div>
            {role !== "client" && (
              <div>
                <dt>Client email</dt>
                <dd>{booking.client.email}</dd>
              </div>
            )}
            <div>
              <dt>Price</dt>
              <dd>
                {formatBookingMoney(booking.priceCents, booking.currency)}
              </dd>
            </div>
            <div>
              <dt>Timezone</dt>
              <dd>{booking.timezone.replaceAll("_", " ")}</dd>
            </div>
          </dl>

          {booking.clientNote && (
            <div className={styles.clientNote}>
              <span>Client note</span>
              <p>{booking.clientNote}</p>
            </div>
          )}
          {booking.cancellationReason && (
            <div className={styles.cancellationNote}>
              <span>Update reason</span>
              <p>{booking.cancellationReason}</p>
            </div>
          )}

          <div className={styles.lifecycleSection}>
            <p className={styles.eyebrow}>Actions</p>
            <div className={styles.lifecycleActions}>
              {role !== "client" && booking.status === "requested" && (
                <>
                  <Button
                    type="button"
                    disabled={submitting}
                    onClick={() => mutate("confirm")}
                  >
                    {submitting ? "Updating..." : "Confirm"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={submitting}
                    onClick={() => {
                      setReasonAction("decline");
                      setMode("reason");
                    }}
                  >
                    Decline
                  </Button>
                </>
              )}
              {role !== "client" && booking.status === "confirmed" && (
                <>
                  <Button
                    type="button"
                    disabled={submitting}
                    onClick={() => mutate("complete")}
                  >
                    Complete
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={submitting}
                    onClick={() => mutate("no_show")}
                  >
                    No-show
                  </Button>
                </>
              )}
              {(booking.status === "requested" ||
                booking.status === "confirmed") && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={submitting}
                    onClick={() => setMode("reschedule")}
                  >
                    Reschedule
                  </Button>
                  <button
                    type="button"
                    className={styles.dangerAction}
                    disabled={submitting}
                    onClick={() => {
                      setReasonAction("cancel");
                      setMode("reason");
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
              {!hasLifecycleActions(booking, role) && (
                <p className={styles.noActions}>
                  This appointment has no remaining actions.
                </p>
              )}
            </div>
          </div>
          {error && (
            <p className={styles.formError} role="alert">
              {error}
            </p>
          )}
        </div>
      )}

      {booking && mode === "reschedule" && (
        <div className={styles.drawerForm}>
          <div className={styles.requestNotice}>
            <ClockIcon />
            <p>
              Rescheduling moves the appointment back to Requested so the new
              time can be confirmed.
            </p>
          </div>
          <Input
            label="New date"
            type="date"
            min={todayKey()}
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setSelectedSlot("");
              setActionError("");
            }}
          />
          <div>
            <div className={styles.fieldLabel}>Available times</div>
            {loadingSlots ? (
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
                    {timeOnly(slot.startsAt, booking.timezone)}
                  </button>
                ))}
              </div>
            ) : (
              <div className={styles.slotEmpty}>
                No openings on this date. Try another day.
              </div>
            )}
          </div>
          {error && (
            <p className={styles.formError} role="alert">
              {error}
            </p>
          )}
        </div>
      )}

      {booking && mode === "reason" && (
        <div className={styles.drawerForm}>
          <div className={styles.cautionBlock}>
            <AlertIcon />
            <div>
              <strong>
                {reasonAction === "decline"
                  ? "Decline this request?"
                  : "Cancel this appointment?"}
              </strong>
              <p>
                The other participant will see this status and the optional
                reason.
              </p>
            </div>
          </div>
          <Textarea
            label="Reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            maxLength={300}
            rows={4}
            placeholder="Add a brief, helpful explanation."
          />
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

function hasLifecycleActions(booking: BookingDTO, role: DashboardRole) {
  void role;
  if (booking.status === "requested" || booking.status === "confirmed") {
    return true;
  }
  return false;
}

function statusVariant(status: BookingDTO["status"]) {
  if (status === "confirmed" || status === "completed") return "success";
  if (status === "requested") return "warning";
  if (status === "declined" || status === "cancelled") return "danger";
  return "neutral";
}

function dayNumber(value: string, timezone: string) {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: timezone,
    day: "2-digit",
  }).format(new Date(value));
}

function monthName(value: string, timezone: string) {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: timezone,
    month: "short",
  }).format(new Date(value));
}

function timeOnly(value: string, timezone: string) {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
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

function ClockIcon() {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.3 2.8 1.8 17a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 2.8a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}
