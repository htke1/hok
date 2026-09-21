'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDate, formatPrice } from '@/lib/utils';
import { MessageCircle, Phone, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import BrandedLoader from '@/components/common/BrandedLoader';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const router = useRouter();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const contactNumber = process.env.NEXT_PUBLIC_CONTACT_NUMBER || '+91 60066 19569';
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '916006619569';

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        if (res.ok) {
          const data = await res.json();
          setBooking(data);
        }
      } catch (e) {
        console.error('Error fetching booking:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <BrandedLoader
          message="Retrieving your reservation..."
          submessage="House Of Karma · Instant Confirmation"
        />
      </div>
    );
  }

  if (!bookingId || !booking) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <h1 className="font-heading text-3xl text-timber mb-3">Booking Not Found</h1>
        <p className="text-slate mb-6 max-w-md">
          We couldn't retrieve the reservation details. If you recently confirmed, please check your email or contact our desk directly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={`tel:+${whatsappNumber}`}
            className="inline-flex items-center justify-center gap-2 bg-terracotta text-white px-6 py-3 rounded-xl hover:bg-terracotta-dark transition-colors"
          >
            <Phone size={18} />
            Call +91 60066 19569
          </a>
          <button
            onClick={() => router.push('/')}
            className="border-2 border-sandstone text-charcoal px-6 py-3 rounded-xl hover:bg-sandstone-light transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const checkInFormatted = booking.checkIn ? formatDate(booking.checkIn) : 'TBD';
  const checkOutFormatted = booking.checkOut ? formatDate(booking.checkOut) : 'TBD';

  const waMessage = encodeURIComponent(
    `Hello House Of Karma! I have a reservation (Ref: ${booking.ref || booking.id.slice(-6).toUpperCase()}) for ${booking.roomName} from ${checkInFormatted} to ${checkOutFormatted}. My name is ${booking.guestName}. Could you please confirm road & check-in details?`
  );
  const waUrl = `https://wa.me/${whatsappNumber}?text=${waMessage}`;

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-cream p-8 md:p-10 rounded-3xl max-w-2xl w-full text-center shadow-md border border-sandstone">
        
        {/* Brand Emblem */}
        <div className="w-20 h-14 relative mx-auto mb-4">
          <Image
            src="/logo-emblem.png"
            alt="House Of Karma Logo"
            fill
            className="object-contain"
          />
        </div>

        {/* Success Checkmark */}
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle2 size={44} />
        </div>

        <h1 className="font-heading text-3xl md:text-4xl text-timber font-bold mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-slate mb-8 text-base">
          Julley, <span className="font-semibold text-charcoal">{booking.guestName}</span>! Your mountain stay at House Of Karma, Leh is reserved.
        </p>

        {/* Booking Card */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-sandstone text-left space-y-4 mb-8 shadow-sm">
          <div className="flex justify-between items-center border-b border-sandstone/40 pb-4">
            <span className="text-slate text-sm">Booking Reference</span>
            <span className="font-mono font-bold text-lg text-terracotta bg-cream px-3 py-1 rounded-lg">
              {booking.ref || `HOK-${booking.id.slice(-6).toUpperCase()}`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-sandstone/40 pb-4">
            <div>
              <span className="text-slate text-xs block mb-1">Room Category</span>
              <span className="font-bold text-charcoal">{booking.roomName}</span>
            </div>
            <div>
              <span className="text-slate text-xs block mb-1">Status</span>
              <span className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                {booking.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-sandstone/40 pb-4">
            <div>
              <span className="text-slate text-xs block mb-1">Check-in</span>
              <span className="font-medium text-charcoal">{checkInFormatted}</span>
            </div>
            <div>
              <span className="text-slate text-xs block mb-1">Check-out</span>
              <span className="font-medium text-charcoal">{checkOutFormatted}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-slate font-medium">Total Amount</span>
            <span className="font-heading text-2xl font-bold text-terracotta">
              {formatPrice(booking.totalAmount)}
            </span>
          </div>

          {booking.paymentMethod && (
            <p className="text-xs text-warm-grey italic pt-1">
              Payment method: {booking.paymentMethod === 'PAY_AT_PROPERTY' ? 'Pay upon arrival / UPI deposit' : booking.paymentMethod}
            </p>
          )}
        </div>

        {/* Altitude Acclimatization Reminder */}
        <div className="bg-sandstone/25 p-5 rounded-2xl mb-8 flex items-start gap-4 text-left border border-sandstone/50">
          <div className="mt-0.5 text-terracotta shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div className="text-sm">
            <h4 className="font-bold text-charcoal mb-1">Ladakh High-Altitude Note (11,500 ft)</h4>
            <p className="text-slate leading-relaxed">
              Please take complete rest for your first 24–48 hours in Leh. Drink plenty of warm water and avoid immediate physical exertion. We have 24/7 hot water, room heaters, and in-house oxygen if needed!
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg text-base"
          >
            <MessageCircle size={22} />
            <span>Chat on WhatsApp (+91 60066 19569)</span>
          </a>

          <a
            href={`tel:+${whatsappNumber}`}
            className="flex items-center justify-center gap-2 w-full bg-white text-charcoal border border-sandstone font-medium py-3 px-6 rounded-xl hover:bg-cream transition-colors text-sm"
          >
            <Phone size={18} className="text-terracotta" />
            <span>Call Desk Directly: +91 60066 19569</span>
          </a>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full text-warm-grey hover:text-terracotta transition-colors pt-2 text-sm font-medium"
          >
            <ArrowLeft size={16} />
            <span>Return to Homepage</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <BrandedLoader
            message="Loading booking details..."
            submessage="House Of Karma · Direct Booking Engine"
          />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
