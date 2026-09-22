import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { razorpay } from '@/lib/razorpay';
import { calculateNights, calculateTax } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const { roomSlug, checkIn, checkOut, numberOfGuests } = await request.json();

    if (!roomSlug || !checkIn || !checkOut) {
      return NextResponse.json({ error: 'Room and dates are required' }, { status: 400 });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime()) || checkInDate >= checkOutDate) {
      return NextResponse.json({ error: 'Invalid dates selected' }, { status: 400 });
    }

    const room = await db.room.findUnique({
      where: { slug: roomSlug }
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // Availability check against confirmed bookings only
    const overlappingBooking = await db.booking.findFirst({
      where: {
        roomId: room.id,
        status: 'CONFIRMED',
        AND: [
          { checkIn: { lt: checkOutDate } },
          { checkOut: { gt: checkInDate } }
        ]
      }
    });

    if (overlappingBooking) {
      return NextResponse.json({ error: 'Room is no longer available for these dates' }, { status: 409 });
    }

    // Check blocked dates (manual or OTA sync)
    const overlappingBlock = await db.blockedDate.findFirst({
      where: {
        roomId: room.id,
        AND: [
          { startDate: { lt: checkOutDate } },
          { endDate: { gt: checkInDate } }
        ]
      }
    });

    if (overlappingBlock) {
      return NextResponse.json({ error: 'Selected dates are blocked on this room' }, { status: 409 });
    }

    const nights = calculateNights(checkInDate, checkOutDate);
    const basePrice = room.pricePerNight * nights;
    const taxAmount = calculateTax(basePrice);
    const totalAmount = basePrice + taxAmount;
    const amountInPaisa = Math.round(totalAmount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaisa,
      currency: 'INR',
      receipt: `rcpt_${Date.now().toString().slice(-8)}`
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      totalAmount,
      taxAmount,
      nights
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
