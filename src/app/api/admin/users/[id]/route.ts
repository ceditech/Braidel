import { eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { withBookingTransaction } from "@/db/booking-db";
import { braiders, marketplaceAdminActions, salons, serviceProviders, users } from "@/db/schema";
import { getMarketplaceAdminForApi, isConfiguredAdminEmail } from "@/lib/admin-auth";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const USER_ACTIONS = new Set([
  "update_profile",
  "suspend_account",
  "restore_account",
  "unlist_profile",
  "relist_profile",
  "promote_admin",
]);

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  const admin = await getMarketplaceAdminForApi();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const payload = await req.json().catch(() => ({}));
  const action = stringValue(payload.action);
  const note = stringValue(payload.note);

  if (!USER_ACTIONS.has(action)) {
    return NextResponse.json({ error: "Choose a valid user action" }, { status: 400 });
  }
  if (note.length > 1200) {
    return NextResponse.json({ error: "Admin note is too long" }, { status: 400 });
  }
  const requestedFirstName = stringValue(payload.firstName);
  const requestedLastName = stringValue(payload.lastName);
  if (action === "update_profile") {
    if (requestedFirstName.length < 1) {
      return NextResponse.json({ error: "First name is required" }, { status: 400 });
    }
    if (requestedFirstName.length > 80 || requestedLastName.length > 80) {
      return NextResponse.json(
        { error: "Names must stay under 80 characters" },
        { status: 400 }
      );
    }
  }

  const [targetUser] = await withBookingTransaction((tx) =>
    tx
      .select({
        id: users.id,
        role: users.role,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        deletedAt: users.deletedAt,
        accountStatus: users.accountStatus,
        providerId: serviceProviders.id,
        providerVisibility: serviceProviders.visibility,
      })
      .from(users)
      .leftJoin(salons, eq(users.id, salons.ownerId))
      .leftJoin(braiders, eq(users.id, braiders.userId))
      .leftJoin(
        serviceProviders,
        or(eq(serviceProviders.salonId, salons.id), eq(serviceProviders.braiderId, braiders.id))
      )
      .where(eq(users.id, id))
      .limit(1)
  );

  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  if (action === "suspend_account" && targetUser.id === admin.id) {
    return NextResponse.json(
      { error: "Admins cannot suspend their own account" },
      { status: 400 }
    );
  }
  if ((action === "unlist_profile" || action === "relist_profile") && !targetUser.providerId) {
    return NextResponse.json(
      { error: "This user does not have a provider profile to manage" },
      { status: 400 }
    );
  }
  if (action === "promote_admin" && !isConfiguredAdminEmail(targetUser.email)) {
    return NextResponse.json(
      { error: "Add this email to BRAIDEL_ADMIN_EMAILS before promoting admin access" },
      { status: 400 }
    );
  }

  const now = new Date();
  const previousState = {
    role: targetUser.role,
    firstName: targetUser.firstName,
    lastName: targetUser.lastName,
    deletedAt: targetUser.deletedAt?.toISOString() ?? null,
    accountStatus: targetUser.accountStatus,
    providerId: targetUser.providerId ?? null,
    providerVisibility: targetUser.providerVisibility ?? null,
  };

  let newState = previousState;

  await withBookingTransaction(async (tx) => {
    if (action === "update_profile") {
      await tx
        .update(users)
        .set({ firstName: requestedFirstName, lastName: requestedLastName, updatedAt: now })
        .where(eq(users.id, id));

      newState = {
        ...previousState,
        firstName: requestedFirstName,
        lastName: requestedLastName,
      };
    }

    if (action === "suspend_account") {
      await tx
        .update(users)
        .set({ accountStatus: "suspended", updatedAt: now })
        .where(eq(users.id, id));
      newState = {
        ...previousState,
        accountStatus: "suspended",
      };
    }

    if (action === "restore_account") {
      await tx
        .update(users)
        .set({ accountStatus: "active", updatedAt: now })
        .where(eq(users.id, id));
      newState = {
        ...previousState,
        accountStatus: "active",
      };
    }

    if (action === "promote_admin") {
      await tx
        .update(users)
        .set({ role: "admin", updatedAt: now })
        .where(eq(users.id, id));
      newState = {
        ...previousState,
        role: "admin",
      };
    }

    if (action === "unlist_profile" || action === "relist_profile") {
      const providerVisibility = action === "unlist_profile" ? "unlisted" : "listed";
      await tx
        .update(serviceProviders)
        .set({ visibility: providerVisibility, updatedAt: now })
        .where(eq(serviceProviders.id, targetUser.providerId!));
      newState = {
        ...previousState,
        providerVisibility,
      };
    }

    await tx.insert(marketplaceAdminActions).values({
      actorUserId: admin.id,
      targetType:
        action === "unlist_profile" || action === "relist_profile"
          ? "provider_profile"
          : "user_account",
      targetId:
        action === "unlist_profile" || action === "relist_profile"
          ? targetUser.providerId!
          : id,
      action: `user_${action}`,
      previousState: JSON.stringify(previousState),
      newState: JSON.stringify(newState),
      note: note || null,
    });
  });

  revalidatePath("/dashboard/admin");

  return NextResponse.json({ ok: true, action });
}
