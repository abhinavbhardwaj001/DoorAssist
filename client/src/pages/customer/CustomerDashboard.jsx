import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  PlayCircle,
  BadgeCheck,
  XCircle,
  Compass,
  CreditCard,
  User,
  Briefcase,
  ArrowUpRight,
  Calendar,
  IndianRupee,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { getMyBookings } from "../../services/booking.api";
import { formatCurrency, formatDateTime } from "../../utils/formatters";
import StatCard from "../../components/common/StatCard";
import BookingStatusBadge from "../../components/common/BookingStatusBadge";
import EmptyState from "../../components/common/EmptyState";
import FetchErrorBanner from "../../components/common/FetchErrorBanner";

const CustomerDashboard = () => {
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
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
        err.response?.data?.message || "Unable to load your dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const counts = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) =>
      ["accepted", "payment_pending", "confirmed"].includes(b.status),
    ).length,
    inProgress: bookings.filter((b) => b.status === "in_progress").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelledOrRejected: bookings.filter((b) =>
      ["cancelled", "rejected"].includes(b.status),
    ).length,
  };

  const recentBookings = bookings.slice(0, 5);

  const statCards = [
    {
      label: "Total Bookings",
      value: counts.total,
      icon: ClipboardList,
      variant: "brand",
    },
    {
      label: "Pending",
      value: counts.pending,
      icon: Clock,
      variant: "amber",
    },
    {
      label: "Confirmed & Active",
      value: counts.confirmed,
      icon: CheckCircle2,
      variant: "sky",
    },
    {
      label: "In Progress",
      value: counts.inProgress,
      icon: PlayCircle,
      variant: "violet",
    },
    {
      label: "Completed",
      value: counts.completed,
      icon: BadgeCheck,
      variant: "emerald",
    },
    {
      label: "Cancelled / Rejected",
      value: counts.cancelledOrRejected,
      icon: XCircle,
      variant: "rose",
    },
  ];

  const quickLinks = [
    {
      to: "/services",
      label: "Browse Services",
      description: "Explore verified local home services",
      Icon: Compass,
      accentClass:
        "border-[#034078]/20 bg-[#034078]/10 text-[#034078] group-hover:bg-[#034078] group-hover:text-white",
    },
    {
      to: "/bookings",
      label: "My Bookings",
      description: "Track and manage your service requests",
      Icon: ClipboardList,
      accentClass:
        "border-[#1282a2]/25 bg-[#1282a2]/10 text-[#1282a2] group-hover:bg-[#1282a2] group-hover:text-white",
    },
    {
      to: "/payments",
      label: "My Payments",
      description: "View payment receipts and history",
      Icon: CreditCard,
      accentClass:
        "border-emerald-200 bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white",
    },
    {
      to: "/profile",
      label: "Account Profile",
      description: "Review your personal account details",
      Icon: User,
      accentClass:
        "border-[#001f54]/20 bg-[#001f54]/10 text-[#001f54] group-hover:bg-[#001f54] group-hover:text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fefcfb] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Welcome Header */}
        <div className="rounded-3xl border border-[#d8e2eb] bg-white p-6 shadow-xs sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-[#d8e2eb] bg-[#f4f7fa] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#034078]">
                <span className="h-2 w-2 rounded-full bg-[#1282a2]" />
                <span>Customer Dashboard</span>
              </div>

              <h1 className="mt-3.5 text-2xl font-extrabold tracking-tight text-[#0a1128] sm:text-3xl">
                Welcome back, {user?.name || "Customer"}
              </h1>

              <p className="mt-1.5 text-sm font-medium text-[#33415c]">
                Manage your service bookings, track request updates, and view
                payment history.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#034078] px-6 py-3 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#001f54]"
              >
                <Compass className="h-4 w-4" />
                <span>Explore Services</span>
              </Link>

              {user?.role === "customer" && (
                <Link
                  to="/become-provider"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-5 py-3 text-sm font-bold text-[#0a1128] transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078]"
                >
                  <Briefcase className="h-4 w-4 text-[#1282a2]" />
                  <span>Become a Provider</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {error && (
          <FetchErrorBanner
            message={error}
            onRetry={fetchBookings}
            className="mt-6"
          />
        )}

        {/* KPI Stat Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((card) => (
            <StatCard
              key={card.label}
              label={card.label}
              value={card.value}
              icon={card.icon}
              variant={card.variant}
              loading={loading}
            />
          ))}
        </div>

        {/* Quick Navigation */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map(({ to, label, description, Icon, accentClass }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl border border-[#d8e2eb] bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1282a2] hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${accentClass}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <ArrowUpRight className="h-4 w-4 text-[#64748b] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#034078]" />
              </div>

              <h2 className="mt-4 text-base font-extrabold text-[#0a1128] transition-colors group-hover:text-[#034078]">
                {label}
              </h2>

              <p className="mt-1 text-xs font-medium leading-5 text-[#33415c]">
                {description}
              </p>
            </Link>
          ))}
        </div>

        {/* Recent Bookings */}
        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e2e8f0] pb-4">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-[#0a1128]">
                Recent Bookings
              </h2>
              <p className="mt-1 text-xs font-medium text-[#33415c] sm:text-sm">
                Your latest service requests and their current status.
              </p>
            </div>

            {bookings.length > 0 && (
              <Link
                to="/bookings"
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#cbd5e1] bg-white px-4 py-2 text-xs font-bold text-[#0a1128] transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078] sm:text-sm"
              >
                <span>View All Bookings</span>
                <ArrowUpRight className="h-4 w-4 text-[#1282a2]" />
              </Link>
            )}
          </div>

          {loading ? (
            <div role="status" className="mt-5 space-y-4 animate-pulse">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-28 rounded-2xl border border-[#d8e2eb] bg-white"
                />
              ))}
              <span className="sr-only">Loading recent bookings...</span>
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="mt-5">
              <EmptyState
                icon={<ClipboardList className="h-7 w-7 text-[#034078]" />}
                title="No bookings yet"
                message="Explore local services and schedule your first appointment."
                actionLabel="Browse Services"
                actionLink="/services"
              />
            </div>
          ) : (
            <div className="mt-5 space-y-3.5">
              {recentBookings.map((booking) => (
                <article
                  key={booking._id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#d8e2eb] border-l-4 border-l-[#034078] bg-white p-5 shadow-xs transition-colors hover:border-[#1282a2] hover:border-l-[#1282a2] sm:p-6"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-base font-extrabold text-[#0a1128] sm:text-lg">
                        {booking.serviceName ||
                          booking.serviceId?.name ||
                          "Service Booking"}
                      </h3>

                      <BookingStatusBadge status={booking.status} />
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs font-semibold text-[#33415c]">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#1282a2]" />
                        <span>{formatDateTime(booking.scheduledAt)}</span>
                      </span>

                      {booking.price != null && (
                        <span className="inline-flex items-center gap-1 font-bold text-[#0a1128]">
                          <IndianRupee className="h-3.5 w-3.5 text-[#034078]" />
                          <span>{formatCurrency(booking.price)}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/bookings/${booking._id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#034078] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#001f54] sm:text-sm"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CustomerDashboard;
