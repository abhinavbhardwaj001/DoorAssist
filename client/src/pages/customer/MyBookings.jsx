import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, Plus } from "lucide-react";
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
    <div className="min-h-screen bg-[#fefcfb] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header Card */}
        <div className="rounded-3xl border border-[#d8e2eb] bg-white p-6 shadow-xs sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-[#d8e2eb] bg-[#f4f7fa] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#034078]">
                <span className="h-2 w-2 rounded-full bg-[#1282a2]" />
                <span>Customer Bookings</span>
              </div>

              <h1 className="mt-3.5 text-2xl font-extrabold tracking-tight text-[#0a1128] sm:text-3xl">
                My Bookings
              </h1>

              <p className="mt-1.5 text-sm font-medium text-[#33415c]">
                Track your service requests, schedules, and booking statuses.
              </p>
            </div>

            <Link
              to="/services"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#034078] px-6 py-3 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#001f54] sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Book New Service</span>
            </Link>
          </div>
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
          <div role="status" className="mt-8 space-y-4 animate-pulse">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-40 rounded-2xl border border-[#d8e2eb] bg-white"
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
              icon={<ClipboardList className="h-7 w-7 text-[#034078]" />}
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
          <div className="mt-8 space-y-4">
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
