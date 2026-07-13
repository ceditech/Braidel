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
import { OPPORTUNITY_TYPES, EXPERIENCE_LEVELS } from "@/lib/sampleData";
import type { BraidStyleDTO, OpportunityDTO } from "@/db/queries";

type PanelTab = "opportunities" | "styles";
type ModalState =
  | { kind: "opportunity"; opportunity: OpportunityDTO }
  | { kind: "style"; style: StyleOption }
  | null;
type StyleOption = BraidStyleDTO & { isCustomDraft?: boolean };

export function NewOpportunityClient({
  opportunities,
  styles,
}: {
  opportunities: OpportunityDTO[];
  styles: BraidStyleDTO[];
}) {
  const router = useRouter();
  const [specs, setSpecs] = useState<string[]>(styles[0]?.name ? [styles[0].name] : []);
  const [customStyles, setCustomStyles] = useState<StyleOption[]>([]);
  const [customStyleName, setCustomStyleName] = useState("");
  const [showAllStyles, setShowAllStyles] = useState(false);
  const [showName, setShowName] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<PanelTab>("opportunities");
  const [modal, setModal] = useState<ModalState>(null);
  const allStyles = [...styles, ...customStyles];
  const visibleStyles = showAllStyles ? allStyles : allStyles.slice(0, 14);

  const toggle = (style: StyleOption) => {
    setSpecs((active) => (
      active.includes(style.name)
        ? active.filter((name) => name !== style.name)
        : [...active, style.name]
    ));
    setModal({ kind: "style", style });
  };

  const addCustomStyle = () => {
    const name = customStyleName.trim();
    if (!name) return;
    const exists = allStyles.some((style) => style.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      const match = allStyles.find((style) => style.name.toLowerCase() === name.toLowerCase());
      if (match && !specs.includes(match.name)) setSpecs((active) => [...active, match.name]);
      setCustomStyleName("");
      return;
    }
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const style: StyleOption = {
      id: `custom-${slug || Date.now()}`,
      catalogId: null,
      name,
      slug: slug || `custom-${Date.now()}`,
      description: "Custom specialty added by the opportunity poster.",
      imagePrompt: "",
      imagePath: "",
      isCustom: true,
      isCustomDraft: true,
    };
    setCustomStyles((current) => [...current, style]);
    setSpecs((active) => [...active, style.name]);
    setCustomStyleName("");
  };

  async function submit(formData: FormData, status: "active" | "draft") {
    setPending(true);
    setError(null);
    const res = await fetch("/api/opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        type: formData.get("type"),
        compensation: formData.get("compensation"),
        location: formData.get("location"),
        description: formData.get("description"),
        specialties: specs,
        customStyles: customStyles.map((style) => ({
          name: style.name,
          description: style.description,
        })),
        status,
        showName,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setPending(false);
    if (!res.ok) {
      setError(data.error ?? "Could not save opportunity.");
      return;
    }
    router.push(status === "active" ? "/dashboard/applicants" : "/dashboard/opportunities");
  }

  return (
    <>
      <Topbar title="Post an opportunity" subtitle="Reach skilled braiders near you." />

      <div
        style={{
          padding: 32,
          display: "grid",
          gridTemplateColumns: "minmax(560px, 1.1fr) minmax(340px, 0.9fr)",
          gap: 24,
          alignItems: "start",
        }}
      >
        <div>
          <Card padded>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(new FormData(e.currentTarget), "active");
              }}
              style={{ display: "flex", flexDirection: "column", gap: 18 }}
            >
              <Input name="title" label="Title" placeholder="e.g. Weekend knotless specialist" required />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Select name="type" label="Employment type" options={OPPORTUNITY_TYPES} />
                <Select label="Experience" options={EXPERIENCE_LEVELS} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Input name="compensation" label="Compensation" placeholder="$28-35 / hr" iconLeft={<DollarIcon />} />
                <Input name="location" label="Location" placeholder="Atlanta, GA" iconLeft={<PinIcon />} />
              </div>

              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-strong)", marginBottom: 8 }}>
                  Specialties needed
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingRight: 4 }}>
                  {visibleStyles.map((style) => (
                    <Tag key={style.id} selected={specs.includes(style.name)} onClick={() => toggle(style)}>
                      {style.name}
                    </Tag>
                  ))}
                </div>
                {allStyles.length > visibleStyles.length || showAllStyles ? (
                  <button
                    type="button"
                    onClick={() => setShowAllStyles((open) => !open)}
                    style={{ marginTop: 10, border: "none", background: "transparent", color: "var(--brand)", fontWeight: 700, cursor: "pointer", padding: 0 }}
                  >
                    {showAllStyles ? "See fewer styles" : `See ${allStyles.length - visibleStyles.length} more styles`}
                  </button>
                ) : null}
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <Input
                    value={customStyleName}
                    onChange={(e) => setCustomStyleName(e.target.value)}
                    placeholder="Add another style"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomStyle();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addCustomStyle}>Add</Button>
                </div>
              </div>

              <Textarea
                name="description"
                label="Description"
                rows={5}
                placeholder="Tell braiders about the role, schedule, and your salon..."
                required
              />

              <Checkbox checked={showName} onChange={setShowName} label="Show my salon name publicly on this post" />

              {error && <div style={{ color: "var(--danger)", fontSize: 14 }}>{error}</div>}

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", borderTop: "1px solid var(--border-subtle)", paddingTop: 18 }}>
                <Button type="button" variant="ghost" disabled={pending} onClick={(e) => submit(new FormData(e.currentTarget.form!), "draft")}>Save draft</Button>
                <Button type="submit" disabled={pending} iconRight={<ArrowRight />}>{pending ? "Saving..." : "Publish opportunity"}</Button>
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

        <LeftPanel
          tab={tab}
          setTab={setTab}
          opportunities={opportunities}
          styles={allStyles}
          onOpenOpportunity={(opportunity) => setModal({ kind: "opportunity", opportunity })}
          onOpenStyle={(style) => setModal({ kind: "style", style })}
        />
      </div>

      {modal && <DetailModal modal={modal} onClose={() => setModal(null)} />}
    </>
  );
}

function LeftPanel({
  tab,
  setTab,
  opportunities,
  styles,
  onOpenOpportunity,
  onOpenStyle,
}: {
  tab: PanelTab;
  setTab: (tab: PanelTab) => void;
  opportunities: OpportunityDTO[];
  styles: StyleOption[];
  onOpenOpportunity: (opportunity: OpportunityDTO) => void;
  onOpenStyle: (style: StyleOption) => void;
}) {
  return (
    <Card padded style={{ position: "sticky", top: 92 }}>
      <div style={{ display: "flex", gap: 8, padding: 4, border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", background: "var(--bg-subtle)", marginBottom: 16 }}>
        <PanelButton active={tab === "opportunities"} onClick={() => setTab("opportunities")}>Posted</PanelButton>
        <PanelButton active={tab === "styles"} onClick={() => setTab("styles")}>Styles</PanelButton>
      </div>

      {tab === "opportunities" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: "calc(100vh - 210px)", overflowY: "auto", paddingRight: 4 }}>
          {opportunities.length === 0 ? (
            <EmptyPanel title="No opportunities yet" body="Published and draft posts will appear here as reusable reference cards." />
          ) : opportunities.map((opportunity) => (
            <button key={opportunity.id} type="button" onClick={() => onOpenOpportunity(opportunity)} style={panelCardButtonStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, color: "var(--text-strong)", marginBottom: 5 }}>{opportunity.title}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{opportunity.type} · {opportunity.city || "Location TBD"}</div>
                </div>
                <div style={{ textAlign: "right", color: "var(--brand)", fontFamily: "var(--font-display)", fontWeight: 700 }}>{opportunity.applicants}</div>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                {opportunity.specs.slice(0, 3).map((spec) => <span key={spec} style={miniPillStyle}>{spec}</span>)}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: "calc(100vh - 210px)", overflowY: "auto", paddingRight: 4 }}>
          {styles.map((style) => (
            <StyleCard key={style.id} style={style} onClick={() => onOpenStyle(style)} />
          ))}
        </div>
      )}
    </Card>
  );
}

function PanelButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        height: 38,
        border: "none",
        borderRadius: "var(--radius-sm)",
        background: active ? "var(--surface-card)" : "transparent",
        color: active ? "var(--text-strong)" : "var(--text-muted)",
        boxShadow: active ? "var(--shadow-sm)" : "none",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function StyleCard({ style, onClick }: { style: StyleOption; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={panelCardButtonStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: "var(--text-strong)", marginBottom: 6 }}>{style.name}</div>
          <p style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.5, margin: 0 }}>
            {style.description}
          </p>
        </div>
        {style.isCustom ? <span style={miniPillStyle}>Custom</span> : null}
      </div>
    </button>
  );
}

function StyleImage({ style, height }: { style: StyleOption; height: number }) {
  const [failed, setFailed] = useState(false);
  return (
    <div style={{ height, borderRadius: "var(--radius-md)", overflow: "hidden", background: "linear-gradient(135deg, var(--brand-soft), var(--gold-100))", border: "1px solid var(--border-subtle)" }}>
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={style.imagePath} alt={style.name} onError={() => setFailed(true)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      ) : (
        <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", padding: 16, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
          Custom style
        </div>
      )}
    </div>
  );
}

function DetailModal({ modal, onClose }: { modal: ModalState; onClose: () => void }) {
  if (!modal) return null;
  const isStyle = modal.kind === "style";
  const title = isStyle ? modal.style.name : modal.opportunity.title;

  return (
    <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, zIndex: 80, display: "grid", placeItems: "center", padding: 24 }}>
      <button type="button" aria-label="Close details" onClick={onClose} style={{ position: "absolute", inset: 0, border: "none", background: "rgba(20, 15, 11, .42)", cursor: "pointer" }} />
      <div style={{ position: "relative", width: "min(760px, 100%)", maxHeight: "88vh", overflowY: "auto", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", boxShadow: "0 28px 80px rgba(32, 22, 15, .28)" }}>
        <div style={{ padding: 22, borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "var(--text-strong)" }}>{title}</div>
            <div style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>{isStyle ? "Style guide" : "Posted opportunity"}</div>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>Close</Button>
        </div>
        <div style={{ padding: 22 }}>
          {isStyle ? (
            <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, alignItems: "start" }}>
              <StyleImage style={modal.style} height={280} />
              <div>
                <p style={{ margin: 0, lineHeight: 1.7, color: "var(--text-body)" }}>{modal.style.description}</p>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <p style={{ margin: 0, lineHeight: 1.7, color: "var(--text-body)" }}>{modal.opportunity.description}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                <InfoTile label="Type" value={modal.opportunity.type} />
                <InfoTile label="Compensation" value={modal.opportunity.pay} />
                <InfoTile label="Applicants" value={String(modal.opportunity.applicants)} />
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {modal.opportunity.specs.map((spec) => <span key={spec} style={miniPillStyle}>{spec}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: 14, background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 5 }}>{label}</div>
      <div style={{ fontWeight: 700, color: "var(--text-strong)" }}>{value}</div>
    </div>
  );
}

function EmptyPanel({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ padding: 22, border: "1px dashed var(--border-default)", borderRadius: "var(--radius-md)", textAlign: "center" }}>
      <div style={{ fontWeight: 800, color: "var(--text-strong)", marginBottom: 6 }}>{title}</div>
      <div style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.5 }}>{body}</div>
    </div>
  );
}

const panelCardButtonStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--border-subtle)",
  background: "var(--surface-card)",
  borderRadius: "var(--radius-md)",
  padding: 14,
  textAlign: "left",
  cursor: "pointer",
  boxShadow: "var(--shadow-sm)",
};

const miniPillStyle: React.CSSProperties = {
  display: "inline-flex",
  borderRadius: 999,
  padding: "4px 9px",
  fontSize: 12,
  background: "var(--brand-soft)",
  color: "var(--text-body)",
  border: "1px solid var(--brand-soft-border)",
};

function DollarIcon()  { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>; }
function PinIcon()     { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function ArrowRight()  { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>; }
function ChevronIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>; }
