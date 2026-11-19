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
    <div className="min-h-screen bg-[#fefcfb] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="rounded-3xl border border-[#d8e2eb] bg-white p-6 shadow-xs sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-lg border border-[#d8e2eb] bg-[#f4f7fa] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#034078]">
            <span className="h-2 w-2 rounded-full bg-[#1282a2]" />
            <span>My Account</span>
          </div>

          <h1 className="mt-3.5 text-2xl font-extrabold tracking-tight text-[#0a1128] sm:text-3xl">
            Account Profile
          </h1>

          <p className="mt-1.5 text-sm font-medium text-[#33415c]">
            View your DoorAssist account information and role permissions.
          </p>
        </div>

        {/* Main Profile Card */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-[#d8e2eb] bg-white shadow-xs">
          {/* Profile Header */}
          <div className="flex flex-wrap items-center gap-5 border-b border-[#e2e8f0] bg-[#f4f7fa] p-6 sm:p-8">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#034078] text-3xl font-extrabold text-white shadow-xs">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-extrabold tracking-tight text-[#0a1128] sm:text-2xl">
                  {user?.name || "DoorAssist User"}
                </h2>

                <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#1282a2]/30 bg-[#1282a2]/10 px-3 py-1 text-xs font-bold capitalize text-[#034078]">
                  <Shield className="h-3.5 w-3.5 text-[#1282a2]" />
                  <span>{user?.role || "User"}</span>
                </span>
              </div>

              <p className="mt-1.5 truncate text-sm font-medium text-[#33415c]">
                {user?.email || "No email address linked"}
              </p>
            </div>
          </div>

          {/* Account Details */}
          <div className="p-6 sm:p-8">
            <h3 className="text-lg font-extrabold tracking-tight text-[#0a1128]">
              Personal Information
            </h3>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {fields.map(({ label, value, Icon, capitalize, isStatus }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-4 transition-colors hover:border-[#1282a2]"
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#64748b]">
                    <Icon className="h-3.5 w-3.5 text-[#1282a2]" />
                    <span>{label}</span>
                  </div>

                  {isStatus && value ? (
                    <div className="mt-2.5">
                      <BookingStatusBadge status={formatLabel(value)} />
                    </div>
                  ) : (
                    <p
                      className={`mt-2 wrap-break-words text-sm font-extrabold text-[#0a1128] sm:text-base ${
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
        <div className="mt-6 flex items-start gap-3.5 rounded-2xl border border-[#1282a2]/30 bg-[#f4f7fa] p-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#d8e2eb] bg-white text-[#034078]">
            <Info className="h-4 w-4 text-[#1282a2]" />
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-[#0a1128]">
              Account Information
            </h3>

            <p className="mt-1 text-xs font-medium leading-6 text-[#33415c] sm:text-sm">
              Account details are currently read-only. Profile editing will be
              available once the corresponding backend endpoint is implemented.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={dashboardPath}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#034078] px-6 py-3 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#001f54]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>

          {user?.role === "provider" && (
            <Link
              to="/provider/profile"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-6 py-3 text-sm font-bold text-[#0a1128] transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078]"
            >
              <Briefcase className="h-4 w-4 text-[#1282a2]" />
              <span>Edit Business Profile</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
