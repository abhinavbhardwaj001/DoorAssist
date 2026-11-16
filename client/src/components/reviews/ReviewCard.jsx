import { Star, Calendar } from "lucide-react";

const ReviewCard = ({ review }) => {
  const rating = Math.max(0, Math.min(5, Number(review.rating) || 0));

  const filledStars = Math.floor(rating);

  const reviewerName =
    review.customerId?.name ||
    review.customerId?.fullName ||
    "DoorAssist Customer";

  const initial = reviewerName.charAt(0).toUpperCase();

  return (
    <article className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_8px_30px_rgba(203,189,255,0.14)] backdrop-blur-2xl transition-all hover:border-[#deabff]/60 hover:shadow-[0_10px_35px_rgba(203,189,255,0.22)] sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#e4a5ff]/15 blur-2xl"
      />

      <div className="relative z-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          {/* Reviewer Info & Star Rating */}
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#e4a5ff]/40 via-[#cbbdff]/40 to-[#acdcff]/40 text-sm font-extrabold text-slate-900 ring-1 ring-inset ring-[#deabff]/50">
              {initial}
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-slate-900 sm:text-base">
                {reviewerName}
              </h3>

              <div
                className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-amber-200/70 bg-amber-50/75 px-2.5 py-1"
                aria-label={`${rating} out of 5 stars`}
              >
                {Array.from({ length: 5 }, (_, index) => {
                  const isFilled = index < filledStars;
                  return (
                    <Star
                      key={index}
                      className={`h-3.5 w-3.5 ${
                        isFilled
                          ? "fill-amber-400 text-amber-500"
                          : "fill-slate-200/70 text-slate-300"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Review Date */}
          {review.createdAt && (
            <time
              dateTime={new Date(review.createdAt).toISOString()}
              className="inline-flex items-center gap-1.5 self-start rounded-full border border-[#bfcaff]/40 bg-white/65 px-3 py-1 text-xs font-semibold text-slate-500"
            >
              <Calendar className="h-3 w-3 text-[#9687c7]" />
              <span>
                {new Date(review.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </time>
          )}
        </div>

        {/* Review Comment */}
        {review.comment && (
          <p className="mt-4 whitespace-pre-line rounded-2xl border border-[#bfcaff]/30 bg-white/60 p-4 text-sm font-medium leading-relaxed text-slate-700">
            {review.comment}
          </p>
        )}
      </div>
    </article>
  );
};

export default ReviewCard;
