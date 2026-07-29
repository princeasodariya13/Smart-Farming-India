import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request, context: any) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Safely extract 'id' regardless of Next.js version (async vs sync params)
    const params = await context.params;
    const id = params?.id || context.params?.id;

    if (!id || id === 'undefined') {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    // Ensure the record belongs to the user before deleting
    const scan = await prisma.diseaseScan.findUnique({
      where: { id }
    });

    if (!scan || scan.userId !== session.user.id) {
      return NextResponse.json({ error: 'Record not found or unauthorized' }, { status: 403 });
    }

    await prisma.diseaseScan.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    console.error('[LOG] Error deleting disease history:', error);
    return NextResponse.json({ error: 'Failed to delete history item' }, { status: 500 });
  }
}
