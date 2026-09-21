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
          <Link href="/" className="flex items-center gap-3 z-50 relative">
            <Image
              src="/logo.png"
              alt="House Of Karma Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className={`font-heading text-xl font-bold tracking-wider ${isScrolled || isMobileMenuOpen ? 'text-charcoal' : 'text-white drop-shadow-md'}`}>
              HOUSE OF KARMA
            </span>
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
        className={`fixed inset-0 bg-off-white z-40 transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-heading text-3xl text-charcoal hover:text-terracotta transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/book"
            onClick={() => setIsMobileMenuOpen(false)}
            className="bg-terracotta hover:bg-[#a04e2e] text-white px-8 py-4 rounded-full font-heading text-xl transition-colors mt-8 shadow-md"
          >
            Book Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
