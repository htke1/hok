'use client';

import React, { useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

interface CheckoutButtonProps {
  bookingId: string;
  amount: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function CheckoutButton({ bookingId, amount, guestName, guestEmail, guestPhone }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleOnlinePayment = async () => {
    setLoading(true);
    try {
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId })
      });
      
      const orderData = await orderRes.json();
      
      if (!orderData.orderId) {
        throw new Error('Failed to create order');
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'House Of Karma',
        description: 'Hostel Booking',
        order_id: orderData.orderId,
        handler: async function(response: any) {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            router.push(`/book/confirmation?bookingId=${bookingId}`);
          } else {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: guestName,
          email: guestEmail,
          contact: guestPhone
        },
        theme: {
          color: '#B85C38'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert('Something went wrong during payment initialization.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayAtProperty = async () => {
    // Assuming backend updates status if needed or just redirect
    router.push(`/book/confirmation?bookingId=${bookingId}`);
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="flex flex-col space-y-4">
        <button 
          onClick={handleOnlinePayment}
          disabled={loading}
          className="w-full bg-terracotta text-white font-medium py-3 rounded-xl hover:bg-[#a04e2d] transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Pay Online'}
        </button>
        
        <button 
          onClick={handlePayAtProperty}
          disabled={loading}
          className="w-full bg-white text-terracotta border-2 border-terracotta font-medium py-3 rounded-xl hover:bg-cream transition-colors disabled:opacity-50"
        >
          Pay at Property
        </button>
      </div>
    </>
  );
}
