import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_PREVIEW_COOKIE } from "@/lib/authenticated-user";
import { getMarketplaceAdminForApi } from "@/lib/admin-auth";

const PREVIEW_ROLES = new Set(["salon", "braider", "client"]);

/**
 * Lets a marketplace admin toggle "preview as" mode for QA/UI review. This
 * only ever sets a cookie that changes which dashboard nav/shell the admin's
 * own session sees — it does not touch any other user's account or data.
 */
export async function POST(req: NextRequest) {
  const admin = await getMarketplaceAdminForApi();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const payload = await req.json().catch(() => ({}));
  const role = typeof payload.role === "string" ? payload.role : null;

  const store = await cookies();

  if (!role || role === "exit") {
    store.delete(ADMIN_PREVIEW_COOKIE);
    return NextResponse.json({ ok: true, role: null });
  }

  if (!PREVIEW_ROLES.has(role)) {
    return NextResponse.json({ error: "Choose a valid preview role" }, { status: 400 });
  }

  store.set(ADMIN_PREVIEW_COOKIE, role, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 4, // 4 hours
  });

  return NextResponse.json({ ok: true, role });
}
