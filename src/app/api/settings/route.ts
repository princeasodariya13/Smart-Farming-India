import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { notificationSettings: true }
    });

    return NextResponse.json({ success: true, settings: user?.notificationSettings || null });
  } catch (error: any) {
    console.error("Fetch settings error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { settings } = await req.json();

    if (!settings) {
      return NextResponse.json({ success: false, error: "Settings payload required" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { notificationSettings: settings }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Save settings error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
