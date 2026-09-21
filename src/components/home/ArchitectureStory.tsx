import Image from 'next/image';
import Link from 'next/link';
import { Compass, Sparkles, Mountain, ArrowRight } from 'lucide-react';

export default function ArchitectureStory() {
  return (
    <section className="py-24 bg-white relative overflow-hidden border-b border-[#1C6EA8]/10">
      {/* Subtle organic background wave */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-[#1C6EA8]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-[#B85C38]/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#FAF7F2] text-[#1C6EA8] text-xs font-semibold uppercase tracking-widest px-4 py-1 rounded-full border border-[#1C6EA8]/20 mb-3">
            <Compass size={14} />
            <span>The Space & Architecture</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl text-[#1E2732] font-bold tracking-tight mb-4">
            Aesthetic Heritage, Not Standard Hospitality
          </h2>
          <p className="text-slate text-base leading-relaxed">
            Inspired by Ladakh’s raw topography and vernacular building wisdom. We balanced traditional thick-stone insulation with playful contemporary mountain wave art.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          
          {/* Left Column: Facade & Exterior Narrative */}
          <div className="space-y-6">
            <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(17,66,105,0.15)] border-2 border-[#1C6EA8]/20 group h-80 sm:h-96">
              <Image
                src="/images/hostel/facade.jpg"
                alt="House Of Karma exterior showing traditional Ladakhi white plaster and signature azure blue balcony"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase tracking-widest text-[#E2B887] font-semibold block mb-1">
                  Exterior & Verandas
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold">
                  Whitewashed Stucco & Azure Timber
                </h3>
              </div>
            </div>

            <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#1C6EA8]/10 space-y-3 text-sm text-slate">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#EEF5FB] text-[#1C6EA8] mt-0.5 shrink-0">
                  <Mountain size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-[#1E2732]">Heavy Stone Insulation</h4>
                  <p className="text-xs leading-relaxed text-slate mt-0.5">
                    Authentic Ladakhi plaster walls keep the property naturally cool under the harsh summer sun and hold residual warmth when night temperatures plummet.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interior Wave Wall Art Narrative */}
          <div className="space-y-6">
            <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(17,66,105,0.15)] border-2 border-[#1C6EA8]/20 group h-80 sm:h-96">
              <Image
                src="/images/rooms/bathroom-ensuite.jpg"
                alt="Artistic flowing blue and white mountain wave wall mural inside House Of Karma ensuite bathroom"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase tracking-widest text-[#E2B887] font-semibold block mb-1">
                  Artistic Interior Design
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold">
                  The Mountain Wave Silhouette
                </h3>
              </div>
            </div>

            <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#1C6EA8]/10 space-y-3 text-sm text-slate">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#EEF5FB] text-[#1C6EA8] mt-0.5 shrink-0">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-[#1E2732]">Hand-Painted River & Ridge Motifs</h4>
                  <p className="text-xs leading-relaxed text-slate mt-0.5">
                    The custom azure-on-chalk contour pays homage to the meandering Indus River and the dramatic ridgelines of the Zanskar range that surround Leh.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Callout */}
        <div className="bg-[#112233] text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-heading text-2xl sm:text-3xl font-bold">
              Ready to experience House Of Karma?
            </h3>
            <p className="text-white/70 text-sm max-w-xl">
              Book direct on our platform for best prices, priority bed selection, and direct WhatsApp arrival coordination.
            </p>
          </div>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-[#1C6EA8] hover:bg-[#2384CE] text-white font-medium px-8 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg text-sm shrink-0"
          >
            <span>Explore Dates & Beds</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}

