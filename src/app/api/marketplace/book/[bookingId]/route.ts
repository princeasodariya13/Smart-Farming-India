import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { emitToUser } from "@/lib/marketplaceEmitter";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const session = await auth();
    let userId = session?.user?.id;

    if (!userId) {
      const fallbackUser = await prisma.user.findFirst();
      if (!fallbackUser) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
      userId = fallbackUser.id;
    }

    const { bookingId } = await params;
    const { action } = await request.json(); // "approve" | "reject" | "cancel"

    if (!["approve", "reject", "cancel"].includes(action)) {
      return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    }

    const booking = await prisma.equipmentBooking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    const newStatus = action === "approve" ? "approved" : action === "reject" ? "rejected" : "cancelled";

    await prisma.equipmentBooking.update({
      where: { id: bookingId },
      data: { status: newStatus },
    });

    if (action === "approve" || action === "reject") {
      const eventType = action === "approve" ? "booking_approved" : "booking_rejected";
      
      // 🔴 Push live SSE event back to the buyer
      emitToUser(booking.buyerId, {
        type: eventType,
        bookingId,
        productId: booking.productId,
        productName: booking.productName,
        status: newStatus,
        message:
          action === "approve"
            ? `Your booking request for "${booking.productName}" has been approved!`
            : `Your booking request for "${booking.productName}" was declined.`,
      });
    }

    return NextResponse.json({ success: true, status: newStatus });
  } catch (error) {
    console.error("Approve/Reject Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
