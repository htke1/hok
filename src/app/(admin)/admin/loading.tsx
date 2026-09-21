import BrandedLoader from '@/components/common/BrandedLoader';

export default function AdminLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <BrandedLoader
        message="Loading admin dashboard..."
        submessage="House Of Karma Management Portal"
      />
    </div>
  );
}

