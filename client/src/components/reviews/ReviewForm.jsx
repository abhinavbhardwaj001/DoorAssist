import { useState } from "react";
import {
  Star,
  CheckCircle2,
  Send,
  Loader2,
  MessageSquarePlus,
} from "lucide-react";
import { createReview } from "../../services/review.api";
import { useNotification } from "../../context/NotificationContext";

const ReviewForm = ({ bookingId }) => {
  const { showNotification } = useNotification();

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting || submitted || alreadyReviewed) return;

    if (rating < 1 || rating > 5) {
      showNotification(
        "Please select a rating between 1 and 5 stars.",
        "error",
      );
      return;
    }

    setSubmitting(true);

    try {
      await createReview({
        bookingId,
        rating: Number(rating),
        comment: comment.trim(),
      });

      setSubmitted(true);
      showNotification("Review submitted successfully!", "success");
    } catch (err) {
      if (err.response?.status === 409) {
        setAlreadyReviewed(true);
        showNotification("You have already reviewed this booking.", "info");
      } else {
        showNotification(
          err.response?.data?.message ||
            "Unable to submit review. Please try again.",
          "error",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted || alreadyReviewed) {
    return (
      <div
        role="status"
        className="rounded-3xl border border-emerald-200 border-l-4 border-l-emerald-600 bg-emerald-50 p-6 shadow-xs sm:p-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-200 bg-white text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>

          <div>
            <h3 className="text-lg font-extrabold tracking-tight text-emerald-950 sm:text-xl">
              {submitted
                ? "Review Submitted Successfully!"
                : "Already Reviewed"}
            </h3>

            <p className="mt-1 text-sm font-medium leading-relaxed text-emerald-800">
              {submitted
                ? "Thank you for sharing your experience with this provider."
                : "You have already submitted a review for this booking."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-[#d8e2eb] bg-white p-6 shadow-xs sm:p-8">
      {/* Header */}
      <div className="flex items-start gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]">
          <MessageSquarePlus className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-[#0a1128] sm:text-xl">
            Rate Your Experience
          </h2>
          <p className="mt-1 text-xs font-medium leading-relaxed text-[#33415c] sm:text-sm">
            Your service is completed. Share your experience to help other
            customers choose a provider.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        {/* Interactive Star Rating Selector */}
        <fieldset className="rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-4 sm:p-5">
          <legend className="px-1 text-xs font-bold uppercase tracking-wider text-[#64748b]">
            Your Rating <span className="text-red-600">*</span>
          </legend>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = star <= (hoveredRating || rating);

                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onFocus={() => setHoveredRating(star)}
                    onBlur={() => setHoveredRating(0)}
                    aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
                    aria-pressed={rating === star}
                    className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border transition-colors ${
                      isActive
                        ? "border-amber-300 bg-amber-50 shadow-2xs"
                        : "border-[#cbd5e1] bg-white hover:border-[#1282a2]"
                    }`}
                  >
                    <Star
                      className={`h-5 w-5 transition-colors ${
                        isActive
                          ? "fill-amber-400 text-amber-500"
                          : "fill-[#f1f5f9] text-[#94a3b8]"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <span className="rounded-full border border-[#d8e2eb] bg-white px-3.5 py-1.5 text-xs font-bold text-[#0a1128] shadow-2xs">
              {rating
                ? `${rating} out of 5 stars selected`
                : "Select your rating"}
            </span>
          </div>
        </fieldset>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <label
              htmlFor="reviewComment"
              className="text-xs font-bold uppercase tracking-wider text-[#64748b]"
            >
              Your Review (Optional)
            </label>

            <span className="text-xs font-semibold text-[#64748b]">
              {comment.length}/1000
            </span>
          </div>

          <textarea
            id="reviewComment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience..."
            rows={5}
            maxLength={1000}
            className="mt-2.5 w-full rounded-2xl border border-[#cbd5e1] bg-white p-4 text-sm font-medium text-[#0a1128] placeholder:text-[#64748b] shadow-2xs transition-colors outline-none focus:border-[#1282a2] focus:ring-3 focus:ring-[#1282a2]/20"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || rating === 0}
          className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#034078] px-7 py-3.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#001f54] disabled:pointer-events-none disabled:opacity-55 sm:w-auto"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Submit Review</span>
            </>
          )}
        </button>
      </form>
    </section>
  );
};

export default ReviewForm;
