import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    
    // We can mark a specific notification or all notifications
    const body = await req.json().catch(() => ({}));
    const { notificationId } = body;

    if (notificationId) {
      // Mark specific notification as read
      await prisma.communityNotification.updateMany({
        where: { id: notificationId, userId },
        data: { isRead: true }
      });
    } else {
      // Mark all notifications as read
      await prisma.communityNotification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Failed to mark notifications as read:", error);
    return NextResponse.json({ success: false, error: "Failed to update notifications" }, { status: 500 });
  }
}
