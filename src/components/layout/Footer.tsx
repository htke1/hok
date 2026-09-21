import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Globe, Hash, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white/80 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-8 flex items-center justify-center">
                <Image
                  src="/logo-emblem-white.png"
                  alt="House Of Karma Logo"
                  width={56}
                  height={36}
                  className="w-auto h-8 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xl font-bold text-white tracking-wider leading-tight">
                  HOUSE OF KARMA
                </span>
                <span className="text-[10px] tracking-widest uppercase text-[#E0C097] font-medium">
                  Leh &middot; Ladakh
                </span>
              </div>
            </div>
            <p className="font-heading text-sandstone text-lg italic">
              Your mountain home in Leh, Ladakh
            </p>
            <p className="text-sm">
              Experience the magic of the Himalayas in our warm, community-driven backpacker hostel. Authentic culture, comfortable stays, and lifelong friendships await.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-terracotta transition-colors"><Globe size={20} /></a>
              <a href="#" className="hover:text-terracotta transition-colors"><Hash size={20} /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-heading text-white text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'Rooms', 'Experience', 'Location', 'Book Now'].map((item) => (
                <li key={item}>
                  <Link href={item === 'Home' ? '/' : item === 'Book Now' ? '/book' : `/#${item.toLowerCase()}`} className="hover:text-terracotta transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="font-heading text-white text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm">
                <MapPin size={18} className="text-terracotta shrink-0 mt-0.5" />
                <span>Fort Road, Leh, Ladakh 194101</span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Phone size={18} className="text-terracotta shrink-0" />
                <a href="tel:+916006619569" className="hover:text-terracotta transition-colors">+91 60066 19569</a>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <MessageCircle size={18} className="text-terracotta shrink-0" />
                <a 
                  href="https://wa.me/916006619569?text=Hi!%20I%20have%20an%20inquiry%20regarding%20House%20Of%20Karma." 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-terracotta transition-colors"
                >
                  WhatsApp: +91 60066 19569
                </a>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Mail size={18} className="text-terracotta shrink-0" />
                <a href="mailto:hello@houseofkarma.in" className="hover:text-terracotta transition-colors">hello@houseofkarma.in</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Essentials */}
          <div>
            <h3 className="font-heading text-white text-lg mb-6">Essentials</h3>
            <ul className="space-y-3">
              {['Acclimatization Tips', 'How to Reach Leh', 'Permits & Inner Line', 'Packing Guide'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="hover:text-terracotta transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; {new Date().getFullYear()} House Of Karma. All rights reserved.</p>
          <p className="mt-4 md:mt-0 flex items-center gap-1">
            Made with <span className="text-terracotta">❤️</span> in Leh, Ladakh
          </p>
        </div>
      </div>
    </footer>
  );
}
