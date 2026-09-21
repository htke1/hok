'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { DateRangePicker } from '@/components/booking/DateRangePicker';
import { GuestDetailsForm } from '@/components/booking/GuestDetailsForm';
import { PriceBreakdown } from '@/components/booking/PriceBreakdown';
import { CheckoutButton } from '@/components/booking/CheckoutButton';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

export default function BookPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [availabilityData, setAvailabilityData] = useState<any>(null);
  const [guestData, setGuestData] = useState<any>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    // Mock fetching rooms, typically a TRPC or fetch call
    // For now, setting generic state or fetching from an API
    fetch('/api/rooms').then(res => res.json()).then(data => setRooms(data.rooms || [])).catch(() => {});
  }, []);

  const handleCheckAvailability = async () => {
    if (!range?.from || !range?.to || !selectedRoom) return;
    
    try {
      const res = await fetch(`/api/availability?roomSlug=${selectedRoom.slug}&checkIn=${range.from.toISOString()}&checkOut=${range.to.toISOString()}`);
      const data = await res.json();
      if (data.available) {
        setAvailabilityData(data);
        setStep(2);
      } else {
        alert('Room is not available for these dates.');
      }
    } catch (e) {
      alert('Error checking availability');
    }
  };

  const handleGuestSubmit = async (data: any) => {
    setGuestData(data);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          roomSlug: selectedRoom.slug,
          checkIn: range?.from?.toISOString(),
          checkOut: range?.to?.toISOString(),
          numberOfGuests: 1, // Add proper selection if needed
          paymentMethod: 'ONLINE' // Default to get PENDING status for checkout
        })
      });
      const resData = await res.json();
      if (res.ok) {
        setBookingId(resData.id);
        setStep(3);
      } else {
        alert(resData.error || 'Failed to create booking');
      }
    } catch (e) {
      alert('Error creating booking');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Stepper */}
      <div className="flex justify-center items-center mb-12">
        <div className="flex items-center space-x-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-terracotta text-white' : 'bg-sandstone text-charcoal'}`}>1</div>
          <div className={`h-1 w-16 ${step >= 2 ? 'bg-terracotta' : 'bg-sandstone'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-terracotta text-white' : 'bg-sandstone text-charcoal'}`}>2</div>
          <div className={`h-1 w-16 ${step >= 3 ? 'bg-terracotta' : 'bg-sandstone'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-terracotta text-white' : 'bg-sandstone text-charcoal'}`}>3</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-heading text-timber mb-6">Select Dates & Room</h2>
              <DateRangePicker bookedDates={[]} onRangeChange={setRange} />
              
              {/* Room Selection Mock */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {rooms.map(room => (
                  <div 
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`p-4 border-2 rounded-xl cursor-pointer ${selectedRoom?.id === room.id ? 'border-terracotta bg-cream' : 'border-sandstone hover:border-terracotta'}`}
                  >
                    <h3 className="font-heading text-lg">{room.name}</h3>
                    <p className="text-sm text-slate">₹{room.pricePerNight} / night</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleCheckAvailability}
                disabled={!range?.from || !range?.to || !selectedRoom}
                className="mt-8 w-full bg-terracotta text-white py-3 rounded-xl hover:bg-[#a04e2d] transition-colors disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-heading text-timber mb-6">Guest Details</h2>
              <GuestDetailsForm onSubmit={handleGuestSubmit} />
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-heading text-timber mb-6">Payment</h2>
              <p className="text-slate mb-6">Choose how you'd like to pay for your stay.</p>
              {bookingId && availabilityData && guestData && (
                <div className="max-w-md">
                  <CheckoutButton 
                    bookingId={bookingId}
                    amount={availabilityData.totalPrice}
                    guestName={guestData.guestName}
                    guestEmail={guestData.guestEmail}
                    guestPhone={guestData.guestPhone}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          {step > 1 && availabilityData && selectedRoom && (
            <div className="sticky top-24">
              <PriceBreakdown 
                roomName={selectedRoom.name}
                pricePerNight={availabilityData.room.pricePerNight}
                nights={availabilityData.nights}
                taxAmount={availabilityData.taxAmount}
                totalAmount={availabilityData.totalPrice}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
