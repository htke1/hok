import { db } from '@/lib/db';
import { formatPrice, formatDate } from '@/lib/utils';
import { CalendarCheck, DollarSign, Clock, Users } from 'lucide-react';

export default async function AdminDashboardPage() {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Fetch stats
  const totalBookings = await db.booking.count({
    where: { createdAt: { gte: startOfMonth, lte: endOfMonth } }
  });

  const confirmedBookings = await db.booking.count({
    where: { status: 'CONFIRMED', createdAt: { gte: startOfMonth, lte: endOfMonth } }
  });

  const pendingBookings = await db.booking.count({
    where: { status: 'PENDING' }
  });

  const revenueResult = await db.booking.aggregate({
    _sum: { totalAmount: true },
    where: { status: 'CONFIRMED', createdAt: { gte: startOfMonth, lte: endOfMonth } }
  });
  const revenue = revenueResult._sum.totalAmount || 0;

  // Fetch recent bookings
  const recentBookings = await db.booking.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { room: true }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-[#2D3748]">Dashboard</h1>
        <p className="text-[#4A5568]">Today is {formatDate(today.toISOString())}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<CalendarCheck size={24} />} label="Total Bookings (Month)" value={totalBookings} />
        <StatCard icon={<Users size={24} />} label="Confirmed (Month)" value={confirmedBookings} />
        <StatCard icon={<DollarSign size={24} />} label="Revenue (Month)" value={formatPrice(revenue)} />
        <StatCard icon={<Clock size={24} />} label="Pending Bookings" value={pendingBookings} />
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-heading font-semibold text-[#2D3748]">Recent Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[#4A5568] text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Guest Name</th>
                <th className="px-6 py-4 font-medium">Room</th>
                <th className="px-6 py-4 font-medium">Check-in</th>
                <th className="px-6 py-4 font-medium">Check-out</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-[#2D3748] font-medium">{booking.guestName}</td>
                  <td className="px-6 py-4 text-[#4A5568]">{booking.room.name}</td>
                  <td className="px-6 py-4 text-[#4A5568]">{formatDate(booking.checkIn.toISOString())}</td>
                  <td className="px-6 py-4 text-[#4A5568]">{formatDate(booking.checkOut.toISOString())}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-6 py-4 text-[#2D3748] font-medium">{formatPrice(booking.totalAmount)}</td>
                </tr>
              ))}
              {recentBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#4A5568]">No recent bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 flex items-start space-x-4">
      <div className="bg-[#FAF6F1] text-[#B85C38] p-3 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-[#4A5568] mb-1">{label}</p>
        <p className="text-3xl font-heading font-semibold text-[#2D3748]">{value}</p>
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
