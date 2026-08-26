export type UserRole = "salon_owner" | "braider" | "client" | "admin";
export type DashboardRole = "salon" | "braider" | "client" | "admin";

export function toDashboardRole(role: UserRole): DashboardRole {
  if (role === "admin") return "admin";
  return role === "salon_owner" ? "salon" : role;
}
