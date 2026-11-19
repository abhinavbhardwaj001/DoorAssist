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
        badgeClass: "border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]",
      },
      {
        label: "Active Users",
        field: "active",
        Icon: UserCheck,
        badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
      },
      {
        label: "Suspended Users",
        field: "suspended",
        Icon: UserMinus,
        badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
      },
      {
        label: "Blocked Users",
        field: "blocked",
        Icon: UserX,
        badgeClass: "border-red-200 bg-red-50 text-red-700",
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
        badgeClass: "border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]",
      },
      {
        label: "Pending Applications",
        field: "pending",
        Icon: Clock,
        badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
      },
      {
        label: "Approved Providers",
        field: "approved",
        Icon: BadgeCheck,
        badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
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
        badgeClass: "border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]",
      },
      {
        label: "Active Services",
        field: "active",
        Icon: CheckCircle2,
        badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
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
        badgeClass: "border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]",
      },
      {
        label: "Pending Bookings",
        field: "pending",
        Icon: Hourglass,
        badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
      },
      {
        label: "Completed Bookings",
        field: "completed",
        Icon: Trophy,
        badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
      },
      {
        label: "Cancelled Bookings",
        field: "cancelled",
        Icon: XCircle,
        badgeClass: "border-red-200 bg-red-50 text-red-700",
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
        badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
      },
    ],
  },
];

const StatCard = ({ label, value, Icon, badgeClass }) => (
  <div className="rounded-2xl border border-[#d8e2eb] bg-white p-6 shadow-xs transition-colors hover:border-[#1282a2]">
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
          {label}
        </p>

        <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0a1128]">
          {formatNumber(value)}
        </p>
      </div>

      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${badgeClass}`}
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
    <div className="min-h-screen bg-[#fefcfb] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader
          title={`Welcome back, ${user?.name?.split(" ")[0] || "Admin"}!`}
          subtitle="Monitor DoorAssist activity and manage the platform."
          action={
            <button
              type="button"
              onClick={fetchDashboard}
              disabled={loading}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-5 py-3 text-sm font-bold text-[#0a1128] shadow-xs transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078] disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
            >
              <RefreshCw
                className={`h-4 w-4 text-[#1282a2] ${loading ? "animate-spin" : ""}`}
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
                <div className="mb-5 h-6 w-44 rounded bg-[#e2e8f0]" />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: count }).map((_, i) => (
                    <div
                      key={i}
                      className="h-30 rounded-2xl border border-[#d8e2eb] bg-white"
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
              <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-xs">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-white text-amber-700">
                      <BellRing className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="text-base font-extrabold text-amber-950 sm:text-lg">
                        Provider Applications Awaiting Review
                      </h2>

                      <p className="mt-1 text-sm font-medium text-amber-900">
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
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-600 px-5 py-3 text-sm font-bold text-white shadow-xs transition-colors hover:bg-amber-700 sm:w-auto"
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
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2e8f0] pb-3.5">
                  <h2 className="text-lg font-extrabold tracking-tight text-[#0a1128] sm:text-xl">
                    {section.title}
                  </h2>

                  {section.link && (
                    <Link
                      to={section.link.to}
                      className="inline-flex items-center gap-1 rounded-xl border border-[#cbd5e1] bg-white px-3.5 py-1.5 text-xs font-bold text-[#0a1128] transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078]"
                    >
                      <span>{section.link.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-[#1282a2]" />
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
              <div className="border-b border-[#e2e8f0] pb-3.5">
                <h2 className="text-lg font-extrabold tracking-tight text-[#0a1128] sm:text-xl">
                  Quick Actions
                </h2>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
                {quickActions.map(({ label, description, path, Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className="group flex flex-col rounded-2xl border border-[#d8e2eb] bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1282a2] hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d8e2eb] bg-[#f4f7fa] text-[#034078] transition-colors group-hover:border-[#034078] group-hover:bg-[#034078] group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-5 text-base font-extrabold text-[#0a1128] transition-colors group-hover:text-[#034078]">
                      {label}
                    </h3>

                    <p className="mt-2 text-sm font-medium leading-6 text-[#33415c]">
                      {description}
                    </p>

                    <div className="mt-auto pt-5">
                      <span className="inline-flex items-center gap-1 rounded-xl bg-[#034078] px-4 py-2 text-xs font-bold text-white transition-colors group-hover:bg-[#001f54]">
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
