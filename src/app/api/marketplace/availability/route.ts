import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    const bookings = await prisma.equipmentBooking.findMany({
      where: {
        productId,
        status: {
          in: ["pending", "approved"], // both pending and approved block the calendar
        },
      },
      select: {
        startDate: true,
        endDate: true,
      },
    });

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error("Availability Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}
