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
        className="relative overflow-hidden rounded-4xl border border-emerald-200/80 bg-emerald-50/80 p-6 shadow-[0_8px_30px_rgba(16,185,129,0.12)] backdrop-blur-2xl sm:p-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 ring-1 ring-inset ring-emerald-200/80">
            <CheckCircle2 className="h-6 w-6" />
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-emerald-900 sm:text-xl">
              {submitted
                ? "Review Submitted Successfully!"
                : "Already Reviewed"}
            </h3>

            <p className="mt-1 text-sm font-medium leading-relaxed text-emerald-700">
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
    <section className="relative overflow-hidden rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_8px_40px_rgba(203,189,255,0.18)] backdrop-blur-2xl sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#e4a5ff]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#acdcff]/25 blur-3xl"
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-slate-800 ring-1 ring-inset ring-[#deabff]/60">
            <MessageSquarePlus className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
              Rate Your Experience
            </h2>
            <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500 sm:text-sm">
              Your service is completed. Share your experience to help other
              customers choose a provider.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          {/* Interactive Star Rating Selector */}
          <fieldset className="rounded-2xl border border-[#bfcaff]/40 bg-linear-to-r from-[#e4a5ff]/10 via-[#cbbdff]/10 to-[#acdcff]/10 p-4 sm:p-5">
            <legend className="px-1 text-xs font-bold uppercase tracking-wider text-slate-600">
              Your Rating <span className="text-rose-500">*</span>
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
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-150 hover:scale-105 active:scale-95 ${
                        isActive
                          ? "border-amber-300/80 bg-amber-50/90 shadow-xs"
                          : "border-[#bfcaff]/40 bg-white/75 hover:border-[#deabff]"
                      }`}
                    >
                      <Star
                        className={`h-5 w-5 transition-colors ${
                          isActive
                            ? "fill-amber-400 text-amber-500"
                            : "fill-slate-100 text-slate-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <span className="rounded-full border border-[#bfcaff]/40 bg-white/75 px-3.5 py-1.5 text-xs font-bold text-slate-700">
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
                className="text-xs font-bold uppercase tracking-wider text-slate-600"
              >
                Your Review (Optional)
              </label>

              <span className="text-xs font-semibold text-slate-400">
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
              className="mt-2.5 w-full rounded-2xl border border-[#bfcaff]/50 bg-white/75 p-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 shadow-xs backdrop-blur-md transition-all outline-none focus:border-[#a575bf] focus:bg-white focus:ring-4 focus:ring-[#cbbdff]/30"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-7 py-3.5 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:scale-[1.01] hover:brightness-105 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-55 sm:w-auto"
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
      </div>
    </section>
  );
};

export default ReviewForm;
