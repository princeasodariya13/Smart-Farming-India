import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) return NextResponse.json({ success: false, error: 'Missing productId' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    // Toggle wishlist item
    const existing = await prisma.wishlistItem.findFirst({
      where: { userId: user.id, productId }
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return NextResponse.json({ success: true, wishlisted: false });
    } else {
      await prisma.wishlistItem.create({
        data: { userId: user.id, productId }
      });
      return NextResponse.json({ success: true, wishlisted: true });
    }
  } catch (error) {
    console.error('Wishlist API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update wishlist' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      include: { product: true }
    });

    return NextResponse.json({ success: true, wishlistItems });
  } catch (error) {
    console.error('Wishlist API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}
