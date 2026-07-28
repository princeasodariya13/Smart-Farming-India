import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const posts = await prisma.communityPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, image: true } },
        comments: {
          include: {
            user: { select: { id: true, name: true, image: true } }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });
    return NextResponse.json({ success: true, posts });
  } catch (error: unknown) {
    console.error("Fetch posts error:", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { content, type, images, tags } = await req.json();

    if (!content) {
      return NextResponse.json({ success: false, error: "Content is required" }, { status: 400 });
    }

    const post = await prisma.communityPost.create({
      data: {
        userId: session.user.id,
        content,
        type: type || "post",
        images: images || [],
        tags: tags || []
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
        comments: true
      }
    });

    return NextResponse.json({ success: true, post });
  } catch (error: unknown) {
    console.error("Create post error:", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
