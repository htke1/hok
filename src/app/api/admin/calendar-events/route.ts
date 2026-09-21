import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
      return NextResponse.json({ error: 'Room ID required' }, { status: 400 });
    }

    const [bookings, blockedDates] = await Promise.all([
      db.booking.findMany({
        where: {
          roomId,
          status: 'CONFIRMED',
        },
        select: {
          id: true,
          guestName: true,
          checkIn: true,
          checkOut: true,
          numberOfGuests: true,
          totalAmount: true,
        },
      }),
      db.blockedDate.findMany({
        where: { roomId },
        orderBy: { startDate: 'asc' },
      }),
    ]);

    return NextResponse.json({ bookings, blockedDates });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

