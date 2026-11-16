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
  Sparkles,
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
    },
    {
      to: "/bookings",
      label: "My Bookings",
      description: "Track and manage your service requests",
      Icon: ClipboardList,
    },
    {
      to: "/payments",
      label: "My Payments",
      description: "View payment receipts and history",
      Icon: CreditCard,
    },
    {
      to: "/profile",
      label: "Account Profile",
      description: "Review your personal account details",
      Icon: User,
    },
  ];

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-4xl border border-white/75 bg-white/80 p-6 shadow-[0_12px_45px_rgba(203,189,255,0.2)] backdrop-blur-2xl sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#e4a5ff]/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-[#acdcff]/25 blur-3xl"
          />

          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bfcaff]/40 bg-white/75 px-3.5 py-1 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-[#a575bf]" />
                <span>Customer Dashboard</span>
              </div>

              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Welcome back, {user?.name || "Customer"}
              </h1>

              <p className="mt-1.5 text-sm font-medium text-slate-500">
                Manage your service bookings, track request updates, and view
                payment history.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-6 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:scale-[1.01] hover:brightness-105 active:scale-[0.99]"
              >
                <Compass className="h-4 w-4" />
                <span>Explore Services</span>
              </Link>

              {user?.role === "customer" && (
                <Link
                  to="/become-provider"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#bfcaff]/55 bg-white/80 px-5 py-3 text-sm font-bold text-slate-700 shadow-xs transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-900 active:scale-[0.99]"
                >
                  <Briefcase className="h-4 w-4 text-[#7c56a8]" />
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
          {quickLinks.map(({ to, label, description, Icon }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-3xl border border-white/75 bg-white/80 p-5 shadow-[0_8px_30px_rgba(203,189,255,0.14)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#deabff]/70"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-[#7c56a8] ring-1 ring-inset ring-[#deabff]/60">
                  <Icon className="h-5 w-5" />
                </div>

                <ArrowUpRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#7c56a8]" />
              </div>

              <h2 className="mt-4 text-base font-extrabold text-slate-900">
                {label}
              </h2>

              <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                {description}
              </p>
            </Link>
          ))}
        </div>

        {/* Recent Bookings */}
        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                Recent Bookings
              </h2>
              <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                Your latest service requests and their current status.
              </p>
            </div>

            {bookings.length > 0 && (
              <Link
                to="/bookings"
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#bfcaff]/55 bg-white/80 px-4 py-2 text-xs font-bold text-slate-700 shadow-xs transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-900 sm:text-sm"
              >
                <span>View All Bookings</span>
                <ArrowUpRight className="h-4 w-4 text-[#7c56a8]" />
              </Link>
            )}
          </div>

          {loading ? (
            <div role="status" className="mt-5 space-y-4 animate-pulse">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-28 rounded-3xl border border-white/70 bg-white/65"
                />
              ))}
              <span className="sr-only">Loading recent bookings...</span>
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="mt-5">
              <EmptyState
                icon={<ClipboardList className="h-7 w-7 text-[#7c56a8]" />}
                title="No bookings yet"
                message="Explore local services and schedule your first appointment."
                actionLabel="Browse Services"
                actionLink="/services"
              />
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {recentBookings.map((booking) => (
                <article
                  key={booking._id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/75 bg-white/80 p-5 shadow-[0_8px_30px_rgba(203,189,255,0.14)] backdrop-blur-2xl transition-all hover:border-[#deabff]/60 sm:p-6"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-base font-extrabold text-slate-900 sm:text-lg">
                        {booking.serviceName ||
                          booking.serviceId?.name ||
                          "Service Booking"}
                      </h3>

                      <BookingStatusBadge status={booking.status} />
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs font-semibold text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#7c56a8]" />
                        <span>{formatDateTime(booking.scheduledAt)}</span>
                      </span>

                      {booking.price != null && (
                        <span className="inline-flex items-center gap-1">
                          <IndianRupee className="h-3.5 w-3.5 text-[#7c56a8]" />
                          <span>{formatCurrency(booking.price)}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/bookings/${booking._id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#bfcaff]/55 bg-white/85 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition-all hover:border-[#deabff] hover:bg-linear-to-r hover:from-[#e4a5ff]/20 hover:to-[#acdcff]/20 hover:text-slate-900 sm:text-sm"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="h-4 w-4 text-[#7c56a8]" />
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
