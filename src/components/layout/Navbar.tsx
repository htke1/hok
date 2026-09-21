'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Rooms', href: '#rooms' },
    { name: 'Experience', href: '#community' },
    { name: 'Location', href: '#location' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? 'bg-off-white shadow-md py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 z-50 relative group">
            <div className="relative w-12 h-8 flex items-center justify-center transition-transform group-hover:scale-105">
              <Image
                src={isScrolled || isMobileMenuOpen ? '/logo-emblem.png' : '/logo-emblem-white.png'}
                alt="House Of Karma Logo"
                width={56}
                height={36}
                priority
                className="w-auto h-8 object-contain drop-shadow-sm"
              />
            </div>
            <div className="flex flex-col">
              <span className={`font-heading text-lg sm:text-xl font-bold tracking-wider leading-tight ${isScrolled || isMobileMenuOpen ? 'text-[#1E2732]' : 'text-white drop-shadow-md'}`}>
                HOUSE OF KARMA
              </span>
              <span className={`text-[10px] tracking-widest uppercase font-medium ${isScrolled || isMobileMenuOpen ? 'text-[#B85C38]' : 'text-[#E0C097]'}`}>
                Leh &middot; Ladakh
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`font-body text-sm font-medium hover:text-terracotta transition-colors ${
                  isScrolled ? 'text-charcoal' : 'text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/book"
              className="bg-terracotta hover:bg-[#a04e2e] text-white px-6 py-2 rounded-full font-body font-semibold transition-colors shadow-sm"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center z-50 relative">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 focus:outline-none ${isScrolled || isMobileMenuOpen ? 'text-charcoal' : 'text-white'}`}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-off-white z-40 transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-between p-8 pt-24 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile Brand Top */}
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-16 relative mb-2">
            <Image
              src="/logo-emblem.png"
              alt="House Of Karma Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-heading text-2xl font-bold tracking-wider text-charcoal">
            HOUSE OF KARMA
          </span>
          <span className="text-xs tracking-widest uppercase text-terracotta font-semibold mt-1">
            Boutique Backpacker Hostel &middot; Leh
          </span>
        </div>

        <div className="flex flex-col items-center justify-center space-y-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-heading text-2xl text-charcoal hover:text-terracotta transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/book"
            onClick={() => setIsMobileMenuOpen(false)}
            className="bg-terracotta hover:bg-[#a04e2e] text-white px-8 py-3.5 rounded-full font-heading text-lg transition-colors mt-4 shadow-md w-full max-w-xs text-center"
          >
            Book Now
          </Link>
        </div>

        <div className="text-center text-xs text-slate pb-4">
          <span>Fort Road, Leh, Ladakh · 11,500 ft</span>
        </div>
      </div>
    </nav>
  );
}
