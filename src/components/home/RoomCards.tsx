import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';

const rooms = [
  {
    id: 'mixed-dorm',
    slug: 'dorm-pod-mixed',
    name: 'Mixed Dorm Pod (8-Bed)',
    type: 'DORM POD',
    description: 'Sturdy wooden pod bunks with navy privacy curtains, individual reading light, power socket, and under-bed lockable luggage storage.',
    price: 599,
    image: '/images/rooms/dorm-pod-mixed.jpg',
    badge: 'Backpacker Favorite',
    amenities: ['Navy Privacy Curtains', 'Reading Light', 'Personal Lockbox', 'Heated Common Bath', 'Starlink Wi-Fi']
  },
  {
    id: 'female-dorm',
    slug: 'dorm-pod-female',
    name: 'Female Dorm Pod (6-Bed)',
    type: 'FEMALE POD',
    description: 'Dedicated female-friendly floor with carpeted flooring, enclosed bunk pods, personal lockers, warm blankets, and ensuite washroom.',
    price: 699,
    image: '/images/rooms/dorm-pod-female.jpg',
    badge: 'Female Solo Travelers',
    amenities: ['Female Floor', 'Navy Privacy Curtains', 'Under-bed Drawers', 'Ensuite Heated Bath', 'Starlink Wi-Fi']
  },
  {
    id: 'private-standard',
    slug: 'private-standard',
    name: 'Private Himalayan Room',
    type: 'PRIVATE ENSUITE',
    description: 'Boutique king room featuring authentic Ladakhi willow stalk (talu) ceiling, exposed pine beams, plush duvet, and heated ensuite bath.',
    price: 2499,
    image: '/images/rooms/private-standard.jpg',
    badge: 'Couples & Nomads',
    amenities: ['Willow Stalk Ceiling', 'Ensuite Heated Bath', 'Mountain View', 'Room Heater', 'Electric Kettle']
  },
  {
    id: 'private-deluxe',
    slug: 'private-deluxe',
    name: 'Deluxe Balcony Room',
    type: 'PRIVATE BALCONY',
    description: 'Upper-deck room opening directly onto a scenic open veranda with artificial turf, azure woodwork, and panoramic Leh mountain views.',
    price: 3499,
    image: '/images/rooms/private-deluxe.jpg',
    badge: 'Panoramic Views',
    amenities: ['Veranda Balcony', 'Valley View', 'Ensuite Heated Bath', 'Room Heater', 'Tea Maker']
  }
];

export default function RoomCards() {
  return (
    <section id="rooms" className="py-24 px-4 bg-[#FAF7F2]">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#EEF5FB] text-[#114269] text-xs font-semibold uppercase tracking-widest px-3.5 py-1 rounded-full border border-[#1C6EA8]/20 mb-3">
            <span>Boutique Mountain Stays</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl text-[#1E2732] font-bold mb-4 tracking-tight">
            Where You&apos;ll Stay
          </h2>
          <p className="text-slate text-base">
            Thoughtfully designed for deep rest after high-altitude passes. Clean, warm, minimalist, and grounded in authentic Ladakhi character.
          </p>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {rooms.map((room) => (
            <div 
              key={room.id} 
              className="bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_-10px_rgba(17,66,105,0.08)] border border-[#1C6EA8]/15 hover:border-[#1C6EA8]/40 hover:shadow-[0_20px_40px_-15px_rgba(17,66,105,0.15)] transition-all duration-300 flex flex-col group"
            >
              {/* Image Area with Real Property Photos */}
              <div className="h-64 sm:h-72 relative overflow-hidden bg-[#152535]">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                
                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                  <span className="bg-[#1C6EA8] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {room.type}
                  </span>
                  <span className="bg-white/90 backdrop-blur-md text-[#1E2732] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    {room.badge}
                  </span>
                </div>
              </div>
              
              {/* Card Body */}
              <div className="p-6 sm:p-8 flex flex-col flex-grow">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="font-heading text-2xl text-[#1E2732] font-bold group-hover:text-[#1C6EA8] transition-colors">
                    {room.name}
                  </h3>
                </div>
                <p className="text-slate text-sm mb-6 leading-relaxed flex-grow">
                  {room.description}
                </p>
                
                {/* Amenity Pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {room.amenities.map((amenity, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center gap-1.5 bg-[#EEF5FB] text-[#114269] text-xs px-3 py-1 rounded-full font-medium border border-[#1C6EA8]/15"
                    >
                      <Check size={12} className="text-[#1C6EA8]" />
                      <span>{amenity}</span>
                    </span>
                  ))}
                </div>
                
                {/* Divider */}
                <hr className="border-[#FAF7F2] mb-6" />
                
                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-1">
                  <div>
                    <span className="text-xs text-warm-grey uppercase tracking-wider block">Starting From</span>
                    <span className="font-heading text-3xl text-[#B85C38] font-bold">₹{room.price}</span>
                    <span className="text-slate text-xs ml-1">/ night</span>
                  </div>
                  <Link 
                    href={`/book?room=${room.slug}`}
                    className="inline-flex items-center gap-2 bg-[#1C6EA8] hover:bg-[#114269] text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                  >
                    <span>Reserve</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
