import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';
import { calculateNights, calculateTax } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      roomSlug,
      checkIn,
      checkOut,
      guestName,
      guestEmail,
      guestPhone,
      nationality,
      govtIdType,
      govtIdNumber,
      numberOfGuests,
    } = await request.json();

    // 1. Verify Razorpay cryptographic signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
      .update(text)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Payment signature verification failed' }, { status: 400 });
    }

    // 2. Validate booking parameters
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const room = await db.room.findUnique({
      where: { slug: roomSlug }
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // 3. Re-verify availability
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
      return NextResponse.json({ error: 'Room has already been booked for these dates' }, { status: 409 });
    }

    // 4. Calculate pricing
    const nights = calculateNights(checkInDate, checkOutDate);
    const basePrice = room.pricePerNight * nights;
    const taxAmount = calculateTax(basePrice);
    const totalAmount = basePrice + taxAmount;

    // 5. Create CONFIRMED booking in database (only after verified payment)
    const booking = await db.booking.create({
      data: {
        roomId: room.id,
        guestName,
        guestEmail,
        guestPhone,
        nationality: nationality || 'Indian',
        govtIdType: govtIdType || null,
        govtIdNumber: govtIdNumber || null,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        numberOfGuests: parseInt(numberOfGuests, 10) || 1,
        totalAmount,
        taxAmount,
        status: 'CONFIRMED',
        paymentMethod: 'ONLINE',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      }
    });

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
    });
  } catch (error: any) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
