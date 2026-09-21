import Link from 'next/link';

const rooms = [
  {
    id: 'mixed-dorm',
    slug: 'dorm-pod-mixed',
    name: 'Mixed Dorm Pod',
    type: 'DORM',
    description: '8-bed mixed dormitory with personal privacy and essential comforts.',
    price: 599,
    amenities: ['Privacy Curtains', 'Reading Light', 'Personal Lockbox', 'Shared Bath', 'Free Wi-Fi']
  },
  {
    id: 'female-dorm',
    slug: 'dorm-pod-female',
    name: 'Female Dorm Pod',
    type: 'DORM',
    description: '6-bed female-only dormitory designed for safety and comfort.',
    price: 699,
    amenities: ['Privacy Curtains', 'Reading Light', 'Personal Lockbox', 'Female Only', 'Free Wi-Fi']
  },
  {
    id: 'private-standard',
    slug: 'private-standard',
    name: 'Private Standard',
    type: 'PRIVATE',
    description: 'Cozy private room for 2 guests with stunning mountain views.',
    price: 2499,
    amenities: ['Ensuite Bath', 'Mountain View', 'Work Desk', 'Room Heater', 'Tea Maker']
  },
  {
    id: 'private-deluxe',
    slug: 'private-deluxe',
    name: 'Private Deluxe',
    type: 'PRIVATE',
    description: 'Spacious deluxe room for 2 guests featuring a private balcony.',
    price: 3499,
    amenities: ['Ensuite Bath', 'Balcony', 'Valley View', 'Premium Bedding', 'Tea Maker']
  }
];

export default function RoomCards() {
  return (
    <section id="rooms" className="py-20 px-4 bg-off-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl text-timber font-bold mb-3">Where You'll Stay</h2>
          <p className="text-warm-grey">Choose your perfect mountain retreat</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
              {/* Image Placeholder Area */}
              <div className="h-64 bg-gradient-to-br from-sandstone to-timber relative flex items-center justify-center">
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-charcoal text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {room.type}
                </span>
                <span className="text-white/50 font-medium">Room Image Placeholder</span>
              </div>
              
              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-heading text-2xl text-charcoal font-bold mb-2">{room.name}</h3>
                <p className="text-warm-grey mb-4 flex-grow">{room.description}</p>
                
                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {room.amenities.map((amenity, idx) => (
                    <span key={idx} className="bg-sandstone/30 text-timber text-xs px-3 py-1 rounded-full font-medium">
                      {amenity}
                    </span>
                  ))}
                </div>
                
                <hr className="border-sandstone-light mb-6" />
                
                {/* Footer */}
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <span className="font-heading text-2xl text-terracotta font-bold">₹{room.price}</span>
                    <span className="text-warm-grey text-sm">/night</span>
                  </div>
                  <Link 
                    href={`/book?room=${room.slug}`}
                    className="border-2 border-terracotta text-terracotta hover:bg-terracotta hover:text-white transition-colors duration-200 font-semibold py-2 px-6 rounded-lg"
                  >
                    Book Now
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
