"use client";
import { useState, useMemo } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CONVERSATIONS, type SampleMessage } from "@/lib/sampleData";

export default function MessagesPage() {
  // Thread state keyed by conversation id so sends persist across switches.
  const [threads, setThreads] = useState<Record<string, SampleMessage[]>>(
    () => Object.fromEntries(CONVERSATIONS.map((c) => [c.id, c.messages]))
  );
  const [selectedId, setSelectedId] = useState(CONVERSATIONS[0].id);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");

  const active = CONVERSATIONS.find((c) => c.id === selectedId)!;
  const thread = threads[selectedId];

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return CONVERSATIONS;
    return CONVERSATIONS.filter((c) => c.name.toLowerCase().includes(q));
  }, [search]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setThreads((prev) => ({ ...prev, [selectedId]: [...prev[selectedId], { me: true, text, time: now }] }));
    setDraft("");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", height: "100vh" }}>
      {/* ── Conversation list ─────────────────────────────────────── */}
      <div style={{ borderRight: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", background: "var(--surface-card)", minWidth: 0 }}>
        <div style={{ padding: "18px 18px 12px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, margin: "0 0 12px", color: "var(--charcoal-900)" }}>
            Messages
          </h2>
          <Input
            inputSize="sm"
            placeholder="Search conversations"
            iconLeft={<SearchIcon />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {visible.map((c) => {
            const selected = c.id === selectedId;
            const last = threads[c.id][threads[c.id].length - 1];
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  display: "flex",
                  gap: 12,
                  padding: "14px 18px",
                  cursor: "pointer",
                  border: "none",
                  background: selected ? "var(--bg-subtle)" : "transparent",
                  borderLeft: `3px solid ${selected ? "var(--brand)" : "transparent"}`,
                }}
              >
                <Avatar name={c.name} size="md" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontWeight: 600, color: "var(--text-strong)", fontSize: 15 }}>{c.name}</span>
                    <span style={{ fontSize: 12, color: "var(--text-subtle)", flexShrink: 0 }}>{c.time}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, color: c.unread ? "var(--text-body)" : "var(--text-muted)", fontWeight: c.unread ? 600 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {last?.text}
                    </span>
                    {c.unread && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--brand)", flexShrink: 0 }} />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Thread ────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", background: "var(--bg-page)", minWidth: 0 }}>
        {/* Thread header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 24px", borderBottom: "1px solid var(--border-subtle)", background: "var(--surface-card)" }}>
          <Avatar name={active.name} size="md" />
          <div>
            <div style={{ fontWeight: 700, color: "var(--text-strong)" }}>{active.name}</div>
            {active.online ? (
              <div style={{ fontSize: 13, color: "var(--success-strong)" }}>● Online</div>
            ) : (
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Offline</div>
            )}
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <Badge variant="brand">{active.context}</Badge>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "26px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ textAlign: "center", fontSize: 12, color: "var(--text-subtle)", fontFamily: "var(--font-mono)" }}>Today</div>
          {thread.map((m, i) => (
            <div key={i} style={{ alignSelf: m.me ? "flex-end" : "flex-start", maxWidth: "62%" }}>
              <div
                style={{
                  padding: "11px 15px",
                  borderRadius: m.me ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: m.me ? "var(--brand)" : "var(--surface-card)",
                  color: m.me ? "var(--cream-50)" : "var(--text-body)",
                  border: m.me ? "none" : "1px solid var(--border-subtle)",
                  fontSize: 15,
                  lineHeight: 1.5,
                  boxShadow: "var(--shadow-xs)",
                }}
              >
                {m.text}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-subtle)", marginTop: 4, textAlign: m.me ? "right" : "left" }}>{m.time}</div>
            </div>
          ))}
        </div>

        {/* Composer */}
        <div style={{ padding: "14px 24px 20px", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: 10, alignItems: "center", background: "var(--surface-card)" }}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder="Write a message…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); send(); } }}
            />
          </div>
          <Button onClick={send} aria-label="Send" style={{ width: 44, padding: 0 }}>
            <SendIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}

function SearchIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>; }
function SendIcon()   { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>; }
