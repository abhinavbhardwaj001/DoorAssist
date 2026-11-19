import { Star, AlertCircle } from "lucide-react";

const ProviderRating = ({
  averageRating,
  reviewCount = 0,
  loading = false,
  error = "",
  compact = false,
}) => {
  if (compact) {
    if (loading || error || averageRating == null) {
      return null;
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 shadow-2xs">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
        <span>{averageRating.toFixed(1)}</span>
        <span className="font-semibold text-amber-700">({reviewCount})</span>
      </span>
    );
  }

  if (loading) {
    return (
      <div className="mt-2.5 inline-flex items-center gap-2.5 rounded-xl border border-[#d8e2eb] bg-white px-4 py-2.5 shadow-2xs">
        <div className="h-4 w-4 animate-pulse rounded-full bg-[#1282a2]/25" />
        <div className="h-4 w-24 animate-pulse rounded-md bg-[#e2e8f0]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-2.5 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-700 shadow-2xs sm:text-sm">
        <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
        <span>Unavailable</span>
      </div>
    );
  }

  if (averageRating == null) {
    return (
      <div className="mt-2.5 inline-flex items-center gap-2 rounded-xl border border-[#d8e2eb] bg-white px-4 py-2.5 text-xs font-semibold text-[#64748b] shadow-2xs sm:text-sm">
        <Star className="h-4 w-4 text-[#94a3b8]" />
        <span>No ratings yet</span>
      </div>
    );
  }

  return (
    <div className="mt-2.5 inline-flex flex-wrap items-center gap-2.5 rounded-xl border border-[#d8e2eb] bg-white px-4 py-2.5 shadow-2xs">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-600">
        <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-lg font-extrabold tracking-tight text-[#0a1128] sm:text-xl">
          {averageRating.toFixed(1)}
        </span>
        <span className="text-xs font-bold text-[#64748b] sm:text-sm">/ 5</span>
        {reviewCount > 0 && (
          <span className="ml-1 text-xs font-semibold text-[#33415c]">
            ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
          </span>
        )}
      </div>
    </div>
  );
};

export default ProviderRating;
