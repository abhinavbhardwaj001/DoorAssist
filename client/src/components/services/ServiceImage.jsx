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
    <div className="relative h-48 overflow-hidden bg-[#f4f7fa]">
      {showFallback ? (
        <div
          role="img"
          aria-label={alt}
          className="flex h-full w-full items-center justify-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d8e2eb] bg-white text-[#034078] shadow-2xs">
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
