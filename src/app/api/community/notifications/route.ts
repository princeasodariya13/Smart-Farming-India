import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    const notifications = await prisma.communityNotification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20, // Limit to 20 notifications
    });

    return NextResponse.json({ success: true, data: notifications });
  } catch (error: unknown) {
    console.error("Failed to fetch notifications:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch notifications" }, { status: 500 });
  }
}
