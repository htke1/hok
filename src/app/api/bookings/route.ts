import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateNights, calculateTax } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { roomSlug, checkIn, checkOut, guestName, guestEmail, guestPhone, nationality, govtIdType, govtIdNumber, numberOfGuests, paymentMethod } = body;

    if (!roomSlug || !checkIn || !checkOut || !guestName || !guestEmail || !guestPhone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    const room = await db.room.findUnique({
      where: { slug: roomSlug }
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // Availability check against confirmed bookings
    const overlapping = await db.booking.findFirst({
      where: {
        roomId: room.id,
        status: 'CONFIRMED',
        AND: [
          { checkIn: { lt: checkOutDate } },
          { checkOut: { gt: checkInDate } }
        ]
      }
    });

    if (overlapping) {
      return NextResponse.json({ error: 'Room is not available for these dates' }, { status: 409 });
    }

    const nights = calculateNights(checkInDate, checkOutDate);
    const basePrice = room.pricePerNight * nights;
    const taxAmount = calculateTax(basePrice);
    const totalAmount = basePrice + taxAmount;

    const booking = await db.booking.create({
      data: {
        roomId: room.id,
        guestName,
        guestEmail,
        guestPhone,
        nationality: nationality || 'Indian',
        govtIdType,
        govtIdNumber,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        numberOfGuests: parseInt(numberOfGuests, 10) || 1,
        totalAmount,
        taxAmount,
        status: 'CONFIRMED',
        paymentMethod: paymentMethod || 'ONLINE'
      }
    });

    return NextResponse.json({ booking, id: booking.id }, { status: 201 });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      db.booking.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { room: true }
      }),
      db.booking.count()
    ]);

    return NextResponse.json({
      bookings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('List bookings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
