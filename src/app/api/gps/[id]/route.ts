import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }
    
    // Security Check: Verify field belongs to user
    const field = await prisma.savedField.findUnique({ where: { id } });
    if (!field || field.userId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Not found or unauthorized" }, { status: 403 });
    }

    const updatedField = await prisma.savedField.update({
      where: { id },
      data: { name }
    });

    return NextResponse.json({ success: true, field: updatedField });
  } catch (error) {
    console.error("Rename GPS field error:", error);
    return NextResponse.json({ success: false, error: "Failed to update field" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    
    // Security Check: Verify field belongs to user
    const field = await prisma.savedField.findUnique({ where: { id } });
    if (!field || field.userId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Not found or unauthorized" }, { status: 403 });
    }

    await prisma.savedField.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete GPS field error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete field" }, { status: 500 });
  }
}
