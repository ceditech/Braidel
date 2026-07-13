"use client";
import { createContext, useContext, useState } from "react";

export type Role = "salon" | "braider";

interface RoleContextValue {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextValue>({
  role: "salon",
  setRole: () => {},
});

/**
 * Client-side role state for the dashboard shell. For now it defaults to
 * "salon" and is toggled from the sidebar so the app is demoable from both
 * sides. When the backend wiring pass lands, seed the initial value from the
 * signed-in user's `role` (see CLAUDE_HANDOFF §4).
 */
export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("salon");
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
}

export function useRole() {
  return useContext(RoleContext);
}
