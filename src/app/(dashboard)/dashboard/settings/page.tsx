"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
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
import { SPECIALTIES } from "@/lib/sampleData";

export default function SettingsPage() {
  const { role } = useRole();
  const { user } = useUser();
  const fullName = user?.fullName ?? "Your name";

  return (
    <>
      <Topbar
        title="Settings"
        subtitle={role === "salon" ? "Manage your salon account." : "Manage your braider profile and account."}
      />
      <div style={{ padding: 32, maxWidth: 720, display: "flex", flexDirection: "column", gap: 20 }}>
        {role === "braider" ? (
          <BraiderSettings fullName={fullName} />
        ) : (
          <SalonSettings />
        )}
      </div>
    </>
  );
}

/* ── Shared building blocks ──────────────────────────────────────── */
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

function ToggleRow({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 15, color: "var(--text-body)" }}>{label}</span>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

function SaveBar({ onSave }: { onSave?: () => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
      <Button onClick={onSave}>Save changes</Button>
    </div>
  );
}

/* ── Salon settings ──────────────────────────────────────────────── */
function SalonSettings() {
  return (
    <>
      <SettingsCard title="Salon profile">
        <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 20 }}>
          <Avatar name="Crown Coils" size="xl" ring />
          <Button variant="outline" size="sm">Change logo</Button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Input label="Salon name" defaultValue="Crown & Coils" />
          <Input label="City" defaultValue="Atlanta, GA" />
        </div>
        <div style={{ marginTop: 16 }}>
          <Textarea label="About the salon" rows={3} defaultValue="Busy, welcoming Atlanta salon with a supportive team and steady clientele." />
        </div>
      </SettingsCard>

      <SettingsCard title="Notifications">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <ToggleRow label="New applicants" defaultChecked />
          <ToggleRow label="Messages" defaultChecked />
          <ToggleRow label="Weekly digest email" />
        </div>
      </SettingsCard>

      <SaveBar />
    </>
  );
}

/* ── Braider settings (= profile editor) ─────────────────────────── */
function BraiderSettings({ fullName }: { fullName: string }) {
  const [specs, setSpecs] = useState<string[]>(["Knotless", "Feed-in"]);
  const toggle = (s: string) => setSpecs((a) => (a.includes(s) ? a.filter((x) => x !== s) : [...a, s]));

  return (
    <>
      <SettingsCard title="Profile">
        <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 20 }}>
          <Avatar name={fullName} size="xl" ring />
          <Button variant="outline" size="sm">Change photo</Button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Input label="Full name" defaultValue={fullName} />
          <Input label="City" defaultValue="Atlanta, GA" />
        </div>
        <div style={{ marginTop: 16 }}>
          <Textarea label="Bio" rows={4} defaultValue="Atlanta-based braider specializing in knotless and feed-in styles that protect your edges and last." />
        </div>
      </SettingsCard>

      <SettingsCard title="Specialties">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {SPECIALTIES.map((s) => (
            <Tag key={s} selected={specs.includes(s)} onClick={() => toggle(s)}>{s}</Tag>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Portfolio">
        <p style={{ margin: "0 0 14px", fontSize: 14, color: "var(--text-muted)" }}>
          Add photos of your work — braiders with 6+ photos rank higher in salon searches.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ borderRadius: "var(--radius-md)", overflow: "hidden" }}>
              <Photo seed={i} aspect="1/1" radius="var(--radius-md)" />
            </div>
          ))}
          {[0, 1].map((i) => (
            <button
              key={`add-${i}`}
              type="button"
              style={{
                aspectRatio: "1/1",
                borderRadius: "var(--radius-md)",
                border: "1.5px dashed var(--border-strong)",
                background: "var(--bg-subtle)",
                color: "var(--text-muted)",
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
              }}
            >
              <PlusIcon />
            </button>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Availability & notifications">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <ToggleRow label="Available for work" defaultChecked />
          <ToggleRow label="New matching jobs" defaultChecked />
          <ToggleRow label="Messages" defaultChecked />
          <ToggleRow label="Weekly digest email" />
        </div>
      </SettingsCard>

      <SaveBar />
    </>
  );
}

function PlusIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>;
}
