import { NextResponse } from "next/server";
import { getProviderWorkspaceForUser } from "@/db/booking-queries";
import {
  bookingApiError,
  requireBookingApiUser,
} from "@/lib/booking-api";
import { deleteAvailabilityException } from "@/lib/booking-service";

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireBookingApiUser();
    const { id } = await params;
    await deleteAvailabilityException(user, id);
    return NextResponse.json({
      provider: await getProviderWorkspaceForUser(user),
    });
  } catch (error) {
    return bookingApiError(error);
  }
}

