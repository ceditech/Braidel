import { currentUser } from "@clerk/nextjs/server";
import { getConversationsForUser } from "@/db/queries";
import { MessagesClient } from "./MessagesClient";

export const dynamic = "force-dynamic";

interface MessagesPageProps {
  searchParams: Promise<{ application?: string | string[] }>;
}

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  const [clerkUser, params] = await Promise.all([currentUser(), searchParams]);
  const conversations = clerkUser ? await getConversationsForUser(clerkUser.id) : [];
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
