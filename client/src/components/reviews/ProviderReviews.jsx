import { useEffect, useState, useMemo } from "react";
import {
  Star,
  AlertCircle,
  MessageSquareHeart,
  Filter,
  Sparkles,
} from "lucide-react";
import { getProviderReviews } from "../../services/review.api";
import { getMyProviderProfile } from "../../services/provider.api";
import ProviderRating from "../../components/providers/ProviderRating";
import ReviewList from "../../components/reviews/ReviewList";

const ProviderReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStar, setSelectedStar] = useState("all");

  useEffect(() => {
    let active = true;

    const loadMyReviews = async () => {
      setLoading(true);
      setError("");

      try {
        const profileRes = await getMyProviderProfile();
        const providerId = profileRes.data.data.provider._id;

        const reviewsRes = await getProviderReviews(providerId);

        if (active) {
          const result = reviewsRes.data.data;
          setReviews(Array.isArray(result?.reviews) ? result.reviews : []);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load your customer reviews.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadMyReviews();

    return () => {
      active = false;
    };
  }, []);

  // Calculate average rating
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return null;
    const sum = reviews.reduce(
      (total, review) => total + Number(review.rating || 0),
      0,
    );
    return sum / reviews.length;
  }, [reviews]);

  // Calculate star breakdown counts (5 down to 1)
  const ratingCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.round(Number(r.rating));
      if (counts[star] !== undefined) counts[star] += 1;
    });
    return counts;
  }, [reviews]);

  // Filter reviews by selected star
  const filteredReviews = useMemo(() => {
    if (selectedStar === "all") return reviews;
    return reviews.filter(
      (r) => Math.round(Number(r.rating)) === Number(selectedStar),
    );
  }, [reviews, selectedStar]);

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#d8e2eb] bg-white px-3.5 py-1 text-xs font-bold text-[#034078] shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-[#1282a2]" />
              <span>Reputation &amp; Feedback</span>
            </div>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[#0a1128] sm:text-3xl">
              Customer Reviews
            </h1>
            <p className="mt-1.5 text-sm font-medium text-[#33415c]">
              Track your service ratings and read feedback left by your
              customers.
            </p>
          </div>
        </div>

        {/* Rating Overview Card */}
        <section className="mb-8 rounded-3xl border border-[#d8e2eb] bg-white p-6 shadow-xs sm:p-8">
          <div className="grid gap-8 md:grid-cols-3 md:items-center">
            {/* Overall Score */}
            <div className="border-b border-[#e2e8f0] pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
                Overall Rating
              </p>
              <div className="mt-3">
                <ProviderRating
                  averageRating={averageRating}
                  reviewCount={reviews.length}
                  loading={loading}
                  error={error}
                />
              </div>
            </div>

            {/* Star Distribution Bars */}
            <div className="space-y-2 md:col-span-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingCounts[star];
                const percentage =
                  reviews.length > 0
                    ? Math.round((count / reviews.length) * 100)
                    : 0;
                const isSelected = selectedStar === star;

                return (
                  <button
                    key={star}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() =>
                      setSelectedStar((prev) => (prev === star ? "all" : star))
                    }
                    className={`group flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm transition-colors ${
                      isSelected
                        ? "border-[#034078]/25 bg-[#f4f7fa] font-extrabold text-[#034078]"
                        : "border-transparent font-semibold text-[#33415c] hover:border-[#d8e2eb] hover:bg-[#f8fafc] hover:text-[#0a1128]"
                    }`}
                  >
                    <span className="inline-flex w-12 shrink-0 items-center gap-1 text-left text-xs font-bold sm:text-sm">
                      <span>{star}</span>
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                    </span>

                    <div className="h-2.5 flex-1 overflow-hidden rounded-full border border-[#d8e2eb] bg-[#f4f7fa]">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isSelected ? "bg-[#034078]" : "bg-[#1282a2]"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <span className="w-10 shrink-0 text-right text-xs font-bold text-[#64748b]">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Reviews List Section */}
        <section className="rounded-3xl border border-[#d8e2eb] bg-white p-6 shadow-xs sm:p-8">
          {/* Filter Header & Pills */}
          <div className="mb-6 flex flex-col gap-4 border-b border-[#e2e8f0] pb-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#1282a2]" />
              <h2 className="text-base font-extrabold tracking-tight text-[#0a1128] sm:text-lg">
                {selectedStar === "all"
                  ? `All Reviews (${reviews.length})`
                  : `${selectedStar}-Star Reviews (${filteredReviews.length})`}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {["all", 5, 4, 3, 2, 1].map((filter) => {
                const isActive = selectedStar === filter;

                return (
                  <button
                    key={filter}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setSelectedStar(filter)}
                    className={`inline-flex cursor-pointer items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                      isActive
                        ? "bg-[#034078] text-white shadow-2xs hover:bg-[#001f54]"
                        : "border border-[#cbd5e1] bg-[#f8fafc] text-[#33415c] hover:border-[#1282a2] hover:bg-[#f4f7fa] hover:text-[#0a1128]"
                    }`}
                  >
                    {filter === "all" ? (
                      <span>All</span>
                    ) : (
                      <>
                        <span>{filter}</span>
                        <Star
                          className={`h-3 w-3 ${
                            isActive
                              ? "fill-amber-300 text-amber-300"
                              : "fill-amber-400 text-amber-500"
                          }`}
                        />
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* States */}
          {loading ? (
            <div role="status" className="space-y-4 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-32 rounded-2xl border border-[#d8e2eb] bg-[#f8fafc]"
                />
              ))}
              <span className="sr-only">Loading your reviews...</span>
            </div>
          ) : error ? (
            <div
              role="alert"
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm font-semibold text-red-900"
            >
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span>{error}</span>
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-10 text-center sm:p-12">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d8e2eb] bg-white text-[#034078] shadow-2xs">
                <MessageSquareHeart className="h-6 w-6" />
              </div>

              <h3 className="mt-4 text-base font-extrabold text-[#0a1128] sm:text-lg">
                No reviews yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-relaxed text-[#33415c]">
                Once customers complete bookings and leave feedback, their
                reviews will appear here.
              </p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-8 text-center">
              <p className="text-sm font-semibold text-[#33415c]">
                No {selectedStar}-star reviews found.
              </p>
              <button
                type="button"
                onClick={() => setSelectedStar("all")}
                className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-xl bg-[#034078] px-5 py-2.5 text-xs font-bold text-white shadow-2xs transition-colors hover:bg-[#001f54]"
              >
                Show all reviews
              </button>
            </div>
          ) : (
            <ReviewList reviews={filteredReviews} />
          )}
        </section>
      </div>
    </div>
  );
};

export default ProviderReviews;
