import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        diseaseScans: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        cartItems: {
          include: { product: true },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
      },
      stats: {
        diseaseScans: user.diseaseScans.length,
        cartItems: user.cartItems.length,
      },
      recentScans: user.diseaseScans.map((scan) => ({
        id: scan.id,
        plant: scan.plantName,
        disease: scan.diseaseName,
        confidence: scan.confidenceScore,
        date: scan.createdAt,
      })),
    });
  } catch (error) {
    console.error('Profile API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, image } = body;

    const updateData: { name?: string; image?: string } = {};
    if (name && typeof name === 'string') updateData.name = name.trim();
    if (image && typeof image === 'string') updateData.image = image;

    const updated = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      user: { id: updated.id, name: updated.name, email: updated.email, image: updated.image },
    });
  } catch (error) {
    console.error('Profile Update Error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
