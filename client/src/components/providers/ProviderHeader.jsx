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
    <section className="overflow-hidden rounded-3xl border border-[#d8e2eb] bg-white shadow-xs">
      {/* Cover Banner */}
      <div className="h-36 border-b border-[#034078] bg-[#0a1128] sm:h-44" />

      <div className="px-5 pb-6 sm:px-8 sm:pb-8">
        <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:pt-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
            <div className="relative -mt-16 flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#f4f7fa] ring-1 ring-[#d8e2eb] sm:-mt-20 sm:h-28 sm:w-28">
              {provider.profileImage ? (
                <img
                  src={provider.profileImage}
                  alt={provider.businessName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-11 w-11 text-[#034078]" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-2xl font-extrabold tracking-tight text-[#0a1128] sm:text-3xl">
                {provider.businessName}
              </h1>

              {provider.userId?.name && (
                <p className="mt-1 text-xs font-semibold text-[#64748b] sm:text-sm">
                  Managed by{" "}
                  <span className="font-bold text-[#33415c]">
                    {provider.userId.name}
                  </span>
                </p>
              )}
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 shadow-2xs sm:self-center">
            <BadgeCheck className="h-4 w-4 text-emerald-600" />
            <span>Verified Provider</span>
          </span>
        </div>

        {/* Provider Summary Metrics */}
        <div className="mt-8 grid grid-cols-1 gap-4 border-t border-[#e2e8f0] pt-6 sm:grid-cols-3">
          {/* Experience */}
          <div className="rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
              Experience
            </p>

            <div className="mt-2.5 inline-flex items-center gap-2.5 rounded-xl border border-[#d8e2eb] bg-white px-4 py-2.5 shadow-2xs">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#034078]/20 bg-[#f4f7fa] text-[#034078]">
                <Briefcase className="h-4 w-4" />
              </div>

              <span className="text-lg font-extrabold tracking-tight text-[#0a1128] sm:text-xl">
                {provider.experienceYears != null
                  ? `${provider.experienceYears} ${provider.experienceYears === 1 ? "year" : "years"}`
                  : "Not specified"}
              </span>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
              Customer Reviews
            </p>

            <div className="mt-2.5 inline-flex items-center gap-2.5 rounded-xl border border-[#d8e2eb] bg-white px-4 py-2.5 shadow-2xs">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#1282a2]/25 bg-[#1282a2]/10 text-[#1282a2]">
                <MessageSquare className="h-4 w-4" />
              </div>

              <span className="text-lg font-extrabold tracking-tight text-[#0a1128] sm:text-xl">
                {reviewsLoading
                  ? "Loading..."
                  : reviewsError
                    ? "Unavailable"
                    : reviewCount}
              </span>
            </div>
          </div>

          {/* Average Rating */}
          <div className="rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
              Average Rating
            </p>

            <ProviderRating
              averageRating={averageRating}
              reviewCount={reviewCount}
              loading={reviewsLoading}
              error={reviewsError}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProviderHeader;
