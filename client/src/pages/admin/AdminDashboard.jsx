import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  UserCheck,
  UserMinus,
  UserX,
  Store,
  Clock,
  BadgeCheck,
  Wrench,
  CheckCircle2,
  ClipboardList,
  Hourglass,
  Trophy,
  XCircle,
  Star,
  FolderKanban,
  RefreshCw,
  ArrowUpRight,
  BellRing,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import { getAdminDashboardStats } from "../../services/admin.api";
import { formatNumber } from "../../utils/formatters";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import FetchErrorBanner from "../../components/common/FetchErrorBanner";

const sections = [
  {
    title: "User Overview",
    key: "users",
    link: { to: "/admin/users", label: "Manage Users" },
    cards: [
      {
        label: "Total Users",
        field: "total",
        Icon: Users,
        badgeClass:
          "bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-[#7c56a8] ring-[#deabff]/60",
      },
      {
        label: "Active Users",
        field: "active",
        Icon: UserCheck,
        badgeClass: "bg-emerald-100/85 text-emerald-600 ring-emerald-200/80",
      },
      {
        label: "Suspended Users",
        field: "suspended",
        Icon: UserMinus,
        badgeClass: "bg-amber-100/85 text-amber-600 ring-amber-200/80",
      },
      {
        label: "Blocked Users",
        field: "blocked",
        Icon: UserX,
        badgeClass: "bg-red-100/85 text-red-600 ring-red-200/80",
      },
    ],
  },
  {
    title: "Provider Overview",
    key: "providers",
    link: { to: "/admin/providers", label: "Manage Applications" },
    cards: [
      {
        label: "Total Providers",
        field: "total",
        Icon: Store,
        badgeClass:
          "bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-[#7c56a8] ring-[#deabff]/60",
      },
      {
        label: "Pending Applications",
        field: "pending",
        Icon: Clock,
        badgeClass: "bg-amber-100/85 text-amber-600 ring-amber-200/80",
      },
      {
        label: "Approved Providers",
        field: "approved",
        Icon: BadgeCheck,
        badgeClass: "bg-emerald-100/85 text-emerald-600 ring-emerald-200/80",
      },
    ],
  },
  {
    title: "Service Overview",
    key: "services",
    link: { to: "/admin/categories", label: "Manage Categories" },
    cards: [
      {
        label: "Total Services",
        field: "total",
        Icon: Wrench,
        badgeClass:
          "bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-[#7c56a8] ring-[#deabff]/60",
      },
      {
        label: "Active Services",
        field: "active",
        Icon: CheckCircle2,
        badgeClass: "bg-emerald-100/85 text-emerald-600 ring-emerald-200/80",
      },
    ],
  },
  {
    title: "Booking Overview",
    key: "bookings",
    cards: [
      {
        label: "Total Bookings",
        field: "total",
        Icon: ClipboardList,
        badgeClass:
          "bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-[#7c56a8] ring-[#deabff]/60",
      },
      {
        label: "Pending Bookings",
        field: "pending",
        Icon: Hourglass,
        badgeClass: "bg-amber-100/85 text-amber-600 ring-amber-200/80",
      },
      {
        label: "Completed Bookings",
        field: "completed",
        Icon: Trophy,
        badgeClass: "bg-emerald-100/85 text-emerald-600 ring-emerald-200/80",
      },
      {
        label: "Cancelled Bookings",
        field: "cancelled",
        Icon: XCircle,
        badgeClass: "bg-red-100/85 text-red-600 ring-red-200/80",
      },
    ],
  },
  {
    title: "Review Overview",
    key: "reviews",
    cards: [
      {
        label: "Total Reviews",
        field: "total",
        Icon: Star,
        badgeClass: "bg-amber-100/85 text-amber-600 ring-amber-200/80",
      },
    ],
  },
];

const StatCard = ({ label, value, Icon, badgeClass }) => (
  <div className="relative overflow-hidden rounded-3xl border border-white/75 bg-white/80 p-6 shadow-[0_8px_30px_rgba(203,189,255,0.14)] backdrop-blur-2xl transition-all hover:border-[#deabff]/60 hover:shadow-[0_12px_35px_rgba(203,189,255,0.22)]">
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {label}
        </p>

        <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
          {formatNumber(value)}
        </p>
      </div>

      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ring-inset ${badgeClass}`}
      >
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
);

const quickActions = [
  {
    label: "Manage Users",
    description: "Review users and update their account status.",
    path: "/admin/users",
    Icon: Users,
  },
  {
    label: "Provider Applications",
    description: "Approve or reject provider applications.",
    path: "/admin/providers",
    Icon: Store,
  },
  {
    label: "Manage Categories",
    description: "Create, edit, and manage service categories.",
    path: "/admin/categories",
    Icon: FolderKanban,
  },
];

const AdminDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAdminDashboardStats();
      setStats(response.data.data.stats);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load admin dashboard statistics.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader
          title={`Welcome back, ${user?.name?.split(" ")[0] || "Admin"}!`}
          subtitle="Monitor DoorAssist activity and manage the platform."
          action={
            <button
              type="button"
              onClick={fetchDashboard}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#bfcaff]/50 bg-white/80 px-5 py-3 text-sm font-bold text-slate-700 shadow-xs backdrop-blur-md transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-900 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
            >
              <RefreshCw
                className={`h-4 w-4 text-[#7c56a8] ${loading ? "animate-spin" : ""}`}
              />
              <span>{loading ? "Refreshing..." : "Refresh Statistics"}</span>
            </button>
          }
        />

        <FetchErrorBanner
          message={error}
          onRetry={fetchDashboard}
          className="mt-8"
        />

        {/* Loading Skeletons */}
        {loading ? (
          <div role="status" className="mt-10 space-y-10 animate-pulse">
            {[4, 3, 2, 4, 1].map((count, index) => (
              <div key={index}>
                <div className="mb-5 h-6 w-44 rounded-lg bg-white/70" />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: count }).map((_, i) => (
                    <div
                      key={i}
                      className="h-30 rounded-3xl border border-white/70 bg-white/65"
                    />
                  ))}
                </div>
              </div>
            ))}
            <span className="sr-only">Loading admin dashboard...</span>
          </div>
        ) : stats ? (
          <>
            {/* Pending Provider Applications Alert Banner */}
            {stats.providers.pending > 0 && (
              <section className="relative mt-8 overflow-hidden rounded-3xl border border-amber-200/85 bg-amber-50/85 p-6 shadow-[0_8px_30px_rgba(245,158,11,0.12)] backdrop-blur-2xl">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 ring-1 ring-inset ring-amber-200/80">
                      <BellRing className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="text-base font-extrabold text-amber-950 sm:text-lg">
                        Provider Applications Awaiting Review
                      </h2>

                      <p className="mt-1 text-sm font-medium text-amber-800">
                        {stats.providers.pending}{" "}
                        {stats.providers.pending === 1
                          ? "application requires"
                          : "applications require"}{" "}
                        admin verification.
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/admin/providers"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-amber-500/20 transition-all hover:bg-amber-600 active:scale-[0.98] sm:w-auto"
                  >
                    <span>Review Applications</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </section>
            )}

            {/* Statistics Sections */}
            {sections.map((section) => (
              <section key={section.key} className="mt-10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                    {section.title}
                  </h2>

                  {section.link && (
                    <Link
                      to={section.link.to}
                      className="inline-flex items-center gap-1 rounded-full border border-[#bfcaff]/45 bg-white/75 px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-md transition-all hover:border-[#deabff] hover:bg-white hover:text-[#7c56a8]"
                    >
                      <span>{section.link.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>

                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {section.cards.map((card) => (
                    <StatCard
                      key={card.label}
                      label={card.label}
                      value={stats[section.key]?.[card.field]}
                      Icon={card.Icon}
                      badgeClass={card.badgeClass}
                    />
                  ))}
                </div>
              </section>
            ))}

            {/* Quick Actions */}
            <section className="mt-12">
              <h2 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                Quick Actions
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
                {quickActions.map(({ label, description, path, Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/75 bg-white/80 p-6 shadow-[0_8px_30px_rgba(203,189,255,0.14)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#deabff]/70 hover:shadow-[0_14px_40px_rgba(203,189,255,0.26)]"
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-12 -bottom-12 h-32 w-32 rounded-full bg-[#acdcff]/20 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                    />

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-[#7c56a8] ring-1 ring-inset ring-[#deabff]/60 transition-transform duration-300 group-hover:scale-105">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-5 text-base font-extrabold text-slate-900 transition-colors group-hover:text-[#7c56a8]">
                      {label}
                    </h3>

                    <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                      {description}
                    </p>

                    <div className="mt-auto pt-5">
                      <span className="inline-flex items-center gap-1 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-3.5 py-2 text-xs font-bold text-slate-900 shadow-xs shadow-[#cbbdff]/30 transition-all group-hover:brightness-105">
                        <span>Open</span>
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default AdminDashboard;
