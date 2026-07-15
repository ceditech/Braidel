"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/components/dashboard/RoleContext";
import { Topbar } from "@/components/dashboard/Topbar";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { Tag } from "@/components/ui/Tag";
import { Avatar } from "@/components/ui/Avatar";
import { Photo } from "@/components/ui/Photo";
import type { SettingsProfileDTO } from "@/db/queries";

type SaveState = "idle" | "saving" | "saved" | "error";

export function SettingsClient({
  profile,
  styleOptions,
}: {
  profile: SettingsProfileDTO;
  styleOptions: string[];
}) {
  const { role } = useRole();
  const title = role === "salon" ? "Manage your salon account." : "Manage your braider profile and account.";

  return (
    <>
      <Topbar title="Settings" subtitle={title} />
      <div style={{ padding: 32, maxWidth: 820, display: "flex", flexDirection: "column", gap: 20 }}>
        {role === "braider" ? (
          <BraiderSettings profile={profile} styleOptions={styleOptions} />
        ) : (
          <SalonSettings profile={profile} styleOptions={styleOptions} />
        )}
      </div>
    </>
  );
}

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card padded>
      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, margin: "0 0 18px", color: "var(--charcoal-900)" }}>
        {title}
      </h3>
      {children}
    </Card>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
      <span style={{ fontSize: 15, color: "var(--text-body)" }}>{label}</span>
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
}

function StatusMessage({ state, error }: { state: SaveState; error: string | null }) {
  if (state === "idle") return null;
  const color = state === "error" ? "var(--danger)" : "var(--sage-700)";
  return (
    <div style={{ fontSize: 14, fontWeight: 700, color }}>
      {state === "saving" ? "Saving..." : state === "saved" ? "Saved changes." : error ?? "Could not save changes."}
    </div>
  );
}

function SaveBar({
  state,
  error,
  onSave,
}: {
  state: SaveState;
  error: string | null;
  onSave: () => void;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
      <StatusMessage state={state} error={error} />
      <Button onClick={onSave} disabled={state === "saving"}>
        {state === "saving" ? "Saving..." : "Save changes"}
      </Button>
    </div>
  );
}

function toggleListValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function SalonSettings({
  profile,
  styleOptions,
}: {
  profile: SettingsProfileDTO;
  styleOptions: string[];
}) {
  const router = useRouter();
  const salon = profile.salon;
  const [name, setName] = useState(salon?.name ?? "");
  const [city, setCity] = useState(salon?.city ?? "");
  const [bio, setBio] = useState(salon?.bio ?? "");
  const [phone, setPhone] = useState(salon?.phone ?? "");
  const [website, setWebsite] = useState(salon?.website ?? "");
  const [services, setServices] = useState<string[]>(salon?.services ?? []);
  const [newApplicants, setNewApplicants] = useState(true);
  const [messages, setMessages] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [state, setState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setState("saving");
    setError(null);
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "salon", name, city, bio, phone, website, services }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setState("error");
      setError(data.error ?? "Could not save salon settings.");
      return;
    }
    setState("saved");
    router.refresh();
  }

  return (
    <>
      <SettingsCard title="Salon profile">
        {!salon && <MissingProfile role="salon" />}
        <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 20 }}>
          <Avatar name={name || "Salon"} size="xl" ring />
          <Button variant="outline" size="sm" disabled>Logo upload later</Button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Input label="Salon name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Atlanta, GA" />
          <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(404) 555-0199" />
          <Input label="Website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://example.com" />
        </div>
        <div style={{ marginTop: 16 }}>
          <Textarea label="About the salon" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
      </SettingsCard>

      <SettingsCard title="Services">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {styleOptions.map((style) => (
            <Tag key={style} selected={services.includes(style)} onClick={() => setServices((current) => toggleListValue(current, style))}>
              {style}
            </Tag>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Notifications">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <ToggleRow label="New applicants" checked={newApplicants} onChange={setNewApplicants} />
          <ToggleRow label="Messages" checked={messages} onChange={setMessages} />
          <ToggleRow label="Weekly digest email" checked={weeklyDigest} onChange={setWeeklyDigest} />
        </div>
      </SettingsCard>

      <SaveBar state={state} error={error} onSave={save} />
    </>
  );
}

function BraiderSettings({
  profile,
  styleOptions,
}: {
  profile: SettingsProfileDTO;
  styleOptions: string[];
}) {
  const router = useRouter();
  const braider = profile.braider;
  const [fullName, setFullName] = useState(braider?.fullName || `${profile.user?.firstName ?? ""} ${profile.user?.lastName ?? ""}`.replace(/\s*-$/, "").trim());
  const [city, setCity] = useState(braider?.city ?? "");
  const [bio, setBio] = useState(braider?.bio ?? "");
  const [priceRange, setPriceRange] = useState(braider?.priceRange ?? "");
  const [yearsExperience, setYearsExperience] = useState(braider?.yearsExperience?.toString() ?? "");
  const [specialties, setSpecialties] = useState<string[]>(braider?.specialties ?? []);
  const [isAvailable, setIsAvailable] = useState(braider?.isAvailable ?? true);
  const [matchingJobs, setMatchingJobs] = useState(true);
  const [messages, setMessages] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [state, setState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setState("saving");
    setError(null);
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: "braider",
        fullName,
        city,
        bio,
        priceRange,
        yearsExperience,
        specialties,
        isAvailable,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setState("error");
      setError(data.error ?? "Could not save braider settings.");
      return;
    }
    setState("saved");
    router.refresh();
  }

  return (
    <>
      <SettingsCard title="Profile">
        {!braider && <MissingProfile role="braider" />}
        <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 20 }}>
          <Avatar name={fullName || "Braider"} size="xl" ring />
          <Button variant="outline" size="sm" disabled>Photo upload later</Button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Atlanta, GA" />
          <Input label="Price range" value={priceRange} onChange={(e) => setPriceRange(e.target.value)} placeholder="$160-$280" />
          <Input label="Years experience" value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} inputMode="numeric" />
        </div>
        <div style={{ marginTop: 16 }}>
          <Textarea label="Bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
      </SettingsCard>

      <SettingsCard title="Specialties">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {styleOptions.map((style) => (
            <Tag key={style} selected={specialties.includes(style)} onClick={() => setSpecialties((current) => toggleListValue(current, style))}>
              {style}
            </Tag>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Portfolio">
        <p style={{ margin: "0 0 14px", fontSize: 14, color: "var(--text-muted)" }}>
          Portfolio media persistence is next after profile fields; existing placeholders remain visual only.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ borderRadius: "var(--radius-md)", overflow: "hidden" }}>
              <Photo seed={i} aspect="1/1" radius="var(--radius-md)" />
            </div>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Availability & notifications">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <ToggleRow label="Available for work" checked={isAvailable} onChange={setIsAvailable} />
          <ToggleRow label="New matching jobs" checked={matchingJobs} onChange={setMatchingJobs} />
          <ToggleRow label="Messages" checked={messages} onChange={setMessages} />
          <ToggleRow label="Weekly digest email" checked={weeklyDigest} onChange={setWeeklyDigest} />
        </div>
      </SettingsCard>

      <SaveBar state={state} error={error} onSave={save} />
    </>
  );
}

function MissingProfile({ role }: { role: "salon" | "braider" }) {
  return (
    <div style={{ marginBottom: 16, padding: 12, borderRadius: "var(--radius-md)", background: "var(--brand-soft)", color: "var(--text-body)", border: "1px solid var(--brand-soft-border)", fontSize: 14 }}>
      No {role} profile is attached to this signed-in account yet. Saving is available after onboarding creates that profile.
    </div>
  );
}
