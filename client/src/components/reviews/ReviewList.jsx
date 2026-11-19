import { MessageSquareOff } from "lucide-react";
import ReviewCard from "./ReviewCard";

const ReviewList = ({ reviews = [] }) => {
  if (reviews.length === 0) {
    return (
      <div className="rounded-3xl border border-[#d8e2eb] bg-white p-8 text-center shadow-xs sm:p-10">
        <div className="mx-auto flex max-w-md flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]">
            <MessageSquareOff className="h-5 w-5" />
          </div>

          <h3 className="mt-4 text-base font-extrabold tracking-tight text-[#0a1128]">
            No Reviews Yet
          </h3>

          <p className="mt-1.5 text-sm font-medium leading-relaxed text-[#33415c]">
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
