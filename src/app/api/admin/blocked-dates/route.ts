import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('roomId');

    const blockedDates = await db.blockedDate.findMany({
      where: roomId ? { roomId } : undefined,
      orderBy: { startDate: 'asc' },
    });

    return NextResponse.json(blockedDates);
  } catch (error) {
    console.error('Error fetching blocked dates:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { roomId, startDate, endDate, reason } = await req.json();

    const blockedDate = await db.blockedDate.create({
      data: {
        roomId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        source: 'MANUAL',
        reason,
      }
    });

    return NextResponse.json(blockedDate);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await req.json();

    await db.blockedDate.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
