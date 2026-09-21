import Image from 'next/image';
import { Bike, Car, FileText, Map, Sparkles, Coffee, Flame, Compass, ArrowRight } from 'lucide-react';

const experiences = [
  {
    title: 'Karma Cafe & Breakfast',
    subtitle: 'Soulful Fuel for High Altitudes',
    description: 'Sunlit rustic timber cafe with our signature tree-shaped library. Serving fresh espresso, Ladakhi butter tea, and hearty Shakshuka & egg bowls.',
    image: '/images/experience/cafe.jpg',
    badge: 'In-House Cafe',
    icon: Coffee
  },
  {
    title: 'Bonfire & Acoustic Nights',
    subtitle: 'Where Solo Backpackers Connect',
    description: 'Weekly fire pit circles in the open courtyard. Travelers gather with guitars, warm chai, and stories from Khardung La and Changthang.',
    image: '/images/experience/bonfire.jpg',
    badge: 'Community Vibe',
    icon: Flame
  },
  {
    title: 'Digital Nomad Lounge',
    subtitle: 'Work at 11,500 Feet Without Friction',
    description: 'Authentic Ladakhi low-seating majlis with carved choktse wooden tables, Tibetan carpets, and robust Starlink / fiber optic Wi-Fi.',
    image: '/images/experience/nomad-lounge.jpg',
    badge: 'Co-Working',
    icon: Sparkles
  },
  {
    title: 'Stargazing & Twilight Courtyard',
    subtitle: 'Unpolluted Himalayan Skies',
    description: 'Relax under glowing festoon string lights in the courtyard, or head up to the open terrace for unblemished views of the Milky Way.',
    image: '/images/experience/stargazing-courtyard.jpg',
    badge: 'Night Experience',
    icon: Compass
  }
];

export default function CommunityHub() {
  return (
    <section id="community" className="bg-[#101923] text-white py-24 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#1C6EA8]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#B85C38]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-white/10 text-[#E0C097] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/10 mb-4">
            <Sparkles size={13} className="text-[#2384CE]" />
            <span>Community & Way of Life</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
            Life at <span className="italic font-normal text-[#E2B887]">House Of Karma</span>
          </h2>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed">
            More than just a warm bed. A grounded sanctuary where travelers connect, digital nomads create, and mountain stories come alive.
          </p>
        </div>

        {/* 4 Photo Experience Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {experiences.map((exp, idx) => {
            const Icon = exp.icon;
            return (
              <div 
                key={idx}
                className="group relative rounded-3xl overflow-hidden bg-[#162330] border border-white/10 hover:border-[#1C6EA8]/60 transition-all duration-300 shadow-xl flex flex-col"
              >
                {/* Photo area */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#162330] via-[#162330]/40 to-transparent" />
                  
                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wide text-white/90 border border-white/10">
                    <Icon size={13} className="text-[#E2B887]" />
                    <span>{exp.badge}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 flex flex-col flex-grow -mt-6 relative z-10">
                  <span className="text-xs uppercase tracking-wider text-[#E2B887] font-semibold mb-1">
                    {exp.subtitle}
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-white mb-3 group-hover:text-[#2384CE] transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-white/75 text-sm leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Adventure Desk Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-[#18293B] to-[#121E2B] border border-[#1C6EA8]/30 p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#2384CE]/20 text-[#2384CE] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                <span>In-House Adventure Desk</span>
              </div>
              <h3 className="font-heading text-3xl sm:text-4xl font-bold text-white leading-tight">
                Explore Ladakh With Honest Guidance
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Skip rip-off commissions. Our travel team arranges reliable Royal Enfields, pooled shared cabs to Nubra & Pangong, and prompt Inner Line Permit (ILP) documentation.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/916006619569?text=Hi!%20I'm%20planning%20my%20trip%20to%20Leh%20and%20would%20love%20help%20with%20bikes/permits."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#2384CE] hover:bg-[#1C6EA8] text-white font-medium px-6 py-3 rounded-xl transition-all shadow-md text-sm"
                >
                  <span>Talk to Adventure Desk</span>
                  <ArrowRight size={15} />
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#B85C38]/20 flex items-center justify-center text-[#D4845F] mb-3">
                  <Bike size={20} />
                </div>
                <h4 className="font-bold text-base text-white mb-1">Bikes & Himalayans</h4>
                <p className="text-white/60 text-xs leading-relaxed">
                  Verified Royal Enfield 350/450 & Himalayan rentals with helmets and breakdown support.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#2384CE]/20 flex items-center justify-center text-[#2384CE] mb-3">
                  <Car size={20} />
                </div>
                <h4 className="font-bold text-base text-white mb-1">Shared Cab Pooling</h4>
                <p className="text-white/60 text-xs leading-relaxed">
                  Split taxi costs with fellow hostel guests to Nubra Valley, Pangong Tso, and Tso Moriri.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#E0C097]/20 flex items-center justify-center text-[#E0C097] mb-3">
                  <FileText size={20} />
                </div>
                <h4 className="font-bold text-base text-white mb-1">Inner Line Permits</h4>
                <p className="text-white/60 text-xs leading-relaxed">
                  Hassle-free permit processing for Indian and international travelers within 24 hours.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                  <Map size={20} />
                </div>
                <h4 className="font-bold text-base text-white mb-1">Curated Treks & Stays</h4>
                <p className="text-white/60 text-xs leading-relaxed">
                  Uncommercialized routes, Sham Valley day treks, and village homestay recommendations.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
