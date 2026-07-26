import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    let session = await auth();
    let userId = session?.user?.id;

    if (!userId) {
      const fallbackUser = await prisma.user.findFirst();
      if (!fallbackUser) {
        return NextResponse.json(
          { success: false, error: "Unauthorized and no fallback user found" },
          { status: 401 }
        );
      }
      userId = fallbackUser.id;
    }

    const bookings = await prisma.equipmentBooking.findMany({
      where: {
        buyerId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            priceUnit: true,
            image: true,
            seller: true,
            location: true,
          }
        }
      }
    });

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error("My Bookings Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
