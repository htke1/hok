import { Droplets, Wifi, Flame, Zap, Heart } from 'lucide-react';

const badges = [
  {
    icon: Droplets,
    title: '24/7 Hot Water',
    subtitle: 'Solar panels + heavy geyser backup for freezing Leh mornings',
  },
  {
    icon: Wifi,
    title: 'High-Speed Wi-Fi',
    subtitle: 'Starlink & fiber optical connection with speed-test proof for nomads',
  },
  {
    icon: Flame,
    title: 'Room Heating',
    subtitle: 'Heated blankets and convection room heaters in every pod & private space',
  },
  {
    icon: Zap,
    title: '100% Power Backup',
    subtitle: 'Silent inverter system and heavy generator during Leh grid fluctuations',
  },
  {
    icon: Heart,
    title: 'Altitude & First-Aid',
    subtitle: 'In-house certified oxygen cylinder, pulse oximeter, and altitude care',
  },
];

export default function TrustBadges() {
  return (
    <section className="bg-white py-16 border-y border-[#1C6EA8]/10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-xs font-bold tracking-widest text-[#1C6EA8] uppercase mb-2">
            Peace of Mind at 11,500 Feet
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl text-[#1E2732] font-bold">
            High-Altitude Essentials
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div 
                key={idx} 
                className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#1C6EA8]/10 hover:border-[#1C6EA8]/35 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#EEF5FB] text-[#1C6EA8] group-hover:bg-[#1C6EA8] group-hover:text-white flex items-center justify-center mb-4 transition-colors duration-300 shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#1E2732] text-base mb-2">{badge.title}</h3>
                <p className="text-xs text-slate leading-relaxed">{badge.subtitle}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
