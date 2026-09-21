import BrandedLoader from '@/components/common/BrandedLoader';

export default function BookLoading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-off-white">
      <BrandedLoader
        message="Loading Mountain Sanctuary Bookings..."
        submessage="Live availability for dorm pods & private Himalayan rooms"
      />
    </div>
  );
}

