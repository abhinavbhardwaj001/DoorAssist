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
  Sparkles,
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
  },
  {
    title: "Booking Requests",
    description: "Review and respond to customer booking requests.",
    path: "/provider/bookings",
    icon: ClipboardList,
  },
  {
    title: "Set Availability",
    description: "Update your weekly working hours.",
    path: "/provider/availability",
    icon: Calendar,
  },
  {
    title: "Business Profile",
    description: "Manage your business information and service areas.",
    path: "/provider/profile",
    icon: Store,
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
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Welcome Header */}
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bfcaff]/40 bg-white/70 px-3.5 py-1 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#a575bf]" />
              <span>Provider Dashboard</span>
            </div>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Welcome back, {user?.name?.split(" ")[0] || "Provider"}!
            </h1>

            <p className="mt-1.5 text-sm font-medium text-slate-500">
              Manage your services, booking requests, and business activity on
              DoorAssist.
            </p>
          </div>

          <Link
            to="/provider/services/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-5 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:scale-[1.01] hover:brightness-105 active:scale-[0.99]"
          >
            <Plus className="h-4 w-4" />
            <span>Create Service</span>
          </Link>
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
          <section className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-amber-200/80 bg-amber-50/85 p-5 shadow-xs backdrop-blur-xl sm:px-7">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200">
                <Clock className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-extrabold text-amber-950 sm:text-lg">
                  You have pending booking requests
                </h2>

                <p className="mt-0.5 text-xs font-medium text-amber-800 sm:text-sm">
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
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-amber-600/20 transition-all hover:bg-amber-700 active:scale-95 sm:text-sm"
            >
              <span>Review Requests</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </section>
        )}

        {/* Business Overview Statistics */}
        <section className="mt-8">
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
            Business Overview
          </h2>

          {!loading && !stats && !error ? (
            <div className="mt-5 rounded-3xl border border-white/75 bg-white/75 p-8 text-center text-sm font-medium text-slate-500 backdrop-blur-xl">
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
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
            Quick Actions
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.path}
                  to={action.path}
                  className="group flex flex-col justify-between rounded-3xl border border-white/75 bg-white/80 p-6 shadow-[0_8px_30px_rgba(203,189,255,0.14)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#deabff]/70 hover:bg-white/95 hover:shadow-[0_14px_35px_rgba(203,189,255,0.24)]"
                >
                  <div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-[#7c56a8] ring-1 ring-inset ring-[#deabff]/60 transition-transform duration-300 group-hover:scale-105">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-4 text-base font-extrabold text-slate-900 group-hover:text-[#7c56a8]">
                      {action.title}
                    </h3>

                    <p className="mt-1.5 text-xs font-medium leading-5 text-slate-500 sm:text-sm">
                      {action.description}
                    </p>
                  </div>

                  <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[#7c56a8] sm:text-sm">
                    <span>Open</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
