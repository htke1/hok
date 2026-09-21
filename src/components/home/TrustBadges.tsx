import { Droplets, Wifi, Flame, Zap, Heart } from 'lucide-react';

const badges = [
  {
    icon: Droplets,
    title: '24/7 Hot Water',
    subtitle: 'Solar + Geyser Backup',
  },
  {
    icon: Wifi,
    title: 'High-Speed Wi-Fi',
    subtitle: 'Starlink / Fiber Optic',
  },
  {
    icon: Flame,
    title: 'Room Heating',
    subtitle: 'Heated Blankets',
  },
  {
    icon: Zap,
    title: 'Power Backup',
    subtitle: 'Inverter + Generator',
  },
  {
    icon: Heart,
    title: 'Oxygen & First-Aid',
    subtitle: 'In-house Emergency Kit',
  },
];

export default function TrustBadges() {
  return (
    <section className="bg-cream py-12">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-center text-timber font-bold tracking-widest text-sm uppercase mb-10">
          High-Altitude Essentials
        </h2>
        
        <div className="flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible gap-6 pb-4 md:pb-0 justify-start md:justify-center items-start scrollbar-hide">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center min-w-[140px] flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-terracotta flex items-center justify-center text-white mb-4 shadow-md">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-charcoal mb-1">{badge.title}</h3>
                <p className="text-sm text-warm-grey">{badge.subtitle}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
