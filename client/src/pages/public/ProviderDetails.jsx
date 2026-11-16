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
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div
          role="status"
          className="mx-auto max-w-6xl space-y-6 animate-pulse"
        >
          <div className="h-5 w-48 rounded-full bg-white/75" />
          <div className="h-56 rounded-4xl border border-white/70 bg-white/65" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="h-64 rounded-4xl border border-white/70 bg-white/65 lg:col-span-2" />
            <div className="h-64 rounded-4xl border border-white/70 bg-white/65" />
          </div>
          <span className="sr-only">Loading provider details...</span>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-4xl border border-white/75 bg-white/80 p-8 text-center shadow-[0_12px_45px_rgba(203,189,255,0.2)] backdrop-blur-2xl sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100/80 text-rose-600 ring-1 ring-inset ring-rose-200/80">
            <AlertCircle className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-2xl font-extrabold text-slate-900">
            Provider Unavailable
          </h1>

          <p role="alert" className="mt-3 text-sm font-medium text-slate-500">
            {error || "This provider could not be found."}
          </p>

          <Link
            to="/services"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-6 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:brightness-105"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Explore Services</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 inline-flex flex-wrap items-center gap-1.5 rounded-full border border-[#bfcaff]/45 bg-white/70 px-4 py-2 text-xs font-bold text-slate-500 shadow-xs backdrop-blur-md sm:text-sm"
        >
          <Link to="/" className="transition-colors hover:text-[#7c56a8]">
            Home
          </Link>

          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />

          <Link
            to="/services"
            className="transition-colors hover:text-[#7c56a8]"
          >
            Services
          </Link>

          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />

          <span className="text-slate-900">{provider.businessName}</span>
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
            <section className="rounded-4xl border border-white/75 bg-white/80 p-6 shadow-[0_12px_45px_rgba(203,189,255,0.18)] backdrop-blur-2xl sm:p-8">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-[#7c56a8] ring-1 ring-inset ring-[#deabff]/60">
                  <FileText className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                  About the Provider
                </h2>
              </div>

              <p className="mt-5 whitespace-pre-line text-sm font-medium leading-7 text-slate-600 sm:text-base">
                {provider.description ||
                  "This provider has not added a business description yet."}
              </p>
            </section>

            {/* Reviews */}
            <section className="rounded-4xl border border-white/75 bg-white/80 p-6 shadow-[0_12px_45px_rgba(203,189,255,0.18)] backdrop-blur-2xl sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-[#7c56a8] ring-1 ring-inset ring-[#deabff]/60">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
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
                      className="h-24 rounded-2xl border border-white/80 bg-white/65"
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
                    icon={<Star className="h-6 w-6 text-[#7c56a8]" />}
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
            <section className="rounded-4xl border border-white/75 bg-white/80 p-6 shadow-[0_12px_45px_rgba(203,189,255,0.18)] backdrop-blur-2xl">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-[#7c56a8] ring-1 ring-inset ring-[#deabff]/60">
                  <MapPin className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Service Areas
                </h2>
              </div>

              {provider.serviceAreas?.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {provider.serviceAreas.map((area, index) => (
                    <span
                      key={`${area.city}-${area.state}-${index}`}
                      className="rounded-xl border border-[#deabff]/60 bg-linear-to-r from-[#f6ebff]/90 via-[#f4f1ff]/90 to-[#ebf6ff]/90 px-3.5 py-2 text-xs font-bold text-slate-800 shadow-xs"
                    >
                      {area.city}, {area.state}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-xs font-medium text-slate-500 sm:text-sm">
                  Service areas are not listed yet.
                </p>
              )}
            </section>

            {/* CTA */}
            <section className="relative overflow-hidden rounded-4xl border border-white/80 bg-linear-to-br from-[#e4a5ff]/45 via-[#cbbdff]/45 to-[#acdcff]/45 p-6 shadow-[0_12px_40px_rgba(203,189,255,0.22)] backdrop-blur-2xl">
              <div className="relative z-10">
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                  Need a home service?
                </h2>

                <p className="mt-2.5 text-xs font-medium leading-6 text-slate-700 sm:text-sm">
                  Explore available services and request a booking with a
                  verified local provider.
                </p>

                <Link
                  to="/services"
                  className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white shadow-md shadow-slate-900/15 transition-all hover:scale-[1.02] hover:bg-slate-800 active:scale-[0.99] sm:text-sm"
                >
                  <span>Browse Services</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetails;
