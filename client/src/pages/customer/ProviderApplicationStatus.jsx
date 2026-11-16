import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Store,
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowUpRight,
  FileText,
  Sparkles,
  ClipboardList,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { getMyProviderApplication } from "../../services/provider.api";
import { getDashboardPathByRole } from "../../utils/authRedirect";
import { formatLabel } from "../../utils/formatters";
import BookingStatusBadge from "../../components/common/BookingStatusBadge";
import EmptyState from "../../components/common/EmptyState";
import FetchErrorBanner from "../../components/common/FetchErrorBanner";

const ProviderApplicationStatus = () => {
  const { user } = useAuth();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplication = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getMyProviderApplication();
      setProvider(response.data.data.provider);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load your application.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  const dashboardPath = getDashboardPathByRole(user?.role);

  if (loading) {
    return (
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div
          role="status"
          className="mx-auto max-w-4xl space-y-6 animate-pulse"
        >
          <div className="h-8 w-56 rounded-full bg-white/75" />
          <div className="h-80 rounded-4xl border border-white/70 bg-white/65" />
          <span className="sr-only">Loading application...</span>
        </div>
      </div>
    );
  }

  const formattedVerificationStatus =
    formatLabel(provider?.verificationStatus) || "Pending";

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bfcaff]/40 bg-white/70 px-3.5 py-1 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#a575bf]" />
            <span>Provider Application</span>
          </div>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Application Status
          </h1>

          <p className="mt-1.5 text-sm font-medium text-slate-500">
            Track the verification status of your DoorAssist provider
            application.
          </p>
        </div>

        {error ? (
          <FetchErrorBanner
            message={error}
            onRetry={fetchApplication}
            className="mt-8"
          />
        ) : !provider ? (
          <div className="mt-8">
            <EmptyState
              icon={<ClipboardList className="h-7 w-7 text-[#7c56a8]" />}
              title="No Application Found"
              message="You haven't submitted a provider application yet."
              actionLabel={
                user?.role === "customer" ? "Apply as Provider" : undefined
              }
              actionLink={
                user?.role === "customer" ? "/become-provider" : undefined
              }
            />
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {/* Application Summary Card */}
            <section className="relative overflow-hidden rounded-4xl border border-white/75 bg-white/80 p-6 shadow-[0_12px_45px_rgba(203,189,255,0.2)] backdrop-blur-2xl sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#e4a5ff]/18 blur-3xl"
              />

              <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/80 bg-linear-to-br from-[#f6ebff] via-[#f4f1ff] to-[#ebf6ff] shadow-[0_6px_20px_rgba(203,189,255,0.22)]">
                    {provider.profileImage ? (
                      <img
                        src={provider.profileImage}
                        alt={provider.businessName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Store className="h-8 w-8 text-[#7c56a8]" />
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                      {provider.businessName}
                    </h2>

                    <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 sm:text-sm">
                      <Briefcase className="h-3.5 w-3.5 text-[#7c56a8]" />
                      <span>
                        {provider.experienceYears ?? 0} years of experience
                      </span>
                    </p>
                  </div>
                </div>

                <BookingStatusBadge status={formattedVerificationStatus} />
              </div>

              {/* Business Description */}
              <div className="relative z-10 mt-7 border-t border-[#bfcaff]/30 pt-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <FileText className="h-3.5 w-3.5 text-[#7c56a8]" />
                  <span>Business Description</span>
                </div>

                <p className="mt-3 whitespace-pre-line rounded-2xl border border-[#bfcaff]/40 bg-white/65 p-4 text-sm font-medium leading-7 text-slate-700">
                  {provider.description || "No description provided."}
                </p>
              </div>

              {/* Service Areas */}
              <div className="relative z-10 mt-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-[#7c56a8]" />
                  <span>Service Areas</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {provider.serviceAreas?.map((area, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#deabff]/65 bg-linear-to-r from-[#f6ebff]/90 via-[#f4f1ff]/90 to-[#ebf6ff]/90 px-3.5 py-1.5 text-xs font-bold text-slate-800 shadow-xs"
                    >
                      <MapPin className="h-3 w-3 text-[#7c56a8]" />
                      <span>
                        {area.city}, {area.state}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Verification Result Banners */}
            {provider.verificationStatus === "pending" && (
              <section className="flex items-start gap-4 rounded-3xl border border-amber-200/80 bg-amber-50/85 p-6 shadow-xs backdrop-blur-xl">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200">
                  <Clock className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-amber-900 sm:text-lg">
                    Awaiting Admin Verification
                  </h3>

                  <p className="mt-1.5 text-sm font-medium leading-6 text-amber-800">
                    Your application has been submitted successfully. An
                    administrator will review your information shortly.
                  </p>
                </div>
              </section>
            )}

            {provider.verificationStatus === "approved" && (
              <section className="flex items-start gap-4 rounded-3xl border border-emerald-200/80 bg-emerald-50/85 p-6 shadow-xs backdrop-blur-xl">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-200">
                  <CheckCircle2 className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <h3 className="text-base font-extrabold text-emerald-900 sm:text-lg">
                    Application Approved
                  </h3>

                  <p className="mt-1.5 text-sm font-medium leading-6 text-emerald-800">
                    Your application has been approved. You can now access
                    provider features once your account session reflects the
                    provider role.
                  </p>

                  {user?.role === "provider" && (
                    <Link
                      to="/provider/dashboard"
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-[0.98]"
                    >
                      <span>Go to Provider Dashboard</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  )}

                  {user?.role === "customer" && (
                    <p className="mt-3 rounded-xl border border-emerald-200/70 bg-white/75 px-4 py-2.5 text-xs font-semibold text-emerald-900 sm:text-sm">
                      If your account was just approved, log out and log in
                      again to refresh your account role.
                    </p>
                  )}
                </div>
              </section>
            )}

            {provider.verificationStatus === "rejected" && (
              <section className="flex items-start gap-4 rounded-3xl border border-rose-200/80 bg-rose-50/85 p-6 shadow-xs backdrop-blur-xl">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 ring-1 ring-inset ring-rose-200">
                  <XCircle className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <h3 className="text-base font-extrabold text-rose-900 sm:text-lg">
                    Application Rejected
                  </h3>

                  <p className="mt-1.5 text-sm font-medium text-rose-800">
                    Your application was not approved by the verification team.
                  </p>

                  {provider.rejectionReason && (
                    <div className="mt-4 rounded-2xl border border-rose-200/80 bg-white/85 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-rose-500">
                        Rejection Reason
                      </p>

                      <p className="mt-1.5 text-sm font-semibold text-rose-800">
                        {provider.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Back Action */}
            <div className="pt-2">
              <Link
                to={dashboardPath}
                className="inline-flex items-center gap-2 rounded-xl border border-[#bfcaff]/55 bg-white/80 px-6 py-3 text-sm font-bold text-slate-700 shadow-xs backdrop-blur-md transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-900 active:scale-[0.98]"
              >
                <ArrowLeft className="h-4 w-4 text-[#7c56a8]" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderApplicationStatus;
