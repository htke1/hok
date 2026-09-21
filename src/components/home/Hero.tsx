import QuickBookingBar from './QuickBookingBar';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center bg-gradient-to-br from-charcoal via-timber to-terracotta">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/30 to-transparent"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center pt-20">
        <p className="text-sandstone font-medium tracking-widest text-sm uppercase mb-4">
          Leh, Ladakh &middot; 11,500 FT
        </p>
        <h1 className="font-heading text-5xl md:text-7xl text-white font-bold leading-tight mb-6">
          Your Mountain Home<br />Awaits
        </h1>
        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-12">
          A cozy backpacker hostel nestled in the heart of Leh. Community-driven stays, warm dorms, and the gateway to your Ladakh adventure.
        </p>
        
        <div className="w-full max-w-5xl mx-auto">
          <QuickBookingBar />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white/50" />
      </div>
    </section>
  );
}
