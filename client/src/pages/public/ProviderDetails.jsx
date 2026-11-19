import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  FileText,
  MapPin,
  MessageSquare,
  Star,
} from "lucide-react";
import { getProviderById } from "../../services/provider.api";
import { getProviderReviews } from "../../services/review.api";
import ProviderHeader from "../../components/providers/ProviderHeader";
import ProviderRating from "../../components/providers/ProviderRating";
import ReviewList from "../../components/reviews/ReviewList";
import FetchErrorBanner from "../../components/common/FetchErrorBanner";
import EmptyState from "../../components/common/EmptyState";

const ProviderDetails = () => {
  const { providerId } = useParams();

  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [error, setError] = useState("");
  const [reviewsError, setReviewsError] = useState("");

  const fetchProvider = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getProviderById(providerId);
      setProvider(response.data.data.provider);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load provider details.",
      );
    } finally {
      setLoading(false);
    }
  }, [providerId]);

  const fetchReviews = useCallback(async () => {
    setReviewsLoading(true);
    setReviewsError("");

    try {
      const response = await getProviderReviews(providerId);
      const result = response.data.data;
      setReviews(Array.isArray(result?.reviews) ? result.reviews : []);
    } catch {
      setReviewsError("Unable to load customer reviews.");
    } finally {
      setReviewsLoading(false);
    }
  }, [providerId]);

  useEffect(() => {
    fetchProvider();
    fetchReviews();
  }, [fetchProvider, fetchReviews]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (total, review) => total + Number(review.rating || 0),
          0,
        ) / reviews.length
      : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fefcfb] px-4 py-10 sm:px-6 lg:px-8">
        <div
          role="status"
          className="mx-auto max-w-6xl space-y-6 animate-pulse"
        >
          <div className="h-5 w-48 rounded bg-[#e2e8f0]" />
          <div className="h-56 rounded-3xl border border-[#d8e2eb] bg-white" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="h-64 rounded-3xl border border-[#d8e2eb] bg-white lg:col-span-2" />
            <div className="h-64 rounded-3xl border border-[#d8e2eb] bg-white" />
          </div>
          <span className="sr-only">Loading provider details...</span>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-[#fefcfb] px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-[#d8e2eb] bg-white p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-600">
            <AlertCircle className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-2xl font-extrabold text-[#0a1128]">
            Provider Unavailable
          </h1>

          <p role="alert" className="mt-3 text-sm font-medium text-[#33415c]">
            {error || "This provider could not be found."}
          </p>

          <Link
            to="/services"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#034078] px-6 py-3 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#001f54]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Explore Services</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fefcfb] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 inline-flex flex-wrap items-center gap-1.5 rounded-xl border border-[#d8e2eb] bg-white px-4 py-2 text-xs font-semibold text-[#33415c] shadow-xs sm:text-sm"
        >
          <Link to="/" className="transition-colors hover:text-[#034078]">
            Home
          </Link>

          <ChevronRight className="h-3.5 w-3.5 text-[#64748b]" />

          <Link
            to="/services"
            className="transition-colors hover:text-[#034078]"
          >
            Services
          </Link>

          <ChevronRight className="h-3.5 w-3.5 text-[#64748b]" />

          <span className="font-bold text-[#0a1128]">
            {provider.businessName}
          </span>
        </nav>

        {/* Provider Header */}
        <ProviderHeader
          provider={provider}
          reviewCount={reviews.length}
          averageRating={averageRating}
          reviewsLoading={reviewsLoading}
          reviewsError={reviewsError}
        />

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* About */}
            <section className="rounded-2xl border border-[#d8e2eb] bg-white p-6 shadow-xs sm:p-8">
              <div className="flex items-center gap-2.5 border-b border-[#e2e8f0] pb-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]">
                  <FileText className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-extrabold text-[#0a1128] sm:text-xl">
                  About the Provider
                </h2>
              </div>

              <p className="mt-5 whitespace-pre-line text-sm font-medium leading-7 text-[#33415c] sm:text-base">
                {provider.description ||
                  "This provider has not added a business description yet."}
              </p>
            </section>

            {/* Reviews */}
            <section className="rounded-2xl border border-[#d8e2eb] bg-white p-6 shadow-xs sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2e8f0] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-extrabold text-[#0a1128] sm:text-xl">
                    Customer Reviews
                  </h2>
                </div>

                <ProviderRating
                  averageRating={averageRating}
                  reviewCount={reviews.length}
                  loading={reviewsLoading}
                  error={reviewsError}
                  compact
                />
              </div>

              {reviewsLoading ? (
                <div role="status" className="mt-6 space-y-3 animate-pulse">
                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className="h-24 rounded-xl border border-[#d8e2eb] bg-[#f8fafc]"
                    />
                  ))}
                  <span className="sr-only">Loading reviews...</span>
                </div>
              ) : reviewsError ? (
                <FetchErrorBanner
                  message={reviewsError}
                  onRetry={fetchReviews}
                  className="mt-6"
                />
              ) : reviews.length === 0 ? (
                <div className="mt-6">
                  <EmptyState
                    icon={<Star className="h-6 w-6 text-[#034078]" />}
                    title="No reviews yet"
                    message="Customer reviews will appear here once completed bookings are rated."
                  />
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  <ReviewList reviews={reviews} />
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            {/* Service Areas */}
            <section className="rounded-2xl border border-[#d8e2eb] bg-white p-6 shadow-xs">
              <div className="flex items-center gap-2.5 border-b border-[#e2e8f0] pb-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]">
                  <MapPin className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-extrabold text-[#0a1128]">
                  Service Areas
                </h2>
              </div>

              {provider.serviceAreas?.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {provider.serviceAreas.map((area, index) => (
                    <span
                      key={`${area.city}-${area.state}-${index}`}
                      className="rounded-lg border border-[#d8e2eb] bg-[#f4f7fa] px-3 py-1.5 text-xs font-bold text-[#0a1128]"
                    >
                      {area.city}, {area.state}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-xs font-medium text-[#33415c] sm:text-sm">
                  Service areas are not listed yet.
                </p>
              )}
            </section>

            {/* CTA */}
            <section className="rounded-2xl bg-[#0a1128] p-6 text-white shadow-sm">
              <span className="inline-block rounded-md bg-[#1282a2] px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
                Book Now
              </span>

              <h2 className="mt-3.5 text-xl font-extrabold tracking-tight text-white">
                Need a home service?
              </h2>

              <p className="mt-2 text-xs font-medium leading-6 text-[#cbd5e1] sm:text-sm">
                Explore available services and request a booking with a verified
                local provider.
              </p>

              <Link
                to="/services"
                className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-white px-5 py-3 text-xs font-bold text-[#0a1128] transition-colors hover:bg-[#e2e8f0] sm:text-sm"
              >
                <span>Browse Services</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetails;
