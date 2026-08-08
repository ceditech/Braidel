import { getConversationsForUser } from "@/db/queries";
import { requireDashboardRole } from "@/lib/authenticated-user";
import { MessagesClient } from "./MessagesClient";

export const dynamic = "force-dynamic";

interface MessagesPageProps {
  searchParams: Promise<{
    application?: string | string[];
    booking?: string | string[];
  }>;
}

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  const [user, params] = await Promise.all([
    requireDashboardRole("salon_owner", "braider", "client"),
    searchParams,
  ]);
  const conversations = await getConversationsForUser(user.clerkId);
  const requestedApplication = Array.isArray(params.application)
    ? params.application[0]
    : params.application;
  const requestedBooking = Array.isArray(params.booking)
    ? params.booking[0]
    : params.booking;

  return (
    <MessagesClient
      initialConversations={conversations}
      initialSelectedId={requestedBooking ?? requestedApplication}
      renderedAt={new Date().toISOString()}
    />
  );
}
