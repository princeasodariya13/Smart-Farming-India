import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { emitToUser } from "@/lib/marketplaceEmitter";

export async function POST(request: Request) {
  try {
    const session = await auth();
    let userId = session?.user?.id;
    let userName = session?.user?.name;

    if (!userId) {
      const fallbackUser = await prisma.user.findFirst();
      if (!fallbackUser) {
        return NextResponse.json(
          { success: false, error: "Unauthorized and no fallback user found" },
          { status: 401 }
        );
      }
      userId = fallbackUser.id;
      userName = fallbackUser.name;
    }

    const { productId, startDate, endDate } = await request.json();

    const product = await prisma.marketplaceProduct.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Extract sellerId from the "Name||UserId" format
    let sellerId = "";
    if (product.seller.includes("||")) {
      sellerId = product.seller.split("||")[1];
    }

    // Create the booking record
    const booking = await prisma.equipmentBooking.create({
      data: {
        productId,
        buyerId: userId,
        buyerName: userName || "A farmer",
        sellerId,
        productName: product.name,
        status: "pending",
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    // 🔴 Push live SSE event to the seller
    if (sellerId) {
      emitToUser(sellerId, {
        type: "booking_request",
        bookingId: booking.id,
        productId,
        productName: product.name,
        buyerName: userName || "A farmer",
        message: `${userName || "A farmer"} wants to ${
          product.type === "rental" ? "rent" : "buy"
        } your "${product.name}"`,
        startDate: startDate,
        endDate: endDate,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Booking request sent. Seller notified in real-time.",
      bookingId: booking.id,
    });
  } catch (error) {
    console.error("Booking Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process booking" },
      { status: 500 }
    );
  }
}
