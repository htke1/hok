import { Bike, Car, FileText, Map } from 'lucide-react';

export default function CommunityHub() {
  return (
    <section id="community" className="bg-charcoal text-white py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* Left Column */}
          <div>
            <h2 className="font-heading text-4xl font-bold mb-6 text-sandstone">Life at House Of Karma</h2>
            <p className="text-white/80 mb-10 text-lg leading-relaxed">
              More than just a place to sleep. We are a collective of travelers, dreamers, and adventurers. Share stories around the fire, find your next travel buddy, and experience the true warmth of Ladakhi hospitality.
            </p>
            
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/5">
                <div className="flex items-start gap-4">
                  <span className="text-2xl" role="img" aria-label="moon">🌙</span>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Stargazing Nights</h3>
                    <p className="text-white/70 text-sm">Every clear evening on our rooftop terrace. Telescope & hot chai provided.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/5">
                <div className="flex items-start gap-4">
                  <span className="text-2xl" role="img" aria-label="fire">🔥</span>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Bonfire Evenings</h3>
                    <p className="text-white/70 text-sm">Weekly bonfire with live music, stories, and marshmallows.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/5">
                <div className="flex items-start gap-4">
                  <span className="text-2xl" role="img" aria-label="coffee">☕</span>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Karma Cafe</h3>
                    <p className="text-white/70 text-sm">Freshly brewed Ladakhi butter tea, espresso, and mountain breakfast bowls.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <h2 className="font-heading text-4xl font-bold mb-6 text-sandstone">Adventure Desk</h2>
            <p className="text-white/80 mb-10 text-lg leading-relaxed">
              Need help planning your Ladakh expedition? Our local experts at the in-house adventure desk have you covered with permits, rides, and hidden gems.
            </p>
            
            <ul className="space-y-6">
              <li className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-terracotta/20 flex items-center justify-center text-terracotta flex-shrink-0">
                  <Bike className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Royal Enfield & Himalayan Rentals</h4>
                </div>
              </li>
              <li className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-terracotta/20 flex items-center justify-center text-terracotta flex-shrink-0">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Shared Cabs to Nubra Valley & Pangong</h4>
                </div>
              </li>
              <li className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-terracotta/20 flex items-center justify-center text-terracotta flex-shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Inner Line Permit Guidance</h4>
                </div>
              </li>
              <li className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-terracotta/20 flex items-center justify-center text-terracotta flex-shrink-0">
                  <Map className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Curated Day Trip Itineraries</h4>
                </div>
              </li>
            </ul>
          </div>
          
        </div>
      </div>
    </section>
  );
}
