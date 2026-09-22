'use client';

import React, { useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, CreditCard } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface CheckoutButtonProps {
  roomSlug: string;
  checkIn: string;
  checkOut: string;
  numberOfGuests: number;
  totalAmount: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  nationality?: string;
  govtIdType?: string;
  govtIdNumber?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function CheckoutButton({
  roomSlug,
  checkIn,
  checkOut,
  numberOfGuests,
  totalAmount,
  guestName,
  guestEmail,
  guestPhone,
  nationality,
  govtIdType,
  govtIdNumber,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleOnlinePayment = async () => {
    setLoading(true);
    try {
      // 1. Create Razorpay order on server (verifies availability and rates without saving unpaid bookings)
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomSlug,
          checkIn,
          checkOut,
          numberOfGuests: numberOfGuests || 1,
        })
      });
      
      const orderData = await orderRes.json();
      
      if (!orderRes.ok || !orderData.orderId) {
        throw new Error(orderData.error || 'Failed to initialize payment');
      }

      // 2. Open Razorpay payment gateway
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'House Of Karma',
        description: `Hostel Stay in Leh · ${orderData.nights} Night(s)`,
        image: '/logo-emblem.png',
        order_id: orderData.orderId,
        handler: async function(response: any) {
          setLoading(true);
          try {
            // 3. Verify cryptographic signature and ONLY THEN save booking to database as CONFIRMED
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                roomSlug,
                checkIn,
                checkOut,
                guestName,
                guestEmail,
                guestPhone,
                nationality,
                govtIdType,
                govtIdNumber,
                numberOfGuests: numberOfGuests || 1,
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              router.push(`/book/confirmation?bookingId=${verifyData.bookingId}`);
            } else {
              alert(verifyData.error || 'Payment verification failed. Please contact support.');
            }
          } catch (err) {
            console.error('Verification error:', err);
            alert('Error completing booking after payment. Please contact House Of Karma support.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: guestName,
          email: guestEmail,
          contact: guestPhone
        },
        theme: {
          color: '#B85C38'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert(`Payment failed: ${response.error.description || 'Please try another payment method'}`);
        setLoading(false);
      });
      rzp.open();
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Something went wrong during payment initialization.');
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="flex flex-col space-y-3">
        {/* Single Authoritative Online Payment Button */}
        <button 
          onClick={handleOnlinePayment}
          disabled={loading}
          className="w-full bg-[#B85C38] text-white font-bold py-3.5 px-6 rounded-xl hover:bg-[#8B3A1F] transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer text-base"
        >
          <Lock size={17} />
          {loading ? 'Processing Payment...' : `Pay Online & Confirm Booking (${formatPrice(totalAmount)})`}
        </button>

        {/* Security & Payment Methods Badge */}
        <div className="bg-[#FAF6F1] border border-[#E0C097]/40 rounded-xl p-3 text-center space-y-1.5">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#5C3D2E]">
            <ShieldCheck size={15} className="text-emerald-600" />
            <span>100% Instant Confirmation &bull; Online Payment Only</span>
          </div>
          <p className="text-[11px] text-[#9B8B7E] flex items-center justify-center gap-1">
            <CreditCard size={12} /> Accepts UPI, GPay, PhonePe, Paytm, Debit/Credit Cards & Netbanking
          </p>
        </div>
      </div>
    </>
  );
}
