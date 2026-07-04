"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/dashboard/Topbar";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Tag } from "@/components/ui/Tag";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { SPECIALTIES, OPPORTUNITY_TYPES, EXPERIENCE_LEVELS } from "@/lib/sampleData";

export default function NewOpportunityPage() {
  const router = useRouter();
  const [specs, setSpecs] = useState<string[]>(["Knotless"]);
  const [showName, setShowName] = useState(true);

  const toggle = (s: string) =>
    setSpecs((a) => (a.includes(s) ? a.filter((x) => x !== s) : [...a, s]));

  // Mock submit — no backend yet (see CLAUDE_HANDOFF §4 data strategy)
  const publish = () => router.push("/dashboard/applicants");
  const saveDraft = () => router.push("/dashboard/opportunities");

  return (
    <>
      <Topbar title="Post an opportunity" subtitle="Reach skilled braiders near you." />

      <div style={{ padding: 32, maxWidth: 760 }}>
        <Card padded>
          <form
            onSubmit={(e) => { e.preventDefault(); publish(); }}
            style={{ display: "flex", flexDirection: "column", gap: 18 }}
          >
            <Input label="Title" placeholder="e.g. Weekend knotless specialist" required />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Select label="Employment type" options={OPPORTUNITY_TYPES} />
              <Select label="Experience" options={EXPERIENCE_LEVELS} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Input label="Compensation" placeholder="$28–35 / hr" iconLeft={<DollarIcon />} />
              <Input label="Location" placeholder="Atlanta, GA" iconLeft={<PinIcon />} />
            </div>

            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-strong)", marginBottom: 8 }}>
                Specialties needed
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {SPECIALTIES.map((s) => (
                  <Tag key={s} selected={specs.includes(s)} onClick={() => toggle(s)}>{s}</Tag>
                ))}
              </div>
            </div>

            <Textarea
              label="Description"
              rows={5}
              placeholder="Tell braiders about the role, schedule, and your salon…"
            />

            <Checkbox
              checked={showName}
              onChange={setShowName}
              label="Show my salon name publicly on this post"
            />

            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "flex-end",
                borderTop: "1px solid var(--border-subtle)",
                paddingTop: 18,
              }}
            >
              <Button type="button" variant="ghost" onClick={saveDraft}>Save draft</Button>
              <Button type="submit" iconRight={<ArrowRight />}>Publish opportunity</Button>
            </div>
          </form>
        </Card>

        <div style={{ marginTop: 16 }}>
          <Link href="/dashboard/opportunities" style={{ color: "var(--text-muted)", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={{ transform: "rotate(180deg)", display: "inline-flex" }}><ChevronIcon /></span>
            Back to opportunities
          </Link>
        </div>
      </div>
    </>
  );
}

function DollarIcon()  { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>; }
function PinIcon()     { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function ArrowRight()  { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>; }
function ChevronIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>; }
