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
    <article className="rounded-3xl border border-[#d8e2eb] bg-white p-5 shadow-xs transition-colors hover:border-[#1282a2] sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        {/* Reviewer Info & Star Rating */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#034078] text-sm font-extrabold text-white">
            {initial}
          </div>

          <div>
            <h3 className="text-sm font-extrabold tracking-tight text-[#0a1128] sm:text-base">
              {reviewerName}
            </h3>

            <div
              className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1"
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
                        : "fill-[#e2e8f0] text-[#cbd5e1]"
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
            className="inline-flex items-center gap-1.5 self-start rounded-full border border-[#d8e2eb] bg-[#f8fafc] px-3 py-1 text-xs font-semibold text-[#64748b]"
          >
            <Calendar className="h-3 w-3 text-[#1282a2]" />
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
        <p className="mt-4 whitespace-pre-line rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-4 text-sm font-medium leading-relaxed text-[#33415c]">
          {review.comment}
        </p>
      )}
    </article>
  );
};

export default ReviewCard;
