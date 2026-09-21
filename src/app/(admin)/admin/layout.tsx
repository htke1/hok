import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import Sidebar from './Sidebar';
import Image from 'next/image';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-[#FAF6F1] text-[#2D3748]">
      {/* Sidebar & Mobile Bottom Nav */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-[#E0C097]/40 h-16 flex items-center justify-between px-4 sm:px-6 md:px-8 shrink-0 sticky top-0 z-40 shadow-xs">
          <div className="flex items-center gap-2.5">
            {/* Mobile Logo Brand */}
            <Link href="/admin/dashboard" className="md:hidden flex items-center gap-2">
              <div className="w-8 h-6 relative shrink-0">
                <Image
                  src="/logo-emblem.png"
                  alt="House Of Karma"
                  width={32}
                  height={24}
                  className="object-contain"
                />
              </div>
              <span className="font-heading font-bold text-base text-[#2D3748] tracking-tight">
                House Of Karma
              </span>
            </Link>

            {/* Desktop Brand Label */}
            <h2 className="hidden md:block text-xl font-heading font-semibold text-[#2D3748]">
              House Of Karma Admin
            </h2>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-xs sm:text-sm text-[#4A5568] bg-[#FAF6F1] px-2.5 py-1 rounded-full border border-[#E0C097]/40">
              User: <span className="font-bold text-[#B85C38]">{session.username}</span>
            </span>
          </div>
        </header>

        {/* Main View Area */}
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 pb-24 md:pb-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
