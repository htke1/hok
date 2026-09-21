import { MapPin, Plane, Mountain, Landmark } from 'lucide-react';

export default function AcclimatizationGuide() {
  return (
    <section className="bg-sandstone/20 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl text-timber font-bold mb-3">Arriving in Leh?</h2>
          <p className="text-warm-grey">Essential tips for a safe and comfortable high-altitude stay (11,500 ft)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Acclimatization Protocol */}
          <div>
            <h3 className="font-heading text-2xl font-bold text-charcoal mb-6">Acclimatization Protocol</h3>
            <div className="space-y-4">
              
              <details className="group bg-white rounded-xl shadow-sm [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between p-5 font-bold text-charcoal border-l-4 border-transparent group-open:border-terracotta transition-all">
                  First 24 Hours
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 text-warm-grey border-l-4 border-terracotta">
                  Rest at the hostel. Avoid strenuous activity. Stay hydrated with warm fluids.
                </div>
              </details>

              <details className="group bg-white rounded-xl shadow-sm [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between p-5 font-bold text-charcoal border-l-4 border-transparent group-open:border-terracotta transition-all">
                  Day 2-3
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 text-warm-grey border-l-4 border-terracotta">
                  Short walks around Leh Main Bazaar. Visit Shanti Stupa at a relaxed pace.
                </div>
              </details>

              <details className="group bg-white rounded-xl shadow-sm [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between p-5 font-bold text-charcoal border-l-4 border-transparent group-open:border-terracotta transition-all">
                  Hydration
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 text-warm-grey border-l-4 border-terracotta">
                  Drink 3-4 litres of water daily. Avoid alcohol for the first 48 hours.
                </div>
              </details>

              <details className="group bg-white rounded-xl shadow-sm [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between p-5 font-bold text-charcoal border-l-4 border-transparent group-open:border-terracotta transition-all">
                  When to Seek Help
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 text-warm-grey border-l-4 border-terracotta">
                  Persistent headache, nausea, or breathlessness? Our staff is trained in altitude sickness first aid. Oxygen cylinder available in-house.
                </div>
              </details>

            </div>
          </div>

          {/* Right: Getting Around */}
          <div>
            <h3 className="font-heading text-2xl font-bold text-charcoal mb-6">Getting Around</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 border border-sandstone/30">
                <div className="bg-sandstone-light p-3 rounded-lg text-timber">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-charcoal text-sm">Leh Main Bazaar</h4>
                  <p className="text-warm-grey text-xs">5 min walk</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 border border-sandstone/30">
                <div className="bg-sandstone-light p-3 rounded-lg text-timber">
                  <Plane className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-charcoal text-sm">Leh Airport (IXL)</h4>
                  <p className="text-warm-grey text-xs">10 min drive</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 border border-sandstone/30">
                <div className="bg-sandstone-light p-3 rounded-lg text-timber">
                  <Mountain className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-charcoal text-sm">Khardung La</h4>
                  <p className="text-warm-grey text-xs">1.5 hrs drive</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 border border-sandstone/30">
                <div className="bg-sandstone-light p-3 rounded-lg text-timber">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-charcoal text-sm">Leh Palace</h4>
                  <p className="text-warm-grey text-xs">8 min walk</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
