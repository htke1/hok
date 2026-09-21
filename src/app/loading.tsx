import BrandedLoader from '@/components/common/BrandedLoader';

export default function Loading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <BrandedLoader
        message="Loading your mountain retreat..."
        submessage="House Of Karma · Leh, Ladakh"
      />
    </div>
  );
}

