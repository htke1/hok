import Image from 'next/image';

interface BrandedLoaderProps {
  message?: string;
  submessage?: string;
  fullScreen?: boolean;
  className?: string;
}

export default function BrandedLoader({
  message = 'Loading your mountain sanctuary...',
  submessage = 'House Of Karma · Fort Road, Leh (11,500 ft)',
  fullScreen = false,
  className = '',
}: BrandedLoaderProps) {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md flex flex-col items-center justify-center p-4'
    : 'min-h-[60vh] w-full flex flex-col items-center justify-center p-6';

  return (
    <div className={`${containerClasses} ${className}`} role="status" aria-label="Loading">
      <div className="relative flex flex-col items-center text-center">
        {/* Radiating Ambient Glow */}
        <div className="absolute -inset-6 bg-[#B85C38]/15 rounded-full blur-2xl animate-pulse pointer-events-none" />

        {/* Animated Brand Emblem Box */}
        <div className="relative z-10 w-24 h-16 sm:w-28 sm:h-20 mb-6 flex items-center justify-center">
          <Image
            src="/logo-emblem.png"
            alt="House Of Karma Emblem"
            width={112}
            height={80}
            priority
            className="w-full h-auto object-contain drop-shadow-sm animate-pulse"
          />
        </div>

        {/* Brand Heading */}
        <div className="relative z-10 space-y-1.5">
          <h3 className="font-heading text-lg sm:text-xl font-bold tracking-widest text-[#1E2732] uppercase">
            HOUSE OF KARMA
          </h3>
          <p className="text-xs tracking-wider uppercase text-[#B85C38] font-semibold">
            {message}
          </p>
          {submessage && (
            <p className="text-[11px] text-warm-grey tracking-wide">
              {submessage}
            </p>
          )}
        </div>

        {/* Minimalist Progress Indicator */}
        <div className="relative z-10 w-36 h-1 bg-[#E0C097]/40 rounded-full overflow-hidden mt-6">
          <div className="h-full bg-[#B85C38] rounded-full animate-[progress_1.4s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}

