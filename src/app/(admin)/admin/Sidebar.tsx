'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, BookOpen, CalendarDays, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

import Image from 'next/image';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

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
    <div className="w-64 bg-[#2D3748] text-white flex flex-col hidden md:flex">
      <div className="p-6 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-7 relative flex items-center justify-center shrink-0">
            <Image
              src="/logo-emblem-white.png"
              alt="House Of Karma Logo"
              width={40}
              height={28}
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
          className="flex items-center space-x-3 px-2 py-3 w-full text-gray-300 hover:text-white transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
