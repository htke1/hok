import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        room: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: booking.id,
      ref: `HOK-${booking.id.slice(-6).toUpperCase()}`,
      roomName: booking.room.name,
      roomType: booking.room.type,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      numberOfGuests: booking.numberOfGuests,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone,
      totalAmount: booking.totalAmount,
      taxAmount: booking.taxAmount,
      status: booking.status,
      paymentMethod: booking.paymentMethod,
    });
  } catch (error) {
    console.error('Fetch booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

