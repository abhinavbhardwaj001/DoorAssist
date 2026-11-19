import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Wrench,
  CheckCircle2,
  ClipboardList,
  Clock,
  CalendarCheck,
  Trophy,
  XCircle,
  MessageSquare,
  Star,
  Plus,
  Calendar,
  Store,
  ArrowUpRight,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { getProviderDashboardStats } from "../../services/provider.api";
import ProviderReviews from "../../components/reviews/ProviderReviews";
import StatCard from "../../components/common/StatCard";
import FetchErrorBanner from "../../components/common/FetchErrorBanner";

const QUICK_ACTIONS = [
  {
    title: "Manage Services",
    description: "View, update, and manage your service listings.",
    path: "/provider/services",
    icon: Wrench,
    accentClass:
      "border-[#034078]/20 bg-[#034078]/10 text-[#034078] group-hover:bg-[#034078] group-hover:text-white",
  },
  {
    title: "Booking Requests",
    description: "Review and respond to customer booking requests.",
    path: "/provider/bookings",
    icon: ClipboardList,
    accentClass:
      "border-[#1282a2]/25 bg-[#1282a2]/10 text-[#1282a2] group-hover:bg-[#1282a2] group-hover:text-white",
  },
  {
    title: "Set Availability",
    description: "Update your weekly working hours.",
    path: "/provider/availability",
    icon: Calendar,
    accentClass:
      "border-emerald-200 bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white",
  },
  {
    title: "Business Profile",
    description: "Manage your business information and service areas.",
    path: "/provider/profile",
    icon: Store,
    accentClass:
      "border-[#001f54]/20 bg-[#001f54]/10 text-[#001f54] group-hover:bg-[#001f54] group-hover:text-white",
  },
];

const ProviderDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getProviderDashboardStats();
      setStats(response.data.data.stats);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load provider dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    {
      label: "Total Services",
      value: stats?.services?.total ?? 0,
      icon: Wrench,
      variant: "brand",
    },
    {
      label: "Active Services",
      value: stats?.services?.active ?? 0,
      icon: CheckCircle2,
      variant: "emerald",
    },
    {
      label: "Total Bookings",
      value: stats?.bookings?.total ?? 0,
      icon: ClipboardList,
      variant: "indigo",
    },
    {
      label: "Pending Requests",
      value: stats?.bookings?.pending ?? 0,
      icon: Clock,
      variant: "amber",
    },
    {
      label: "Accepted Bookings",
      value: stats?.bookings?.accepted ?? 0,
      icon: CalendarCheck,
      variant: "sky",
    },
    {
      label: "Completed Bookings",
      value: stats?.bookings?.completed ?? 0,
      icon: Trophy,
      variant: "emerald",
    },
    {
      label: "Cancelled Bookings",
      value: stats?.bookings?.cancelled ?? 0,
      icon: XCircle,
      variant: "rose",
    },
    {
      label: "Total Reviews",
      value: stats?.reviews?.total ?? 0,
      icon: MessageSquare,
      variant: "violet",
    },
    {
      label: "Average Rating",
      value:
        (stats?.reviews?.total ?? 0) > 0
          ? `${stats.reviews.averageRating.toFixed(1)} / 5`
          : "No ratings",
      icon: Star,
      variant: "amber",
      format: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#fefcfb] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Welcome Header Card */}
        <div className="rounded-3xl border border-[#d8e2eb] bg-white p-6 shadow-xs sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-[#d8e2eb] bg-[#f4f7fa] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#034078]">
                <span className="h-2 w-2 rounded-full bg-[#1282a2]" />
                <span>Provider Dashboard</span>
              </div>

              <h1 className="mt-3.5 text-2xl font-extrabold tracking-tight text-[#0a1128] sm:text-3xl">
                Welcome back, {user?.name?.split(" ")[0] || "Provider"}!
              </h1>

              <p className="mt-1.5 text-sm font-medium text-[#33415c]">
                Manage your services, booking requests, and business activity on
                DoorAssist.
              </p>
            </div>

            <Link
              to="/provider/services/create"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#034078] px-6 py-3 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#001f54] sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Create Service</span>
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <FetchErrorBanner
            message={error}
            onRetry={fetchStats}
            className="mt-7"
          />
        )}

        {/* Pending Requests Alert Banner */}
        {!loading && stats && stats.bookings.pending > 0 && (
          <section className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:px-7">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-white text-amber-700">
                <Clock className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-extrabold text-amber-950 sm:text-lg">
                  You have pending booking requests
                </h2>

                <p className="mt-0.5 text-xs font-medium text-amber-900 sm:text-sm">
                  {stats.bookings.pending}{" "}
                  {stats.bookings.pending === 1
                    ? "booking request is"
                    : "booking requests are"}{" "}
                  waiting for your response.
                </p>
              </div>
            </div>

            <Link
              to="/provider/bookings"
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-amber-700 sm:text-sm"
            >
              <span>Review Requests</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </section>
        )}

        {/* Business Overview Statistics */}
        <section className="mt-8">
          <div className="border-b border-[#e2e8f0] pb-3.5">
            <h2 className="text-lg font-extrabold tracking-tight text-[#0a1128] sm:text-xl">
              Business Overview
            </h2>
          </div>

          {!loading && !stats && !error ? (
            <div className="mt-5 rounded-3xl border border-[#d8e2eb] bg-white p-8 text-center text-sm font-medium text-[#33415c]">
              Dashboard statistics are unavailable.
            </div>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {statCards.map((card) => (
                <StatCard
                  key={card.label}
                  label={card.label}
                  value={card.value}
                  icon={card.icon}
                  variant={card.variant}
                  format={card.format}
                  loading={loading}
                />
              ))}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="mt-10">
          <div className="border-b border-[#e2e8f0] pb-3.5">
            <h2 className="text-lg font-extrabold tracking-tight text-[#0a1128] sm:text-xl">
              Quick Actions
            </h2>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.path}
                  to={action.path}
                  className="group flex flex-col justify-between rounded-2xl border border-[#d8e2eb] bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1282a2] hover:shadow-md"
                >
                  <div>
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${action.accentClass}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-4 text-base font-extrabold text-[#0a1128] transition-colors group-hover:text-[#034078]">
                      {action.title}
                    </h3>

                    <p className="mt-1.5 text-xs font-medium leading-5 text-[#33415c] sm:text-sm">
                      {action.description}
                    </p>
                  </div>

                  <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[#034078] sm:text-sm">
                    <span>Open</span>
                    <ArrowUpRight className="h-4 w-4 text-[#1282a2] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      <ProviderReviews />
    </div>
  );
};

export default ProviderDashboard;
