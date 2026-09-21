import Image from 'next/image';
import QuickBookingBar from './QuickBookingBar';
import { ChevronDown, Sparkles, MapPin } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden">
      {/* Real Property Facade Background with Editorial Vignette */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hostel/facade.jpg"
          alt="House Of Karma hostel building in Leh, Ladakh with traditional whitewashed walls and azure blue balconies"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 transform duration-1000 ease-out"
        />
        {/* Subtle, luxurious multi-stage gradient overlay (prevents cheap flat dark filters) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111A24] via-[#152535]/80 to-[#121E2B]/85" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0F1722]/50 to-[#0A1017]/90" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center pt-32 sm:pt-36 pb-12">
        {/* Architectural Heritage Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest text-white/90 mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#2384CE] animate-pulse"></span>
          <span>Fort Road, Leh &middot; 11,500 FT &middot; Boutique Backpacker Stays</span>
        </div>

        {/* Editorial Serif Heading */}
        <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-bold leading-[1.1] max-w-5xl tracking-tight mb-6 drop-shadow-md">
          Where Himalayan Heritage <br className="hidden sm:inline" />
          <span className="italic font-normal text-[#E2B887]">Meets Backpacker Soul</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
          Traditional Ladakhi whitewashed stone, iconic azure balconies, and cozy heated dorm pods designed for wanderers, bikers, and digital nomads.
        </p>

        {/* Floating Booking Bar */}
        <div className="w-full max-w-5xl mx-auto mb-6">
          <QuickBookingBar />
        </div>

        {/* Micro highlights */}
        <div className="hidden sm:flex items-center justify-center gap-6 text-xs text-white/70 tracking-wider uppercase font-medium mt-2">
          <span className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#2384CE]" /> 24/7 Hot Water (Solar + Geyser)
          </span>
          <span className="text-white/30">&bull;</span>
          <span className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#E0C097]" /> High-Speed Starlink Wi-Fi
          </span>
          <span className="text-white/30">&bull;</span>
          <span className="flex items-center gap-1.5">
            <MapPin size={13} className="text-[#D4845F]" /> 5 Min Walk to Leh Bazaar
          </span>
        </div>
      </div>

      {/* Organic Mountain / Wave Contour Divider (Inspired by the flowing blue-and-white wall art from Image 1) */}
      <div className="relative z-10 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 88"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 sm:h-16 md:h-20 text-[#FAF7F2] preserve-3d"
        >
          {/* Subtle back layer contour in soft azure tint */}
          <path
            d="M0,32 C240,64 480,12 720,44 C960,76 1200,24 1440,52 L1440,88 L0,88 Z"
            fill="#1C6EA8"
            fillOpacity="0.12"
          />
          {/* Main foreground chalk plaster wave */}
          <path
            d="M0,48 C280,16 540,68 820,38 C1100,8 1320,62 1440,48 L1440,88 L0,88 Z"
            fill="currentColor"
          />
        </svg>

        {/* Subtle bouncing indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-40">
          <ChevronDown size={22} className="text-slate animate-bounce" />
        </div>
      </div>
    </section>
  );
}
