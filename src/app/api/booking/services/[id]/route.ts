import { NextResponse } from "next/server";
import { getProviderWorkspaceForUser } from "@/db/booking-queries";
import {
  booleanValue,
  bookingApiError,
  integerValue,
  readJsonObject,
  requireBookingApiUser,
  stringValue,
} from "@/lib/booking-api";
import {
  archiveServiceOffering,
  updateServiceOffering,
} from "@/lib/booking-service";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireBookingApiUser();
    const body = await readJsonObject(request);
    const { id } = await params;
    await updateServiceOffering(user, id, {
      name: stringValue(body.name),
      description: stringValue(body.description),
      durationMinutes: integerValue(body.durationMinutes),
      priceCents: integerValue(body.priceCents),
      currency: stringValue(body.currency).toUpperCase() || "USD",
      braidStyleId: stringValue(body.braidStyleId) || null,
      isActive: booleanValue(body.isActive, true),
    });
    return NextResponse.json({
      provider: await getProviderWorkspaceForUser(user),
    });
  } catch (error) {
    return bookingApiError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireBookingApiUser();
    const { id } = await params;
    await archiveServiceOffering(user, id);
    return NextResponse.json({
      provider: await getProviderWorkspaceForUser(user),
    });
  } catch (error) {
    return bookingApiError(error);
  }
}

