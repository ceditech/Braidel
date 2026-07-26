"use client";
import { createContext, useContext } from "react";
import type { DashboardRole } from "@/lib/roles";

export type Role = DashboardRole;

interface RoleContextValue {
  role: Role;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({
  children,
  initialRole,
}: {
  children: React.ReactNode;
  initialRole: Role;
}) {
  return <RoleContext.Provider value={{ role: initialRole }}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
