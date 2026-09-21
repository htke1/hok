import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateNights, calculateTax } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomSlug = searchParams.get('roomSlug');
    const checkInStr = searchParams.get('checkIn');
    const checkOutStr = searchParams.get('checkOut');

    if (!roomSlug || !checkInStr || !checkOutStr) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const checkIn = new Date(checkInStr);
    const checkOut = new Date(checkOutStr);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return NextResponse.json({ error: 'Invalid dates' }, { status: 400 });
    }

    if (checkIn >= checkOut) {
      return NextResponse.json({ error: 'Check-out must be after check-in' }, { status: 400 });
    }

    const room = await db.room.findUnique({
      where: { slug: roomSlug }
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // Check overlapping bookings
    const overlappingBookings = await db.booking.findFirst({
      where: {
        roomId: room.id,
        status: { in: ['CONFIRMED', 'PENDING'] },
        AND: [
          { checkIn: { lt: checkOut } },
          { checkOut: { gt: checkIn } }
        ]
      }
    });

    // Check blocked dates
    const overlappingBlocks = await db.blockedDate.findFirst({
      where: {
        roomId: room.id,
        AND: [
          { startDate: { lt: checkOut } },
          { endDate: { gt: checkIn } }
        ]
      }
    });

    const isAvailable = !overlappingBookings && !overlappingBlocks;
    
    const nights = calculateNights(checkIn, checkOut);
    const basePrice = room.pricePerNight * nights;
    const taxAmount = calculateTax(basePrice);
    const totalPrice = basePrice + taxAmount;

    return NextResponse.json({
      available: isAvailable,
      room: {
        name: room.name,
        type: room.type,
        pricePerNight: room.pricePerNight
      },
      nights,
      basePrice,
      taxAmount,
      totalPrice
    });
  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
