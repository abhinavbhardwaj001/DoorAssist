import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, Plus, Sparkles } from "lucide-react";
import BookingCard from "../../components/bookings/BookingCard";
import { getMyBookings } from "../../services/booking.api";
import { formatLabel } from "../../utils/formatters";
import FilterTabs from "../../components/common/FilterTabs";
import EmptyState from "../../components/common/EmptyState";
import FetchErrorBanner from "../../components/common/FetchErrorBanner";

const STATUS_FILTERS = [
  "all",
  "pending",
  "accepted",
  "payment_pending",
  "confirmed",
  "in_progress",
  "completed",
  "rejected",
  "cancelled",
];

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getMyBookings();
      const result = response.data.data;

      const bookingList = Array.isArray(result?.bookings)
        ? result.bookings
        : Array.isArray(result)
          ? result
          : [];

      setBookings(bookingList);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your bookings. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const filteredBookings =
    activeFilter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === activeFilter);

  const filterOptions = STATUS_FILTERS.map((status) => ({
    value: status,
    label: status === "all" ? `All (${bookings.length})` : formatLabel(status),
  }));

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bfcaff]/40 bg-white/70 px-3.5 py-1 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#a575bf]" />
              <span>Customer Bookings</span>
            </div>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              My Bookings
            </h1>

            <p className="mt-1.5 text-sm font-medium text-slate-500">
              Track your service requests, schedules, and booking statuses.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-6 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:scale-[1.01] hover:brightness-105 active:scale-[0.99]"
          >
            <Plus className="h-4 w-4" />
            <span>Book New Service</span>
          </Link>
        </div>

        {/* Status Filter Pills */}
        <FilterTabs
          options={filterOptions}
          value={activeFilter}
          onChange={setActiveFilter}
          className="mt-7"
        />

        {/* Content */}
        {loading ? (
          <div role="status" className="mt-8 space-y-5 animate-pulse">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-40 rounded-4xl border border-white/70 bg-white/65"
              />
            ))}
            <span className="sr-only">Loading your bookings...</span>
          </div>
        ) : error ? (
          <FetchErrorBanner
            message={error}
            onRetry={fetchBookings}
            className="mt-8"
          />
        ) : filteredBookings.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={<ClipboardList className="h-7 w-7 text-[#7c56a8]" />}
              title={
                activeFilter === "all"
                  ? "No bookings found"
                  : `No ${formatLabel(activeFilter).toLowerCase()} bookings`
              }
              message={
                activeFilter === "all"
                  ? "You haven't made any service bookings yet."
                  : "No bookings match the selected status filter."
              }
              actionLabel={
                activeFilter === "all"
                  ? "Explore Services"
                  : "Show All Bookings"
              }
              actionLink={activeFilter === "all" ? "/services" : undefined}
              onAction={
                activeFilter !== "all"
                  ? () => setActiveFilter("all")
                  : undefined
              }
            />
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
