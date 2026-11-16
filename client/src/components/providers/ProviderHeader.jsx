import { BadgeCheck, Briefcase, MessageSquare, User } from "lucide-react";
import ProviderRating from "./ProviderRating";

const ProviderHeader = ({
  provider,
  reviewCount,
  averageRating,
  reviewsLoading,
  reviewsError,
}) => {
  return (
    <section className="relative overflow-hidden rounded-4xl border border-white/70 bg-white/80 shadow-[0_8px_40px_rgba(203,189,255,0.18)] backdrop-blur-2xl">
      <div className="relative h-36 overflow-hidden bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] sm:h-44">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-white/30 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-12 right-12 h-48 w-48 rounded-full bg-white/30 blur-2xl"
        />
      </div>

      <div className="px-5 pb-6 sm:px-8 sm:pb-8">
        <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:pt-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
            <div className="relative -mt-16 flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-white/90 bg-linear-to-br from-[#f6ebff] to-[#ebf6ff] shadow-[0_8px_25px_rgba(203,189,255,0.3)] sm:-mt-20 sm:h-28 sm:w-28">
              {provider.profileImage ? (
                <img
                  src={provider.profileImage}
                  alt={provider.businessName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-11 w-11 text-[#8b7cc8]" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {provider.businessName}
              </h1>

              {provider.userId?.name && (
                <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">
                  Managed by{" "}
                  <span className="font-bold text-slate-700">
                    {provider.userId.name}
                  </span>
                </p>
              )}
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-emerald-200/80 bg-emerald-50/85 px-3.5 py-2 text-xs font-bold text-emerald-800 shadow-xs backdrop-blur-md sm:self-center">
            <BadgeCheck className="h-4 w-4 text-emerald-600" />
            <span>Verified Provider</span>
          </span>
        </div>{" "}
        {/* Provider Summary Metrics */}
        <div className="mt-8 grid grid-cols-1 gap-4 border-t border-[#bfcaff]/30 pt-6 sm:grid-cols-3">
          {/* Experience */}
          <div className="rounded-2xl border border-[#bfcaff]/40 bg-white/65 p-4 shadow-xs backdrop-blur-md">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Experience
            </p>

            <div className="mt-2 inline-flex items-center gap-2.5 rounded-2xl border border-white/70 bg-linear-to-r from-[#e4a5ff]/15 via-[#cbbdff]/15 to-[#acdcff]/15 px-4 py-2.5 shadow-[0_4px_20px_rgba(203,189,255,0.15)] backdrop-blur-xl">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#e4a5ff]/25 text-[#8b5cf6] ring-1 ring-inset ring-[#deabff]/60">
                <Briefcase className="h-4 w-4" />
              </div>

              <span className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                {provider.experienceYears != null
                  ? `${provider.experienceYears} ${provider.experienceYears === 1 ? "year" : "years"}`
                  : "Not specified"}
              </span>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="rounded-2xl border border-[#bfcaff]/40 bg-white/65 p-4 shadow-xs backdrop-blur-md">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Customer Reviews
            </p>

            <div className="mt-2 inline-flex items-center gap-2.5 rounded-2xl border border-white/70 bg-linear-to-r from-[#e4a5ff]/15 via-[#cbbdff]/15 to-[#acdcff]/15 px-4 py-2.5 shadow-[0_4px_20px_rgba(203,189,255,0.15)] backdrop-blur-xl">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#acdcff]/30 text-[#3b82f6] ring-1 ring-inset ring-[#b2d6ff]/70">
                <MessageSquare className="h-4 w-4" />
              </div>

              <span className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                {reviewsLoading
                  ? "Loading..."
                  : reviewsError
                    ? "Unavailable"
                    : reviewCount}
              </span>
            </div>
          </div>

          {/* Average Rating */}
          <div className="rounded-2xl border border-[#bfcaff]/40 bg-white/65 p-4 shadow-xs backdrop-blur-md">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Average Rating
            </p>

            <ProviderRating
              averageRating={averageRating}
              reviewCount={reviewCount}
              loading={reviewsLoading}
              error={reviewsError}
            />
          </div>
        </div>{" "}
      </div>
    </section>
  );
};

export default ProviderHeader;
