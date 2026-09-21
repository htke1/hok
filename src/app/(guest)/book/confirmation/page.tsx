'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const router = useRouter();
  
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/${bookingId}`); // Assume this endpoint exists or mock it
        if (res.ok) {
          const data = await res.json();
          setBooking(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    // Simulated fetch for the scope of the instruction
    setTimeout(() => {
      setBooking({
        id: bookingId,
        ref: `HOK-${bookingId.substring(0, 6).toUpperCase()}`,
        status: 'CONFIRMED',
        amount: 5000
      });
      setLoading(false);
    }, 1000);
  }, [bookingId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-terracotta">Loading...</div>;
  }

  if (!bookingId || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="font-heading text-2xl mb-4">Booking not found</h1>
        <button onClick={() => router.push('/')} className="text-terracotta underline">Go home</button>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-cream p-8 rounded-3xl max-w-xl w-full text-center shadow-sm border border-sandstone">
        
        {/* Success Checkmark */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-heading text-3xl text-timber mb-2">Booking Confirmed!</h1>
        <p className="text-slate mb-6">Your stay at House Of Karma is secured.</p>

        <div className="bg-white p-6 rounded-xl border border-sandstone mb-8 text-left space-y-4">
          <div className="flex justify-between border-b border-sandstone pb-4">
            <span className="text-slate">Booking Reference</span>
            <span className="font-bold text-charcoal">{booking.ref}</span>
          </div>
          <div className="flex justify-between border-b border-sandstone pb-4">
            <span className="text-slate">Status</span>
            <span className="font-bold text-green-600">CONFIRMED</span>
          </div>
          {/* Mock details for dates and room since we don't have full data */}
          <div className="text-sm text-slate mt-4">
            A confirmation email has been sent to your registered email address.
          </div>
        </div>

        <div className="bg-sandstone/20 p-4 rounded-xl mb-8 flex items-start gap-4 text-left">
          <div className="mt-1">
            <svg className="w-6 h-6 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-charcoal">Acclimatization Reminder</h4>
            <p className="text-sm text-slate">Leh is at a high altitude. Please rest for the first 24 hours upon arrival to acclimatize properly.</p>
          </div>
        </div>

        <div className="space-y-4">
          <a 
            href="https://wa.me/911234567890" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full bg-[#25D366] text-white font-medium py-3 rounded-xl hover:bg-[#20bd5a] transition-colors"
          >
            Save our WhatsApp for road updates
          </a>
          
          <Link 
            href="/"
            className="block w-full bg-transparent text-terracotta border-2 border-terracotta font-medium py-3 rounded-xl hover:bg-terracotta/10 transition-colors"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
