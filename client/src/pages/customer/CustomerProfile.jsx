import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Shield,
  BadgeCheck,
  ArrowLeft,
  Briefcase,
  Info,
  Sparkles,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import BookingStatusBadge from "../../components/common/BookingStatusBadge";
import { getDashboardPathByRole } from "../../utils/authRedirect";
import { formatLabel } from "../../utils/formatters";

const CustomerProfile = () => {
  const { user } = useAuth();

  const fields = [
    {
      label: "Full Name",
      value: user?.name,
      Icon: User,
      capitalize: true,
    },
    {
      label: "Email Address",
      value: user?.email,
      Icon: Mail,
      capitalize: false,
    },
    {
      label: "Phone Number",
      value: user?.phone,
      Icon: Phone,
      capitalize: false,
    },
    {
      label: "Account Role",
      value: user?.role,
      Icon: Shield,
      capitalize: true,
    },
    {
      label: "Account Status",
      value: user?.status,
      Icon: BadgeCheck,
      isStatus: true,
    },
  ];

  const dashboardPath = getDashboardPathByRole(user?.role);

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bfcaff]/40 bg-white/70 px-3.5 py-1 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#a575bf]" />
            <span>My Account</span>
          </div>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Account Profile
          </h1>

          <p className="mt-1.5 text-sm font-medium text-slate-500">
            View your DoorAssist account information and role permissions.
          </p>
        </div>

        {/* Main Profile Glass Card */}
        <div className="relative mt-8 overflow-hidden rounded-4xl border border-white/75 bg-white/80 shadow-[0_12px_45px_rgba(203,189,255,0.2)] backdrop-blur-2xl">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#e4a5ff]/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-[#acdcff]/25 blur-3xl"
          />

          {/* Profile Header */}
          <div className="relative z-10 flex flex-wrap items-center gap-5 border-b border-[#bfcaff]/30 bg-linear-to-r from-[#f6ebff]/60 via-[#f4f1ff]/60 to-[#ebf6ff]/60 p-6 sm:p-8">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] text-3xl font-extrabold text-slate-900 shadow-lg shadow-[#cbbdff]/35 ring-2 ring-white/80">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                  {user?.name || "DoorAssist User"}
                </h2>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#deabff]/70 bg-white/85 px-3 py-1 text-xs font-bold capitalize text-[#7c56a8] shadow-xs backdrop-blur-md">
                  <Shield className="h-3 w-3" />
                  <span>{user?.role || "User"}</span>
                </span>
              </div>

              <p className="mt-1.5 truncate text-sm font-medium text-slate-500">
                {user?.email || "No email address linked"}
              </p>
            </div>
          </div>

          {/* Account Details */}
          <div className="relative z-10 p-6 sm:p-8">
            <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
              Personal Information
            </h3>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {fields.map(({ label, value, Icon, capitalize, isStatus }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[#bfcaff]/45 bg-white/65 p-4 shadow-xs backdrop-blur-md transition-colors hover:border-[#deabff]/70 hover:bg-white/80"
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <Icon className="h-3.5 w-3.5 text-[#7c56a8]" />
                    <span>{label}</span>
                  </div>

                  {isStatus && value ? (
                    <div className="mt-2.5">
                      <BookingStatusBadge status={formatLabel(value)} />
                    </div>
                  ) : (
                    <p
                      className={`mt-2 wrap-break-words text-sm font-extrabold text-slate-900 sm:text-base ${
                        capitalize ? "capitalize" : "normal-case"
                      }`}
                    >
                      {value || "Not available"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Read-Only Info Banner */}
        <div className="mt-6 flex items-start gap-3.5 rounded-3xl border border-[#bfcaff]/50 bg-linear-to-r from-[#f6ebff]/80 via-[#f4f1ff]/80 to-[#ebf6ff]/80 p-5 shadow-xs backdrop-blur-xl">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/85 text-[#7c56a8] ring-1 ring-inset ring-[#deabff]/60">
            <Info className="h-4 w-4" />
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Account Information
            </h3>

            <p className="mt-1 text-xs font-medium leading-6 text-slate-600 sm:text-sm">
              Account details are currently read-only. Profile editing will be
              available once the corresponding backend endpoint is implemented.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={dashboardPath}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-6 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:scale-[1.01] hover:brightness-105 active:scale-[0.99]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>

          {user?.role === "provider" && (
            <Link
              to="/provider/profile"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#bfcaff]/55 bg-white/80 px-6 py-3 text-sm font-bold text-slate-700 shadow-xs transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-900 active:scale-[0.99]"
            >
              <Briefcase className="h-4 w-4 text-[#7c56a8]" />
              <span>Edit Business Profile</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
