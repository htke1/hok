'use client';

import { useState, useEffect } from 'react';
import { formatPrice, formatDate } from '@/lib/utils';
import { Eye, X } from 'lucide-react';

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
      const res = await fetch('/api/admin/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
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
      await fetch(`/api/admin/bookings/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'CANCELLED' }) });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;
    const matchesSearch = b.guestName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-heading font-bold text-[#2D3748]">Manage Bookings</h1>
        
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search guest..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-[#E0C097] rounded-xl px-4 py-2 outline-none focus:border-[#B85C38]"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-[#E0C097] rounded-xl px-4 py-2 outline-none focus:border-[#B85C38] bg-white"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[#4A5568] text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Ref</th>
                <th className="px-6 py-4 font-medium">Guest</th>
                <th className="px-6 py-4 font-medium">Room</th>
                <th className="px-6 py-4 font-medium">Dates</th>
                <th className="px-6 py-4 font-medium">Guests</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={8} className="px-6 py-8 text-center">Loading...</td></tr>
              ) : filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-gray-500">{booking.id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4 text-[#2D3748] font-medium">{booking.guestName}</td>
                  <td className="px-6 py-4 text-[#4A5568]">{booking.room?.name || '-'}</td>
                  <td className="px-6 py-4 text-[#4A5568] text-sm">
                    {formatDate(booking.checkIn)} <br/>to {formatDate(booking.checkOut)}
                  </td>
                  <td className="px-6 py-4 text-[#4A5568]">{booking.numberOfGuests}</td>
                  <td className="px-6 py-4 text-[#2D3748] font-medium">{formatPrice(booking.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 p-1" title="View Details">
                      <Eye size={18} />
                    </button>
                    {booking.status !== 'CANCELLED' && (
                      <button onClick={() => handleCancel(booking.id)} className="text-red-600 hover:text-red-800 p-1" title="Cancel Booking">
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
    CONFIRMED: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}
