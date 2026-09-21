import { ExternalLink } from 'lucide-react';

export default function LocationMap() {
  return (
    <section id="location" className="py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="font-heading text-4xl text-timber font-bold mb-10 text-center">Find Us</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Map Embed */}
          <div className="rounded-2xl overflow-hidden shadow-lg h-[400px] w-full relative bg-sandstone-light">
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              scrolling="no" 
              marginHeight={0} 
              marginWidth={0} 
              src="https://www.openstreetmap.org/export/embed.html?bbox=77.55,34.14,77.60,34.17&layer=mapnik&marker=34.1526,77.5771"
              className="absolute inset-0"
              title="House of Karma Location Map"
            ></iframe>
          </div>
          
          {/* Right: Directions */}
          <div className="flex flex-col justify-center">
            <div className="bg-cream rounded-2xl p-8 shadow-sm">
              <h3 className="font-heading text-2xl font-bold text-charcoal mb-2">House Of Karma</h3>
              <p className="text-warm-grey mb-6 text-lg">Fort Road, Leh, Ladakh 194101</p>
              
              <a 
                href="https://maps.google.com/?q=34.1526,77.5771" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta-dark text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 mb-8"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-5 h-5" />
              </a>
              
              <div className="space-y-4">
                <h4 className="font-bold text-charcoal">How to get here</h4>
                <div className="space-y-3 text-warm-grey">
                  <p>
                    <strong className="text-charcoal block mb-1">From Leh Airport (IXL):</strong>
                    4km drive via Airport Road. Ask any taxi for Fort Road.
                  </p>
                  <p>
                    <strong className="text-charcoal block mb-1">From Bus Stand:</strong>
                    1km walk towards Fort Road, past the SBI ATM.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
