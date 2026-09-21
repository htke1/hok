import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { razorpay } from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    const booking = await db.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking || booking.status !== 'PENDING') {
      return NextResponse.json({ error: 'Invalid booking or already processed' }, { status: 400 });
    }

    const amountInPaisa = Math.round((booking.totalAmount) * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaisa,
      currency: 'INR',
      receipt: `receipt_${booking.id}`
    });

    await db.booking.update({
      where: { id: booking.id },
      data: { razorpayOrderId: order.id }
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
