import { db } from '@/lib/db';
import { formatPrice, formatDate } from '@/lib/utils';
import { CalendarCheck, DollarSign, Clock, Users, ArrowUpRight, BedDouble, Calendar } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  let totalBookings = 0;
  let confirmedBookings = 0;
  let pendingBookings = 0;
  let revenue = 0;
  let recentBookings: any[] = [];

  try {
    const [total, confirmed, pending, revResult, recent] = await Promise.all([
      db.booking.count({
        where: { createdAt: { gte: startOfMonth, lte: endOfMonth } }
      }),
      db.booking.count({
        where: { status: 'CONFIRMED', createdAt: { gte: startOfMonth, lte: endOfMonth } }
      }),
      db.booking.count({
        where: { status: 'PENDING' }
      }),
      db.booking.aggregate({
        _sum: { totalAmount: true },
        where: { status: 'CONFIRMED', createdAt: { gte: startOfMonth, lte: endOfMonth } }
      }),
      db.booking.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { room: true }
      }),
    ]);

    totalBookings = total;
    confirmedBookings = confirmed;
    pendingBookings = pending;
    revenue = revResult._sum.totalAmount || 0;
    recentBookings = recent;
  } catch (error) {
    console.warn('Dashboard DB query fallback:', error);
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Title & Date */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#2D3748]">Dashboard</h1>
          <p className="text-xs sm:text-sm text-[#4A5568] mt-0.5">Today is {formatDate(today.toISOString())}</p>
        </div>
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#B85C38] hover:underline self-start sm:self-auto"
        >
          View all bookings <ArrowUpRight size={15} />
        </Link>
      </div>

      {/* Stats Grid: 2-column on mobile, 4-column on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <StatCard
          icon={<CalendarCheck size={18} className="sm:w-5 sm:h-5 text-[#B85C38]" />}
          label="Total (Month)"
          value={totalBookings}
        />
        <StatCard
          icon={<Users size={18} className="sm:w-5 sm:h-5 text-emerald-600" />}
          label="Confirmed"
          value={confirmedBookings}
        />
        <StatCard
          icon={<DollarSign size={18} className="sm:w-5 sm:h-5 text-[#B85C38]" />}
          label="Revenue"
          value={formatPrice(revenue)}
        />
        <StatCard
          icon={<Clock size={18} className="sm:w-5 sm:h-5 text-amber-600" />}
          label="Pending"
          value={pendingBookings}
        />
      </div>

      {/* Recent Bookings Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E0C097]/40 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-heading font-bold text-[#2D3748]">Recent Bookings</h3>
            <p className="text-xs text-[#9B8B7E] hidden sm:block">Latest direct website bookings and reservation status</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-[#FAF6F1] text-[#5C3D2E] rounded-full border border-[#E0C097]/40">
            {recentBookings.length} bookings
          </span>
        </div>

        {/* 1. Mobile Card View (block md:hidden) */}
        <div className="block md:hidden divide-y divide-gray-100">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="p-4 space-y-2.5 hover:bg-[#FAF6F1]/30 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-[#2D3748] capitalize">{booking.guestName}</h4>
                  <p className="text-[11px] text-[#9B8B7E] font-mono">Ref: #{booking.id.slice(-6).toUpperCase()}</p>
                </div>
                <StatusBadge status={booking.status} />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-[#4A5568]">
                <span className="inline-flex items-center gap-1 bg-[#FAF6F1] px-2 py-0.5 rounded-md border border-[#E0C097]/30 text-[11px] font-medium text-[#5C3D2E]">
                  <BedDouble size={13} className="text-[#B85C38]" /> {booking.room?.name || 'Standard'}
                </span>
                <span className="text-[11px] text-[#9B8B7E]">
                  &bull; {booking.numberOfGuests || 1} {booking.numberOfGuests > 1 ? 'Guests' : 'Guest'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-dashed border-gray-100 text-xs">
                <div className="flex items-center gap-1 text-[#4A5568] text-[11px]">
                  <Calendar size={13} className="text-[#9B8B7E]" />
                  <span>{formatDate(booking.checkIn.toISOString())} &rarr; {formatDate(booking.checkOut.toISOString())}</span>
                </div>
                <span className="font-heading font-bold text-sm text-[#B85C38]">
                  {formatPrice(booking.totalAmount)}
                </span>
              </div>
            </div>
          ))}

          {recentBookings.length === 0 && (
            <div className="p-8 text-center text-xs text-[#9B8B7E]">
              No recent bookings found.
            </div>
          )}
        </div>

        {/* 2. Desktop Table View (hidden md:block) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 text-[#4A5568] text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3.5 font-semibold">Guest Name</th>
                <th className="px-6 py-3.5 font-semibold">Room</th>
                <th className="px-6 py-3.5 font-semibold">Check-in</th>
                <th className="px-6 py-3.5 font-semibold">Check-out</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
                <th className="px-6 py-3.5 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#2D3748]">
                    {booking.guestName}
                    <span className="block text-xs font-mono text-gray-400">#{booking.id.slice(-6).toUpperCase()}</span>
                  </td>
                  <td className="px-6 py-4 text-[#4A5568]">{booking.room?.name || '-'}</td>
                  <td className="px-6 py-4 text-[#4A5568]">{formatDate(booking.checkIn.toISOString())}</td>
                  <td className="px-6 py-4 text-[#4A5568]">{formatDate(booking.checkOut.toISOString())}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-[#2D3748]">
                    {formatPrice(booking.totalAmount)}
                  </td>
                </tr>
              ))}
              {recentBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#4A5568]">
                    No recent bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-[#E0C097]/40 p-3.5 sm:p-5 flex items-center space-x-3 sm:space-x-4">
      <div className="bg-[#FAF6F1] p-2.5 sm:p-3 rounded-xl shrink-0 border border-[#E0C097]/30">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] sm:text-xs font-medium text-[#4A5568] truncate mb-0.5">{label}</p>
        <p className="text-lg sm:text-2xl font-heading font-bold text-[#2D3748] truncate">{value}</p>
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
