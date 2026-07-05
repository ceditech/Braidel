"use client";
import { useUser } from "@clerk/nextjs";
import { useRole } from "@/components/dashboard/RoleContext";
import { SalonDashboardHome } from "@/components/dashboard/SalonDashboardHome";
import { BraiderDashboardHome } from "@/components/dashboard/BraiderDashboardHome";

export default function DashboardPage() {
  const { user } = useUser();
  const { role } = useRole();
  const firstName = user?.firstName ?? "there";

  return role === "braider" ? (
    <BraiderDashboardHome firstName={firstName} />
  ) : (
    <SalonDashboardHome firstName={firstName} />
  );
}
