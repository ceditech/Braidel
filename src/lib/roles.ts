export type UserRole = "salon_owner" | "braider" | "client";
export type DashboardRole = "salon" | "braider" | "client";

export function toDashboardRole(role: UserRole): DashboardRole {
  return role === "salon_owner" ? "salon" : role;
}
