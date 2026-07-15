"use client";

import { useEffect, useMemo, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { ConversationDTO, MessageDTO } from "@/db/queries";
import styles from "./MessagesClient.module.css";

interface MessagesClientProps {
  initialConversations: ConversationDTO[];
  initialSelectedId?: string;
  renderedAt: string;
}

const DATE_KEY = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Chicago",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const TIME_LABEL = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago",
  hour: "numeric",
  minute: "2-digit",
});
const DATE_LABEL = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago",
  month: "short",
  day: "numeric",
});

function activityLabel(value: string, renderedAt: string): string {
  const date = new Date(value);
  return DATE_KEY.format(date) === DATE_KEY.format(new Date(renderedAt))
    ? TIME_LABEL.format(date)
    : DATE_LABEL.format(date);
}

async function responseError(response: Response): Promise<string> {
  const payload = await response.json().catch(() => ({}));
  return typeof payload.error === "string" ? payload.error : "Something went wrong";
}

export function MessagesClient({
  initialConversations,
  initialSelectedId,
  renderedAt,
}: MessagesClientProps) {
  const initialId = initialConversations.some((conversation) => conversation.id === initialSelectedId)
    ? initialSelectedId
    : initialConversations[0]?.id;
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState(initialId);
  const [mobileThreadOpen, setMobileThreadOpen] = useState(Boolean(initialSelectedId));
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const active = conversations.find((conversation) => conversation.id === selectedId);
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return conversations;
    return conversations.filter(
      (conversation) =>
        conversation.name.toLowerCase().includes(query) ||
        conversation.context.toLowerCase().includes(query)
    );
  }, [conversations, search]);

  useEffect(() => {
    if (!active?.unread) return;

    const controller = new AbortController();
    fetch("/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId: active.id }),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(await responseError(response));
        setConversations((current) =>
          current.map((conversation) =>
            conversation.id === active.id ? { ...conversation, unread: false } : conversation
          )
        );
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(reason instanceof Error ? reason.message : "Could not mark messages as read");
      });

    return () => controller.abort();
  }, [active?.id, active?.unread]);

  async function sendMessage() {
    const body = draft.trim();
    if (!body || !active || isSending) return;

    setIsSending(true);
    setError(null);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: active.id, body }),
      });
      if (!response.ok) throw new Error(await responseError(response));

      const payload = (await response.json()) as { message: MessageDTO };
      setConversations((current) => {
        const updated = current.find((conversation) => conversation.id === active.id);
        if (!updated) return current;
        const nextConversation = {
          ...updated,
          unread: false,
          lastActivityAt: payload.message.createdAt,
          messages: [...updated.messages, payload.message],
        };
        return [nextConversation, ...current.filter((conversation) => conversation.id !== active.id)];
      });
      setDraft("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not send message");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div
      className={`${styles.layout}${mobileThreadOpen ? ` ${styles.threadOpen}` : ""}`}
      style={{ display: "grid", gridTemplateColumns: "320px minmax(0, 1fr)", height: "100vh" }}
    >
      <aside className={styles.conversationList} style={{ borderRight: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", background: "var(--surface-card)", minWidth: 0 }}>
        <div style={{ padding: "18px 18px 12px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, margin: "0 0 12px", color: "var(--charcoal-900)" }}>
            Messages
          </h2>
          <Input
            inputSize="sm"
            placeholder="Search conversations"
            aria-label="Search conversations"
            iconLeft={<SearchIcon />}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div style={{ overflowY: "auto", flex: 1 }}>
          {visible.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.5, padding: "24px 18px", margin: 0 }}>
              {conversations.length === 0
                ? "No application conversations yet."
                : "No conversations match your search."}
            </p>
          ) : (
            visible.map((conversation) => {
              const selected = conversation.id === selectedId;
              const lastMessage = conversation.messages.at(-1);
              return (
                <button
                  key={conversation.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setSelectedId(conversation.id);
                    setMobileThreadOpen(true);
                    setError(null);
                  }}
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
                  <Avatar name={conversation.name} src={conversation.avatarUrl ?? undefined} size="md" />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ fontWeight: 600, color: "var(--text-strong)", fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {conversation.name}
                      </span>
                      <span style={{ fontSize: 12, color: "var(--text-subtle)", flexShrink: 0 }}>
                        {activityLabel(conversation.lastActivityAt, renderedAt)}
                      </span>
                    </span>
                    <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, color: conversation.unread ? "var(--text-body)" : "var(--text-muted)", fontWeight: conversation.unread ? 600 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {lastMessage?.body ?? `Application: ${conversation.context}`}
                      </span>
                      {conversation.unread && <span aria-label="Unread" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--brand)", flexShrink: 0 }} />}
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      </aside>

      <section className={styles.thread} style={{ display: "flex", flexDirection: "column", background: "var(--bg-page)", minWidth: 0 }}>
        {active ? (
          <>
            <header style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 24px", borderBottom: "1px solid var(--border-subtle)", background: "var(--surface-card)" }}>
              <Button
                className={styles.mobileBack}
                type="button"
                variant="ghost"
                size="sm"
                title="Back to conversations"
                aria-label="Back to conversations"
                onClick={() => setMobileThreadOpen(false)}
                style={{ width: 36, padding: 0 }}
              >
                <BackIcon />
              </Button>
              <Avatar name={active.name} src={active.avatarUrl ?? undefined} size="md" />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: "var(--text-strong)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {active.name}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Application conversation</div>
              </div>
              <div style={{ marginLeft: "auto", minWidth: 0 }}>
                <Badge variant="brand">{active.context}</Badge>
              </div>
            </header>

            <div style={{ flex: 1, overflowY: "auto", padding: "26px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
              {active.messages.length === 0 ? (
                <div style={{ margin: "auto", textAlign: "center", maxWidth: 360 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-strong)", marginBottom: 6 }}>
                    Start the conversation
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.5 }}>
                    Discuss the application, availability, and next steps here.
                  </div>
                </div>
              ) : (
                active.messages.map((message) => (
                  <div className={styles.bubble} key={message.id} style={{ alignSelf: message.isMine ? "flex-end" : "flex-start", maxWidth: "62%" }}>
                    <div
                      style={{
                        padding: "11px 15px",
                        borderRadius: message.isMine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        background: message.isMine ? "var(--brand)" : "var(--surface-card)",
                        color: message.isMine ? "var(--cream-50)" : "var(--text-body)",
                        border: message.isMine ? "none" : "1px solid var(--border-subtle)",
                        fontSize: 15,
                        lineHeight: 1.5,
                        boxShadow: "var(--shadow-xs)",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {message.body}
                    </div>
                    <time dateTime={message.createdAt} style={{ display: "block", fontSize: 11, color: "var(--text-subtle)", marginTop: 4, textAlign: message.isMine ? "right" : "left" }}>
                      {activityLabel(message.createdAt, renderedAt)}
                    </time>
                  </div>
                ))
              )}
            </div>

            <div style={{ padding: "14px 24px 20px", borderTop: "1px solid var(--border-subtle)", background: "var(--surface-card)" }}>
              {error && <div role="alert" style={{ color: "var(--danger-strong)", fontSize: 13, marginBottom: 8 }}>{error}</div>}
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <Input
                    placeholder="Write a message..."
                    aria-label="Message"
                    maxLength={4000}
                    value={draft}
                    disabled={isSending}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void sendMessage();
                      }
                    }}
                  />
                </div>
                <Button
                  onClick={() => void sendMessage()}
                  disabled={isSending || !draft.trim()}
                  aria-label={isSending ? "Sending message" : "Send message"}
                  style={{ width: 44, padding: 0, opacity: isSending || !draft.trim() ? 0.55 : 1 }}
                >
                  <SendIcon />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ margin: "auto", textAlign: "center", maxWidth: 420, padding: 32 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-strong)", marginBottom: 8 }}>
              No conversation selected
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>
              Conversations become available when a braider applies to an opportunity.
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function SearchIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
}

function SendIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>;
}

function BackIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>;
}
