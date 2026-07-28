import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Task ID is required' }, { status: 400 });
    }

    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const task = await prisma.farmerTask.findUnique({
      where: { id }
    });

    if (task?.userId !== userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized task access' }, { status: 403 });
    }

    if (!task) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }

    await prisma.farmerTask.update({
      where: { id },
      data: { checked: !task.checked }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Task Toggle API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to toggle task' }, { status: 500 });
  }
}
