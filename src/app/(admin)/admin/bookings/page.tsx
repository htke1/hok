'use client';

import { useState, useEffect } from 'react';
import { formatPrice, formatDate } from '@/lib/utils';
import { X, Search, BedDouble, Calendar, User, RefreshCw } from 'lucide-react';

type Booking = {
  id: string;
  guestName: string;
  room: { name: string };
  checkIn: string;
  checkOut: string;
  numberOfGuests: number;
  totalAmount: number;
  status: string;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' })
      });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;
    const matchesSearch = b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Top Header & Search / Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#2D3748]">Manage Bookings</h1>
          <p className="text-xs sm:text-sm text-[#4A5568] mt-0.5">
            View, filter, and manage guest reservations and direct hostel bookings.
          </p>
        </div>
        
        <button
          onClick={fetchBookings}
          className="self-start sm:self-auto px-3 py-1.5 text-xs font-semibold text-[#5C3D2E] bg-white border border-[#E0C097] rounded-xl hover:bg-[#FAF6F1] flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Filter Bar: Stacks on mobile */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-xs border border-[#E0C097]/40 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9B8B7E]" />
          <input
            type="text"
            placeholder="Search by guest name or ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#E0C097] rounded-xl text-xs sm:text-sm outline-none focus:border-[#B85C38] bg-[#FAF6F1]/40"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-[#4A5568] whitespace-nowrap">Filter:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 sm:flex-none border border-[#E0C097] rounded-xl px-3 py-2 text-xs sm:text-sm outline-none focus:border-[#B85C38] bg-white cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Container */}
      <div className="bg-white rounded-2xl shadow-xs border border-[#E0C097]/40 overflow-hidden">
        
        {/* 1. Mobile Card View (block md:hidden) */}
        <div className="block md:hidden divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center text-xs text-[#9B8B7E]">Loading bookings...</div>
          ) : filteredBookings.map((booking) => (
            <div key={booking.id} className="p-4 space-y-3 hover:bg-[#FAF6F1]/30 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-[#2D3748] capitalize flex items-center gap-1.5">
                    <User size={14} className="text-[#B85C38]" /> {booking.guestName}
                  </h4>
                  <p className="text-[11px] text-[#9B8B7E] font-mono mt-0.5">
                    Ref: #{booking.id.slice(-6).toUpperCase()}
                  </p>
                </div>
                <StatusBadge status={booking.status} />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 bg-[#FAF6F1] px-2 py-0.5 rounded-md border border-[#E0C097]/30 text-[11px] font-medium text-[#5C3D2E]">
                  <BedDouble size={13} className="text-[#B85C38]" /> {booking.room?.name || 'Room'}
                </span>
                <span className="text-[11px] text-[#9B8B7E]">
                  &bull; {booking.numberOfGuests || 1} {booking.numberOfGuests > 1 ? 'Guests' : 'Guest'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-[#4A5568] bg-[#FAF6F1]/50 p-2 rounded-xl border border-[#E0C097]/20">
                <div className="flex items-center gap-1 text-[11px]">
                  <Calendar size={13} className="text-[#9B8B7E]" />
                  <span>{formatDate(booking.checkIn)} &rarr; {formatDate(booking.checkOut)}</span>
                </div>
                <span className="font-heading font-bold text-sm text-[#B85C38]">
                  {formatPrice(booking.totalAmount)}
                </span>
              </div>

              {booking.status !== 'CANCELLED' && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <X size={13} /> Cancel Reservation
                  </button>
                </div>
              )}
            </div>
          ))}

          {!loading && filteredBookings.length === 0 && (
            <div className="p-8 text-center text-xs text-[#9B8B7E]">
              No bookings found matching your search.
            </div>
          )}
        </div>

        {/* 2. Desktop Table View (hidden md:block) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 text-[#4A5568] text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3.5 font-semibold">Ref</th>
                <th className="px-6 py-3.5 font-semibold">Guest</th>
                <th className="px-6 py-3.5 font-semibold">Room</th>
                <th className="px-6 py-3.5 font-semibold">Dates</th>
                <th className="px-6 py-3.5 font-semibold">Guests</th>
                <th className="px-6 py-3.5 font-semibold">Amount</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
                <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-500">Loading bookings...</td></tr>
              ) : filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-gray-400">#{booking.id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4 text-[#2D3748] font-medium">{booking.guestName}</td>
                  <td className="px-6 py-4 text-[#4A5568]">{booking.room?.name || '-'}</td>
                  <td className="px-6 py-4 text-[#4A5568] text-xs">
                    {formatDate(booking.checkIn)} <br/>to {formatDate(booking.checkOut)}
                  </td>
                  <td className="px-6 py-4 text-[#4A5568]">{booking.numberOfGuests}</td>
                  <td className="px-6 py-4 text-[#2D3748] font-semibold">{formatPrice(booking.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {booking.status !== 'CANCELLED' && (
                      <button 
                        onClick={() => handleCancel(booking.id)} 
                        className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors cursor-pointer" 
                        title="Cancel Booking"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-[#4A5568]">No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    CONFIRMED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    PENDING: 'bg-amber-50 text-amber-800 border-amber-200',
    CANCELLED: 'bg-red-50 text-red-800 border-red-200',
  };
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${styles[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
      {status}
    </span>
  );
}
