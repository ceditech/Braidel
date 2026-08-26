import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { withBookingTransaction } from "@/db/booking-db";
import { marketplaceAdminActions, users } from "@/db/schema";
import { getMarketplaceAdminForApi } from "@/lib/admin-auth";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const USER_ACTIONS = new Set(["update_profile", "deactivate", "reactivate"]);

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
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1)
  );

  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  if (action === "deactivate" && targetUser.id === admin.id) {
    return NextResponse.json(
      { error: "Admins cannot deactivate their own account" },
      { status: 400 }
    );
  }

  const now = new Date();
  const previousState = {
    role: targetUser.role,
    firstName: targetUser.firstName,
    lastName: targetUser.lastName,
    deletedAt: targetUser.deletedAt?.toISOString() ?? null,
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

    if (action === "deactivate") {
      await tx
        .update(users)
        .set({ deletedAt: now, updatedAt: now })
        .where(eq(users.id, id));
      newState = {
        ...previousState,
        deletedAt: now.toISOString(),
      };
    }

    if (action === "reactivate") {
      await tx
        .update(users)
        .set({ deletedAt: null, updatedAt: now })
        .where(eq(users.id, id));
      newState = {
        ...previousState,
        deletedAt: null,
      };
    }

    await tx.insert(marketplaceAdminActions).values({
      actorUserId: admin.id,
      targetType: "user_account",
      targetId: id,
      action: `user_${action}`,
      previousState: JSON.stringify(previousState),
      newState: JSON.stringify(newState),
      note: note || null,
    });
  });

  revalidatePath("/dashboard/admin");

  return NextResponse.json({ ok: true, action });
}
