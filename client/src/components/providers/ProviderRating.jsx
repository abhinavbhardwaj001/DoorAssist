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
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50/80 px-2.5 py-1 text-xs font-bold text-amber-800 shadow-xs backdrop-blur-md">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
        <span>{averageRating.toFixed(1)}</span>
        <span className="font-semibold text-amber-700/80">({reviewCount})</span>
      </span>
    );
  }

  if (loading) {
    return (
      <div className="mt-2 inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white/70 px-4 py-2.5 backdrop-blur-xl">
        <div className="h-4 w-4 animate-pulse rounded-full bg-[#cbbdff]/60" />
        <div className="h-4 w-24 animate-pulse rounded-lg bg-slate-200/80" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-2 inline-flex items-center gap-2 rounded-2xl border border-red-200/80 bg-red-50/80 px-4 py-2 text-xs font-bold text-red-700 backdrop-blur-md sm:text-sm">
        <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
        <span>Unavailable</span>
      </div>
    );
  }

  if (averageRating == null) {
    return (
      <div className="mt-2 inline-flex items-center gap-2 rounded-2xl border border-[#bfcaff]/40 bg-white/70 px-4 py-2 text-xs font-semibold text-slate-500 backdrop-blur-xl sm:text-sm">
        <Star className="h-4 w-4 text-slate-400" />
        <span>No ratings yet</span>
      </div>
    );
  }

  return (
    <div className="mt-2 inline-flex flex-wrap items-center gap-2.5 rounded-2xl border border-white/70 bg-linear-to-r from-[#e4a5ff]/15 via-[#cbbdff]/15 to-[#acdcff]/15 px-4 py-2.5 shadow-[0_4px_20px_rgba(203,189,255,0.15)] backdrop-blur-xl">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100/90 text-amber-600 ring-1 ring-inset ring-amber-200/80">
        <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
          {averageRating.toFixed(1)}
        </span>
        <span className="text-xs font-bold text-slate-500 sm:text-sm">/ 5</span>
        {reviewCount > 0 && (
          <span className="ml-1 text-xs font-semibold text-slate-500">
            ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
          </span>
        )}
      </div>
    </div>
  );
};

export default ProviderRating;
