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
    const { postId } = await req.json();
    if (!postId) {
      return NextResponse.json({ success: false, error: "postId is required" }, { status: 400 });
    }

    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      select: { likes: true, likedByIds: true }
    });

    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    const hasLiked = post.likedByIds.includes(userId);

    const updatedPost = await prisma.communityPost.update({
      where: { id: postId },
      data: {
        likes: hasLiked ? Math.max(0, post.likes - 1) : post.likes + 1,
        likedByIds: hasLiked
          ? { set: post.likedByIds.filter(id => id !== userId) }
          : { push: userId }
      },
      select: { likes: true, likedByIds: true }
    });

    return NextResponse.json({ success: true, likes: updatedPost.likes, likedByIds: updatedPost.likedByIds });
  } catch (error: unknown) {
    console.error("Like error:", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
