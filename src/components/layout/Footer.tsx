import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Globe, Hash } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white/80 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="HOK Logo" width={40} height={40} className="h-10 w-auto grayscale brightness-200" />
              <span className="font-heading text-xl font-bold text-white tracking-wider">HOUSE OF KARMA</span>
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
                <span>+91 9876543210</span>
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
