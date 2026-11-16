import { useState } from "react";
import { Wrench } from "lucide-react";

const ServiceImage = ({
  src,
  alt = "Service",
  className = "h-full w-full object-cover",
}) => {
  const [failedSrc, setFailedSrc] = useState(null);

  const showFallback = !src || failedSrc === src;

  return (
    <div className="relative h-48 overflow-hidden bg-linear-to-br from-[#f6ebff] via-[#f4f1ff] to-[#ebf6ff]">
      {showFallback ? (
        <div
          role="img"
          aria-label={alt}
          className="relative flex h-full w-full items-center justify-center"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-8 -top-8 h-28 w-28 rounded-full bg-[#e4a5ff]/25 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-[#acdcff]/30 blur-2xl"
          />

          <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/75 text-[#8b7cc8] shadow-[0_8px_25px_rgba(203,189,255,0.28)] backdrop-blur-xl">
            <Wrench className="h-6 w-6" />
          </div>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailedSrc(src)}
          className={className}
        />
      )}
    </div>
  );
};

export default ServiceImage;
