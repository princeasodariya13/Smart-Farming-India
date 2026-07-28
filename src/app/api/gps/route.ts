import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const fields = await prisma.savedField.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, fields });
  } catch (error: any) {
    console.error("Fetch GPS fields error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { name, totalAreaAcres, totalAreaHectares, perimeterMeters, coordinates } = await req.json();

    if (!name || totalAreaAcres == null) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const savedField = await prisma.savedField.create({
      data: {
        userId: session.user.id,
        name,
        totalAreaAcres: Number(totalAreaAcres),
        totalAreaHectares: Number(totalAreaHectares),
        perimeterMeters: Number(perimeterMeters),
        coordinates: coordinates ? JSON.stringify(coordinates) : null
      }
    });

    return NextResponse.json({ success: true, field: savedField });
  } catch (error: any) {
    console.error("Save GPS field error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
