import { MessageSquareOff } from "lucide-react";
import ReviewCard from "./ReviewCard";

const ReviewList = ({ reviews = [] }) => {
  if (reviews.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-8 text-center shadow-[0_8px_30px_rgba(203,189,255,0.14)] backdrop-blur-2xl sm:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full bg-[#e4a5ff]/20 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-[#acdcff]/25 blur-2xl"
        />

        <div className="relative z-10 mx-auto flex max-w-md flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-slate-700 ring-1 ring-inset ring-[#deabff]/60">
            <MessageSquareOff className="h-5 w-5" />
          </div>

          <h3 className="mt-4 text-base font-extrabold text-slate-900">
            No Reviews Yet
          </h3>

          <p className="mt-1.5 text-sm font-medium leading-relaxed text-slate-500">
            Reviews will appear here once customers complete their bookings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {reviews.map((review) => (
        <ReviewCard key={review._id} review={review} />
      ))}
    </div>
  );
};

export default ReviewList;
