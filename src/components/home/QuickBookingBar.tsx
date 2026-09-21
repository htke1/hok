'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, Home, ArrowRight } from 'lucide-react';

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
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(17,66,105,0.25)] p-5 sm:p-7 text-left border border-white/40">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        
        {/* Check-in */}
        <div className="flex flex-col">
          <label htmlFor="checkIn" className="flex items-center gap-1.5 text-xs font-semibold text-[#1C6EA8] mb-1.5 uppercase tracking-wider">
            <Calendar size={13} />
            <span>Check-in</span>
          </label>
          <input 
            type="date" 
            id="checkIn" 
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E0C097]/60 rounded-xl focus:outline-none focus:border-[#1C6EA8] focus:ring-2 focus:ring-[#1C6EA8]/15 text-[#1E2732] text-sm font-medium transition-all"
            required
          />
        </div>

        {/* Check-out */}
        <div className="flex flex-col">
          <label htmlFor="checkOut" className="flex items-center gap-1.5 text-xs font-semibold text-[#1C6EA8] mb-1.5 uppercase tracking-wider">
            <Calendar size={13} />
            <span>Check-out</span>
          </label>
          <input 
            type="date" 
            id="checkOut" 
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E0C097]/60 rounded-xl focus:outline-none focus:border-[#1C6EA8] focus:ring-2 focus:ring-[#1C6EA8]/15 text-[#1E2732] text-sm font-medium transition-all"
            required
          />
        </div>

        {/* Room Type */}
        <div className="flex flex-col">
          <label htmlFor="roomType" className="flex items-center gap-1.5 text-xs font-semibold text-slate mb-1.5 uppercase tracking-wider">
            <Home size={13} />
            <span>Category</span>
          </label>
          <select 
            id="roomType" 
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E0C097]/60 rounded-xl focus:outline-none focus:border-[#1C6EA8] focus:ring-2 focus:ring-[#1C6EA8]/15 text-[#1E2732] text-sm font-medium transition-all appearance-none cursor-pointer"
          >
            <option value="Dorm Pod">Dorm Pod (Mixed / Female)</option>
            <option value="Private Room">Private Himalayan Room</option>
          </select>
        </div>

        {/* Guests */}
        <div className="flex flex-col">
          <label htmlFor="guests" className="flex items-center gap-1.5 text-xs font-semibold text-slate mb-1.5 uppercase tracking-wider">
            <Users size={13} />
            <span>Guests</span>
          </label>
          <select 
            id="guests" 
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E0C097]/60 rounded-xl focus:outline-none focus:border-[#1C6EA8] focus:ring-2 focus:ring-[#1C6EA8]/15 text-[#1E2732] text-sm font-medium transition-all appearance-none cursor-pointer"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
            ))}
          </select>
        </div>

        {/* Submit CTA */}
        <div className="flex flex-col sm:col-span-2 lg:col-span-1 mt-2 lg:mt-0">
          <button 
            type="submit" 
            className="w-full bg-[#1C6EA8] hover:bg-[#114269] text-white font-medium py-2.5 px-5 rounded-xl transition-all duration-200 h-[44px] flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm"
          >
            <span>Check Availability</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
