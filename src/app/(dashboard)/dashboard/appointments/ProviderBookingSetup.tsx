"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";
import {
  formatBookingMoney,
  formatBookingDateTime,
  type BookingServiceDTO,
  type ProviderBookingWorkspaceDTO,
} from "@/lib/booking-domain";
import styles from "./AppointmentsClient.module.css";

const DAYS = [
  { value: 1, label: "Monday", short: "Mon" },
  { value: 2, label: "Tuesday", short: "Tue" },
  { value: 3, label: "Wednesday", short: "Wed" },
  { value: 4, label: "Thursday", short: "Thu" },
  { value: 5, label: "Friday", short: "Fri" },
  { value: 6, label: "Saturday", short: "Sat" },
  { value: 0, label: "Sunday", short: "Sun" },
] as const;

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Anchorage",
  "Pacific/Honolulu",
  "America/Toronto",
  "Europe/London",
  "Europe/Paris",
  "Africa/Accra",
  "Africa/Lagos",
  "Africa/Johannesburg",
] as const;

interface WeeklyDay {
  dayOfWeek: number;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

interface ServiceDraft {
  id: string;
  name: string;
  description: string;
  durationMinutes: string;
  price: string;
  braidStyleId: string;
  isActive: boolean;
}

interface ExceptionDraft {
  overrideType: "available" | "unavailable";
  localDate: string;
  startTime: string;
  endTime: string;
  reason: string;
}

export function ProviderBookingSetup({
  initialProvider,
  braidStyles,
  onProviderChange,
}: {
  initialProvider: ProviderBookingWorkspaceDTO;
  braidStyles: Array<{ id: string; name: string }>;
  onProviderChange: (provider: ProviderBookingWorkspaceDTO) => void;
}) {
  const [provider, setProvider] = useState(initialProvider);
  const [timezone, setTimezone] = useState(initialProvider.timezone);
  const [capacity, setCapacity] = useState(
    String(initialProvider.maxConcurrentBookings)
  );
  const [accepting, setAccepting] = useState(
    initialProvider.isAcceptingBookings
  );
  const [weekly, setWeekly] = useState(() => weeklyFromProvider(initialProvider));
  const [serviceDraft, setServiceDraft] = useState<ServiceDraft | null>(null);
  const [exceptionDraft, setExceptionDraft] =
    useState<ExceptionDraft | null>(null);
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");
  const readiness = useMemo(
    () => ({
      timezone: provider.timezone !== "UTC",
      services: provider.services.some((service) => service.isActive),
      hours: provider.rules.some((rule) => rule.isActive),
    }),
    [provider]
  );

  function commit(next: ProviderBookingWorkspaceDTO) {
    setProvider(next);
    setTimezone(next.timezone);
    setCapacity(String(next.maxConcurrentBookings));
    setAccepting(next.isAcceptingBookings);
    setWeekly(weeklyFromProvider(next));
    onProviderChange(next);
  }

  async function saveProviderSettings() {
    await run("settings", async () => {
      const next = await requestProvider("/api/booking/provider", {
        method: "PATCH",
        body: JSON.stringify({
          timezone,
          maxConcurrentBookings: Number(capacity),
          isAcceptingBookings: accepting,
        }),
      });
      commit(next);
    });
  }

  async function saveWeeklyHours() {
    await run("hours", async () => {
      const next = await requestProvider("/api/booking/schedule", {
        method: "PUT",
        body: JSON.stringify({
          rules: weekly.map((day) => ({
            ...day,
            isActive: day.enabled,
          })),
        }),
      });
      commit(next);
    });
  }

  async function saveService() {
    if (!serviceDraft) return;
    await run("service", async () => {
      const url = serviceDraft.id
        ? `/api/booking/services/${serviceDraft.id}`
        : "/api/booking/services";
      const next = await requestProvider(url, {
        method: serviceDraft.id ? "PATCH" : "POST",
        body: JSON.stringify({
          name: serviceDraft.name,
          description: serviceDraft.description,
          durationMinutes: Number(serviceDraft.durationMinutes),
          priceCents: Math.round(Number(serviceDraft.price) * 100),
          currency: "USD",
          braidStyleId: serviceDraft.braidStyleId,
          isActive: serviceDraft.isActive,
        }),
      });
      commit(next);
      setServiceDraft(null);
    });
  }

  async function archiveService(service: BookingServiceDTO) {
    await run(`archive-${service.id}`, async () => {
      const next = await requestProvider(
        `/api/booking/services/${service.id}`,
        { method: "DELETE" }
      );
      commit(next);
    });
  }

  async function saveException() {
    if (!exceptionDraft) return;
    await run("exception", async () => {
      const next = await requestProvider("/api/booking/exceptions", {
        method: "POST",
        body: JSON.stringify(exceptionDraft),
      });
      commit(next);
      setExceptionDraft(null);
    });
  }

  async function deleteException(id: string) {
    await run(`exception-${id}`, async () => {
      const next = await requestProvider(`/api/booking/exceptions/${id}`, {
        method: "DELETE",
      });
      commit(next);
    });
  }

  async function run(key: string, task: () => Promise<void>) {
    setSaving(key);
    setError("");
    try {
      await task();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "The booking configuration could not be saved."
      );
    } finally {
      setSaving("");
    }
  }

  return (
    <>
      <div className={styles.setupLayout}>
        <section className={styles.setupMain}>
          <div className={styles.setupSection}>
            <div className={styles.setupHeading}>
              <div>
                <p className={styles.eyebrow}>Booking profile</p>
                <h2>Availability controls</h2>
                <p>
                  Publish a timezone-aware schedule clients can book against.
                </p>
              </div>
              <span
                className={`${styles.liveBadge} ${
                  provider.isAcceptingBookings ? styles.live : ""
                }`}
              >
                <span />
                {provider.isAcceptingBookings ? "Live" : "Not accepting"}
              </span>
            </div>

            <div className={styles.settingsGrid}>
              <label className={styles.fieldGroup}>
                <span>Timezone</span>
                <select
                  value={timezone}
                  onChange={(event) => setTimezone(event.target.value)}
                >
                  <option value="UTC">Select a local timezone</option>
                  {TIMEZONES.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </label>
              {provider.type === "salon" && (
                <Input
                  label="Concurrent chairs"
                  type="number"
                  min={1}
                  max={20}
                  value={capacity}
                  onChange={(event) => setCapacity(event.target.value)}
                  hint="Maximum appointments your salon can host at once."
                />
              )}
            </div>
            <div className={styles.acceptingRow}>
              <div>
                <strong>Accept appointment requests</strong>
                <p>
                  Clients can see services and request available times when this
                  is enabled.
                </p>
              </div>
              <Switch checked={accepting} onChange={setAccepting} />
            </div>
            <div className={styles.sectionActions}>
              <Button
                type="button"
                disabled={Boolean(saving)}
                onClick={saveProviderSettings}
              >
                {saving === "settings" ? "Saving..." : "Save booking profile"}
              </Button>
            </div>
          </div>

          <div className={styles.setupSection}>
            <div className={styles.setupHeading}>
              <div>
                <p className={styles.eyebrow}>Service menu</p>
                <h2>Services clients can book</h2>
                <p>Duration drives slot length; prices are snapshotted at booking.</p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                iconLeft={<PlusIcon />}
                onClick={() => setServiceDraft(emptyService())}
              >
                Add service
              </Button>
            </div>
            <div className={styles.manageList}>
              {provider.services.map((service) => (
                <div key={service.id} className={styles.manageRow}>
                  <span className={styles.serviceMark}>
                    <ScissorsIcon />
                  </span>
                  <div className={styles.manageBody}>
                    <div>
                      <strong>{service.name}</strong>
                      {!service.isActive && (
                        <span className={styles.archivedLabel}>Archived</span>
                      )}
                    </div>
                    <p>
                      {service.durationMinutes} min ·{" "}
                      {formatBookingMoney(service.priceCents, service.currency)}
                      {service.braidStyleName
                        ? ` · ${service.braidStyleName}`
                        : ""}
                    </p>
                  </div>
                  <div className={styles.rowActions}>
                    <button
                      type="button"
                      className={styles.textButton}
                      onClick={() => setServiceDraft(draftFromService(service))}
                    >
                      Edit
                    </button>
                    {service.isActive && (
                      <button
                        type="button"
                        className={styles.textButtonDanger}
                        disabled={saving === `archive-${service.id}`}
                        onClick={() => archiveService(service)}
                      >
                        {saving === `archive-${service.id}`
                          ? "Archiving..."
                          : "Archive"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {!provider.services.length && (
                <div className={styles.manageEmpty}>
                  <ScissorsIcon />
                  <p>Add the first service clients can request.</p>
                </div>
              )}
            </div>
          </div>

          <div className={styles.setupSection}>
            <div className={styles.setupHeading}>
              <div>
                <p className={styles.eyebrow}>Weekly rhythm</p>
                <h2>Regular booking hours</h2>
                <p>Times are interpreted in {timezone || "your local timezone"}.</p>
              </div>
            </div>
            <div className={styles.weeklyList}>
              {weekly.map((day, index) => {
                const label =
                  DAYS.find((item) => item.value === day.dayOfWeek)?.label ??
                  "";
                return (
                  <div key={day.dayOfWeek} className={styles.weeklyRow}>
                    <div className={styles.dayToggle}>
                      <Switch
                        checked={day.enabled}
                        onChange={(enabled) =>
                          setWeekly((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, enabled } : item
                            )
                          )
                        }
                      />
                      <strong>{label}</strong>
                    </div>
                    {day.enabled ? (
                      <div className={styles.timeRange}>
                        <input
                          type="time"
                          value={day.startTime}
                          onChange={(event) =>
                            updateDay(index, "startTime", event.target.value)
                          }
                          aria-label={`${label} start time`}
                        />
                        <span>to</span>
                        <input
                          type="time"
                          value={day.endTime}
                          onChange={(event) =>
                            updateDay(index, "endTime", event.target.value)
                          }
                          aria-label={`${label} end time`}
                        />
                      </div>
                    ) : (
                      <span className={styles.closedLabel}>Closed</span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className={styles.sectionActions}>
              <Button
                type="button"
                disabled={Boolean(saving)}
                onClick={saveWeeklyHours}
              >
                {saving === "hours" ? "Saving..." : "Save weekly hours"}
              </Button>
            </div>
          </div>

          <div className={styles.setupSection}>
            <div className={styles.setupHeading}>
              <div>
                <p className={styles.eyebrow}>Exceptions</p>
                <h2>Time off and extra hours</h2>
                <p>Override the weekly schedule for specific future dates.</p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                iconLeft={<PlusIcon />}
                onClick={() => setExceptionDraft(emptyException())}
              >
                Add exception
              </Button>
            </div>
            <div className={styles.manageList}>
              {provider.exceptions.map((exception) => (
                <div key={exception.id} className={styles.manageRow}>
                  <span
                    className={`${styles.serviceMark} ${
                      exception.overrideType === "available"
                        ? styles.availableMark
                        : styles.unavailableMark
                    }`}
                  >
                    {exception.overrideType === "available" ? (
                      <PlusIcon />
                    ) : (
                      <BlockIcon />
                    )}
                  </span>
                  <div className={styles.manageBody}>
                    <strong>
                      {exception.overrideType === "available"
                        ? "Extra availability"
                        : "Unavailable"}
                    </strong>
                    <p>
                      {formatBookingDateTime(
                        exception.startsAt,
                        provider.timezone
                      )}{" "}
                      to{" "}
                      {new Intl.DateTimeFormat(undefined, {
                        timeZone: provider.timezone,
                        hour: "numeric",
                        minute: "2-digit",
                      }).format(new Date(exception.endsAt))}
                      {exception.reason ? ` · ${exception.reason}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={styles.textButtonDanger}
                    disabled={saving === `exception-${exception.id}`}
                    onClick={() => deleteException(exception.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              {!provider.exceptions.length && (
                <div className={styles.manageEmpty}>
                  <CalendarOffIcon />
                  <p>No upcoming schedule exceptions.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <aside className={styles.readinessPanel}>
          <p className={styles.eyebrow}>Go-live check</p>
          <h3>Booking readiness</h3>
          <div className={styles.readinessList}>
            <ReadinessRow ready={readiness.timezone} label="Local timezone" />
            <ReadinessRow ready={readiness.services} label="Active service" />
            <ReadinessRow ready={readiness.hours} label="Weekly hours" />
          </div>
          <p className={styles.readinessCopy}>
            All three are required before this profile can accept appointment
            requests.
          </p>
          <div className={styles.timezoneNote}>
            <ClockIcon />
            <span>
              Times are stored as exact instants and displayed in{" "}
              <strong>{provider.timezone}</strong>.
            </span>
          </div>
        </aside>
      </div>

      {error && (
        <div className={styles.floatingError} role="alert">
          <AlertIcon />
          <span>{error}</span>
          <button type="button" onClick={() => setError("")}>
            Dismiss
          </button>
        </div>
      )}

      <ServiceDrawer
        draft={serviceDraft}
        braidStyles={braidStyles}
        saving={saving === "service"}
        onChange={setServiceDraft}
        onClose={() => setServiceDraft(null)}
        onSave={saveService}
      />
      <ExceptionDrawer
        draft={exceptionDraft}
        timezone={provider.timezone}
        saving={saving === "exception"}
        onChange={setExceptionDraft}
        onClose={() => setExceptionDraft(null)}
        onSave={saveException}
      />
    </>
  );

  function updateDay(
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) {
    setWeekly((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  }
}

function ServiceDrawer({
  draft,
  braidStyles,
  saving,
  onChange,
  onClose,
  onSave,
}: {
  draft: ServiceDraft | null;
  braidStyles: Array<{ id: string; name: string }>;
  saving: boolean;
  onChange: (draft: ServiceDraft | null) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  function patch(value: Partial<ServiceDraft>) {
    if (draft) onChange({ ...draft, ...value });
  }
  return (
    <Drawer
      open={Boolean(draft)}
      title={draft?.id ? "Edit service" : "Add a service"}
      description="Set the duration and price clients will see."
      closeDisabled={saving}
      onClose={onClose}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="button" disabled={saving} onClick={onSave}>
            {saving ? "Saving..." : "Save service"}
          </Button>
        </>
      }
    >
      {draft && (
        <div className={styles.drawerForm}>
          <Input
            label="Service name"
            value={draft.name}
            onChange={(event) => patch({ name: event.target.value })}
            maxLength={100}
            required
            placeholder="e.g. Medium knotless braids"
          />
          <label className={styles.fieldGroup}>
            <span>Catalog style</span>
            <select
              value={draft.braidStyleId}
              onChange={(event) => patch({ braidStyleId: event.target.value })}
            >
              <option value="">No linked catalog style</option>
              {braidStyles.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.name}
                </option>
              ))}
            </select>
          </label>
          <Textarea
            label="Description"
            value={draft.description}
            onChange={(event) => patch({ description: event.target.value })}
            maxLength={500}
            rows={4}
            placeholder="What is included, preparation notes, and expected finish."
          />
          <div className={styles.twoColumnFields}>
            <Input
              label="Duration (minutes)"
              type="number"
              min={15}
              max={720}
              step={15}
              value={draft.durationMinutes}
              onChange={(event) =>
                patch({ durationMinutes: event.target.value })
              }
            />
            <Input
              label="Price (USD)"
              type="number"
              min={0}
              max={20000}
              step="0.01"
              value={draft.price}
              onChange={(event) => patch({ price: event.target.value })}
            />
          </div>
          <div className={styles.acceptingRow}>
            <div>
              <strong>Active service</strong>
              <p>Active services are visible when booking is live.</p>
            </div>
            <Switch
              checked={draft.isActive}
              onChange={(isActive) => patch({ isActive })}
            />
          </div>
        </div>
      )}
    </Drawer>
  );
}

function ExceptionDrawer({
  draft,
  timezone,
  saving,
  onChange,
  onClose,
  onSave,
}: {
  draft: ExceptionDraft | null;
  timezone: string;
  saving: boolean;
  onChange: (draft: ExceptionDraft | null) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  function patch(value: Partial<ExceptionDraft>) {
    if (draft) onChange({ ...draft, ...value });
  }
  return (
    <Drawer
      open={Boolean(draft)}
      title="Add a schedule exception"
      description={`Times use ${timezone}.`}
      closeDisabled={saving}
      onClose={onClose}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="button" disabled={saving} onClick={onSave}>
            {saving ? "Saving..." : "Add exception"}
          </Button>
        </>
      }
    >
      {draft && (
        <div className={styles.drawerForm}>
          <div className={styles.exceptionType}>
            <button
              type="button"
              className={
                draft.overrideType === "unavailable"
                  ? styles.exceptionTypeActive
                  : ""
              }
              onClick={() => patch({ overrideType: "unavailable" })}
            >
              <BlockIcon />
              Time off
            </button>
            <button
              type="button"
              className={
                draft.overrideType === "available"
                  ? styles.exceptionTypeActive
                  : ""
              }
              onClick={() => patch({ overrideType: "available" })}
            >
              <PlusIcon />
              Extra hours
            </button>
          </div>
          <Input
            label="Date"
            type="date"
            min={todayKey()}
            value={draft.localDate}
            onChange={(event) => patch({ localDate: event.target.value })}
          />
          <div className={styles.twoColumnFields}>
            <Input
              label="Start time"
              type="time"
              value={draft.startTime}
              onChange={(event) => patch({ startTime: event.target.value })}
            />
            <Input
              label="End time"
              type="time"
              value={draft.endTime}
              onChange={(event) => patch({ endTime: event.target.value })}
            />
          </div>
          <Input
            label="Reason"
            value={draft.reason}
            onChange={(event) => patch({ reason: event.target.value })}
            maxLength={160}
            placeholder={
              draft.overrideType === "available"
                ? "e.g. Holiday appointments"
                : "e.g. Personal time"
            }
          />
        </div>
      )}
    </Drawer>
  );
}

function ReadinessRow({
  ready,
  label,
}: {
  ready: boolean;
  label: string;
}) {
  return (
    <div className={ready ? styles.readyRow : styles.notReadyRow}>
      <span>{ready ? <CheckIcon /> : <MinusIcon />}</span>
      <strong>{label}</strong>
      <small>{ready ? "Ready" : "Required"}</small>
    </div>
  );
}

async function requestProvider(url: string, init: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? "Booking configuration could not be saved.");
  }
  return data.provider as ProviderBookingWorkspaceDTO;
}

function weeklyFromProvider(
  provider: ProviderBookingWorkspaceDTO
): WeeklyDay[] {
  return DAYS.map((day) => {
    const rule = provider.rules.find(
      (item) => item.dayOfWeek === day.value && item.isActive
    );
    return {
      dayOfWeek: day.value,
      enabled: Boolean(rule),
      startTime: rule?.startTime.slice(0, 5) ?? "09:00",
      endTime: rule?.endTime.slice(0, 5) ?? "17:00",
    };
  });
}

function emptyService(): ServiceDraft {
  return {
    id: "",
    name: "",
    description: "",
    durationMinutes: "180",
    price: "150",
    braidStyleId: "",
    isActive: true,
  };
}

function draftFromService(service: BookingServiceDTO): ServiceDraft {
  return {
    id: service.id,
    name: service.name,
    description: service.description,
    durationMinutes: String(service.durationMinutes),
    price: String(service.priceCents / 100),
    braidStyleId: service.braidStyleId ?? "",
    isActive: service.isActive,
  };
}

function emptyException(): ExceptionDraft {
  return {
    overrideType: "unavailable",
    localDate: tomorrowKey(),
    startTime: "09:00",
    endTime: "17:00",
    reason: "",
  };
}

function todayKey() {
  return localDateKey(new Date());
}

function tomorrowKey() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return localDateKey(date);
}

function localDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ScissorsIcon() {
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
      <circle cx="6" cy="7" r="3" />
      <circle cx="6" cy="17" r="3" />
      <path d="m8.7 8.4 11.3 6.1M8.7 15.6 20 9.5" />
    </svg>
  );
}

function BlockIcon() {
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
      <circle cx="12" cy="12" r="9" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function CalendarOffIcon() {
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
      <path d="M8 2v4M16 2v4M3 10h13M5 4h14a2 2 0 0 1 2 2v9" />
      <path d="m15 18 6 6M21 18l-6 6" />
      <path d="M11 22H5a2 2 0 0 1-2-2V6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 12h12" />
    </svg>
  );
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
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.3 2.8 1.8 17a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 2.8a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}
