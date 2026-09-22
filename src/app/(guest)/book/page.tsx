'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DateRangePicker } from '@/components/booking/DateRangePicker';
import { GuestDetailsForm } from '@/components/booking/GuestDetailsForm';
import { PriceBreakdown } from '@/components/booking/PriceBreakdown';
import { CheckoutButton } from '@/components/booking/CheckoutButton';
import { DateRange } from 'react-day-picker';
import { MessageCircle, Phone, Info } from 'lucide-react';
import Image from 'next/image';
import BrandedLoader from '@/components/common/BrandedLoader';

function BookPageContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [availabilityData, setAvailabilityData] = useState<any>(null);
  const [guestData, setGuestData] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [checking, setChecking] = useState(false);

  // Pre-populate from query params if available
  useEffect(() => {
    fetch('/api/rooms')
      .then((res) => res.json())
      .then((data) => {
        const fetchedRooms = data.rooms || [];
        setRooms(fetchedRooms);

        const roomQuery = searchParams.get('room');
        if (roomQuery && fetchedRooms.length > 0) {
          const matched = fetchedRooms.find(
            (r: any) => r.slug === roomQuery || r.id === roomQuery
          );
          if (matched) setSelectedRoom(matched);
        }

        const checkInQuery = searchParams.get('checkIn');
        const checkOutQuery = searchParams.get('checkOut');
        if (checkInQuery && checkOutQuery) {
          const from = new Date(checkInQuery);
          const to = new Date(checkOutQuery);
          if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
            setRange({ from, to });
          }
        }
      })
      .catch((err) => console.error('Error fetching rooms:', err))
      .finally(() => setLoadingRooms(false));
  }, [searchParams]);

  const handleCheckAvailability = async () => {
    if (!range?.from || !range?.to || !selectedRoom) return;

    setChecking(true);
    try {
      const res = await fetch(
        `/api/availability?roomSlug=${selectedRoom.slug}&checkIn=${range.from.toISOString()}&checkOut=${range.to.toISOString()}`
      );
      const data = await res.json();
      if (data.available) {
        setAvailabilityData(data);
        setStep(2);
      } else {
        alert(
          'Selected room is not available for these dates. Please pick another date range or room type.'
        );
      }
    } catch (e) {
      alert('Error checking availability. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  const handleGuestSubmit = (data: any) => {
    setGuestData(data);
    setStep(3);
  };

  if (loadingRooms) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-20">
        <BrandedLoader
          message="Checking live room availability..."
          submessage="House Of Karma · Leh, Ladakh"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Page Title with Brand Mark */}
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="w-20 h-14 relative mb-2">
          <Image
            src="/logo-emblem.png"
            alt="House Of Karma Logo"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-timber mb-2">
          Reserve Your Stay in Leh
        </h1>
        <p className="text-slate text-sm">
          House Of Karma &middot; Direct Booking Engine with Instant Confirmation
        </p>
      </div>

      {/* Stepper */}
      <div className="flex justify-center items-center mb-12">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
              step >= 1 ? 'bg-terracotta text-white shadow-md' : 'bg-sandstone text-charcoal'
            }`}
          >
            1
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline text-charcoal">
            Dates & Room
          </span>
          <div className={`h-1 w-8 sm:w-16 ${step >= 2 ? 'bg-terracotta' : 'bg-sandstone'}`}></div>
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
              step >= 2 ? 'bg-terracotta text-white shadow-md' : 'bg-sandstone text-charcoal'
            }`}
          >
            2
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline text-charcoal">
            Guest Info
          </span>
          <div className={`h-1 w-8 sm:w-16 ${step >= 3 ? 'bg-terracotta' : 'bg-sandstone'}`}></div>
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
              step >= 3 ? 'bg-terracotta text-white shadow-md' : 'bg-sandstone text-charcoal'
            }`}
          >
            3
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline text-charcoal">
            Confirm & Pay
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {step === 1 && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-sandstone">
              <h2 className="text-2xl font-heading text-timber font-bold mb-4">
                1. Select Dates & Room
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Choose Check-in & Check-out Range
                </label>
                <DateRangePicker bookedDates={[]} onRangeChange={setRange} />
              </div>

              {/* Room Selection */}
              <div className="mt-8">
                <label className="block text-sm font-semibold text-charcoal mb-3">
                  Select Room Category
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {rooms.map((room) => {
                    const isSelected = selectedRoom?.id === room.id;
                    let firstImage = '/images/rooms/dorm-pod-mixed.jpg';
                    try {
                      if (room.images) {
                        const parsed = typeof room.images === 'string' ? JSON.parse(room.images) : room.images;
                        if (Array.isArray(parsed) && parsed.length > 0) {
                          firstImage = parsed[0];
                        }
                      }
                    } catch (e) {}

                    return (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoom(room)}
                        className={`p-4 border-2 rounded-2xl cursor-pointer transition-all flex flex-col ${
                          isSelected
                            ? 'border-terracotta bg-cream shadow-md'
                            : 'border-sandstone/60 hover:border-terracotta bg-white'
                        }`}
                      >
                        <div className="relative h-36 w-full rounded-xl overflow-hidden mb-3 bg-[#152535]">
                          <Image
                            src={firstImage}
                            alt={room.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                          <span className="absolute top-2 right-2 text-[10px] font-bold uppercase bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded">
                            {room.type}
                          </span>
                        </div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-heading font-bold text-base text-charcoal">
                            {room.name}
                          </h3>
                        </div>
                        <p className="text-xs text-slate mb-3 line-clamp-2 flex-grow">
                          {room.description}
                        </p>
                        <div className="flex justify-between items-center pt-2 border-t border-sandstone/30 mt-auto">
                          <span className="text-xs text-warm-grey">Up to {room.capacity} guests</span>
                          <span className="font-heading text-lg font-bold text-terracotta">
                            ₹{room.pricePerNight} <span className="text-xs font-normal text-slate">/night</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleCheckAvailability}
                disabled={!range?.from || !range?.to || !selectedRoom || checking}
                className="mt-8 w-full bg-terracotta hover:bg-terracotta-dark text-white font-medium py-3.5 rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                {checking ? 'Checking Availability...' : 'Continue to Guest Details'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-sandstone">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-heading text-timber font-bold">
                  2. Guest Information
                </h2>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-terracotta hover:underline font-medium"
                >
                  &larr; Change Room/Dates
                </button>
              </div>
              <GuestDetailsForm onSubmit={handleGuestSubmit} />
            </div>
          )}

          {step === 3 && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-sandstone">
              <h2 className="text-2xl font-heading text-timber font-bold mb-3">
                3. Secure Online Payment
              </h2>
              <p className="text-slate text-sm mb-6">
                Complete your payment with Razorpay to instantly confirm your stay. All major UPI apps, cards, and netbanking are accepted.
              </p>

              {availabilityData && guestData && selectedRoom && range?.from && range?.to && (
                <div className="max-w-md">
                  <CheckoutButton
                    roomSlug={selectedRoom.slug}
                    checkIn={range.from.toISOString()}
                    checkOut={range.to.toISOString()}
                    numberOfGuests={1}
                    totalAmount={availabilityData.totalPrice}
                    guestName={guestData.guestName}
                    guestEmail={guestData.guestEmail}
                    guestPhone={guestData.guestPhone}
                    nationality={guestData.nationality}
                    govtIdType={guestData.govtIdType}
                    govtIdNumber={guestData.govtIdNumber}
                  />
                </div>
              )}
            </div>
          )}

          {/* Need Assistance helper */}
          <div className="bg-sandstone/20 rounded-xl p-4 flex items-center justify-between text-sm text-charcoal">
            <div className="flex items-center gap-2">
              <Info size={18} className="text-terracotta shrink-0" />
              <span>Have a question or special group request?</span>
            </div>
            <a
              href="https://wa.me/916006619569?text=Hi!%20I%20have%20a%20booking%20inquiry%20for%20House%20Of%20Karma."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-terracotta hover:underline shrink-0"
            >
              <MessageCircle size={16} />
              <span>+91 60066 19569</span>
            </a>
          </div>
        </div>

        {/* Right Sidebar: Price & Stay Summary */}
        <div className="lg:col-span-1">
          {step > 1 && availabilityData && selectedRoom ? (
            <div className="sticky top-24 space-y-4">
              <PriceBreakdown
                roomName={selectedRoom.name}
                pricePerNight={availabilityData.room.pricePerNight}
                nights={availabilityData.nights}
                taxAmount={availabilityData.taxAmount}
                totalAmount={availabilityData.totalPrice}
              />

              <div className="bg-cream rounded-2xl p-5 border border-sandstone text-xs space-y-2 text-slate">
                <p className="font-semibold text-charcoal">Hostel Inclusions:</p>
                <p>&bull; 24/7 Hot water (Solar + Backup)</p>
                <p>&bull; High-speed Starlink Wi-Fi</p>
                <p>&bull; Room heating & heated blankets</p>
                <p>&bull; Free rooftop stargazing session</p>
              </div>
            </div>
          ) : (
            <div className="bg-cream rounded-2xl p-6 border border-sandstone space-y-4 text-slate">
              <h3 className="font-heading font-bold text-lg text-charcoal">Why Book Direct?</h3>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-2">
                  <span className="text-terracotta font-bold">&check;</span> Guaranteed Best Rates
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-terracotta font-bold">&check;</span> Free High-Altitude Acclimatization Guidance
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-terracotta font-bold">&check;</span> Zero Hidden Booking Commission
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-terracotta font-bold">&check;</span> Instant WhatsApp Desk Support
                </li>
              </ul>
              <div className="pt-2 border-t border-sandstone/40">
                <p className="text-xs text-warm-grey">Desk Contact:</p>
                <a
                  href="tel:+916006619569"
                  className="font-bold text-charcoal hover:text-terracotta flex items-center gap-1 mt-1 text-sm"
                >
                  <Phone size={14} className="text-terracotta" />
                  +91 60066 19569
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <BrandedLoader
            message="Initializing booking engine..."
            submessage="Checking live room and pod availability"
          />
        </div>
      }
    >
      <BookPageContent />
    </Suspense>
  );
}
