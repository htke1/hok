'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, BookOpen, CalendarDays, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const links = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/bookings', icon: BookOpen, label: 'Bookings' },
    { href: '/admin/calendar', icon: CalendarDays, label: 'Calendar' },
  ];

  return (
    <>
      {/* 1. Desktop Sidebar (md and up) */}
      <aside className="w-64 bg-[#2D3748] text-white flex-col hidden md:flex shrink-0 min-h-screen">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-7 relative flex items-center justify-center shrink-0">
              <Image
                src="/logo-emblem-white.png"
                alt="House Of Karma Logo"
                width={36}
                height={26}
                className="w-auto h-7 object-contain"
              />
            </div>
            <div>
              <span className="text-base font-heading font-bold text-white tracking-wide block leading-tight">
                House Of Karma
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#E0C097] font-semibold block">
                Admin Portal
              </span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 space-y-1 mt-4">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center space-x-3 px-6 py-3 transition-colors",
                  isActive 
                    ? "bg-[#4A5568] text-[#B85C38] border-l-4 border-[#B85C38]" 
                    : "text-gray-300 hover:bg-[#4A5568] hover:text-white border-l-4 border-transparent"
                )}
              >
                <Icon size={20} />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-gray-300 hover:text-white transition-colors rounded-xl hover:bg-slate-700/50 cursor-pointer"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. Mobile Floating Bottom Navigation Bar (below md) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E0C097]/40 shadow-lg px-2 py-1.5 flex items-center justify-around">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all",
                isActive 
                  ? "text-[#B85C38] font-bold bg-[#FAF6F1]" 
                  : "text-[#4A5568] hover:text-[#2D3748]"
              )}
            >
              <Icon size={20} className={isActive ? "text-[#B85C38]" : "text-[#4A5568]"} />
              <span className="text-[11px] mt-0.5">{link.label}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center py-1.5 px-3 text-[#4A5568] hover:text-red-600 cursor-pointer"
          title="Logout"
        >
          <LogOut size={20} />
          <span className="text-[11px] mt-0.5">Logout</span>
        </button>
      </div>
    </>
  );
}
