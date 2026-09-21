'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuickBookingBar() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [roomType, setRoomType] = useState('Dorm Pod');
  const [guests, setGuests] = useState('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      type: roomType,
      guests,
    });
    router.push(`/book?${params.toString()}`);
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-left">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        
        <div className="flex flex-col">
          <label htmlFor="checkIn" className="text-xs font-semibold text-warm-grey mb-1 uppercase tracking-wider">Check-in</label>
          <input 
            type="date" 
            id="checkIn" 
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full px-4 py-2 border border-sandstone rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 text-charcoal bg-transparent"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="checkOut" className="text-xs font-semibold text-warm-grey mb-1 uppercase tracking-wider">Check-out</label>
          <input 
            type="date" 
            id="checkOut" 
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full px-4 py-2 border border-sandstone rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 text-charcoal bg-transparent"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="roomType" className="text-xs font-semibold text-warm-grey mb-1 uppercase tracking-wider">Room Type</label>
          <select 
            id="roomType" 
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full px-4 py-2 border border-sandstone rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 text-charcoal bg-transparent appearance-none"
          >
            <option value="Dorm Pod">Dorm Pod</option>
            <option value="Private Room">Private Room</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="guests" className="text-xs font-semibold text-warm-grey mb-1 uppercase tracking-wider">Guests</label>
          <select 
            id="guests" 
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full px-4 py-2 border border-sandstone rounded-lg focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 text-charcoal bg-transparent appearance-none"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col mt-4 md:mt-0">
          <button 
            type="submit" 
            className="w-full bg-terracotta hover:bg-terracotta-dark text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 h-[42px]"
          >
            Check Availability
          </button>
        </div>
      </form>
    </div>
  );
}
