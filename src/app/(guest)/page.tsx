import Hero from '@/components/home/Hero';
import TrustBadges from '@/components/home/TrustBadges';
import RoomCards from '@/components/home/RoomCards';
import CommunityHub from '@/components/home/CommunityHub';
import AcclimatizationGuide from '@/components/home/AcclimatizationGuide';
import LocationMap from '@/components/home/LocationMap';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBadges />
      <RoomCards />
      <CommunityHub />
      <AcclimatizationGuide />
      <LocationMap />
    </>
  );
}
