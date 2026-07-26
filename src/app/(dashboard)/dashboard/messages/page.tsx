import { getConversationsForUser } from "@/db/queries";
import { requireDashboardRole } from "@/lib/authenticated-user";
import { MessagesClient } from "./MessagesClient";

export const dynamic = "force-dynamic";

interface MessagesPageProps {
  searchParams: Promise<{ application?: string | string[] }>;
}

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  const [user, params] = await Promise.all([
    requireDashboardRole("salon_owner", "braider"),
    searchParams,
  ]);
  const conversations = await getConversationsForUser(user.clerkId);
  const requestedApplication = Array.isArray(params.application)
    ? params.application[0]
    : params.application;

  return (
    <MessagesClient
      initialConversations={conversations}
      initialSelectedId={requestedApplication}
      renderedAt={new Date().toISOString()}
    />
  );
}
