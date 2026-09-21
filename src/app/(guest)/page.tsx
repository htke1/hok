import Hero from '@/components/home/Hero';
import TrustBadges from '@/components/home/TrustBadges';
import RoomCards from '@/components/home/RoomCards';
import ArchitectureStory from '@/components/home/ArchitectureStory';
import CommunityHub from '@/components/home/CommunityHub';
import AcclimatizationGuide from '@/components/home/AcclimatizationGuide';
import LocationMap from '@/components/home/LocationMap';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBadges />
      <RoomCards />
      <ArchitectureStory />
      <CommunityHub />
      <AcclimatizationGuide />
      <LocationMap />
    </>
  );
}
