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
      <div className="min-h-screen bg-[#fefcfb] px-4 py-10 sm:px-6 lg:px-8">
        <div
          role="status"
          className="mx-auto max-w-4xl space-y-6 animate-pulse"
        >
          <div className="h-32 rounded-3xl border border-[#d8e2eb] bg-white" />
          <div className="h-80 rounded-3xl border border-[#d8e2eb] bg-white" />
          <span className="sr-only">Loading application...</span>
        </div>
      </div>
    );
  }

  const formattedVerificationStatus =
    formatLabel(provider?.verificationStatus) || "Pending";

  return (
    <div className="min-h-screen bg-[#fefcfb] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Page Header Card */}
        <div className="rounded-3xl border border-[#d8e2eb] bg-white p-6 shadow-xs sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-lg border border-[#d8e2eb] bg-[#f4f7fa] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#034078]">
            <span className="h-2 w-2 rounded-full bg-[#1282a2]" />
            <span>Provider Application</span>
          </div>

          <h1 className="mt-3.5 text-2xl font-extrabold tracking-tight text-[#0a1128] sm:text-3xl">
            Application Status
          </h1>

          <p className="mt-1.5 text-sm font-medium text-[#33415c]">
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
              icon={<ClipboardList className="h-7 w-7 text-[#034078]" />}
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
            <section className="rounded-3xl border border-[#d8e2eb] bg-white p-6 shadow-xs sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#d8e2eb] bg-[#f4f7fa]">
                    {provider.profileImage ? (
                      <img
                        src={provider.profileImage}
                        alt={provider.businessName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Store className="h-8 w-8 text-[#034078]" />
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight text-[#0a1128] sm:text-2xl">
                      {provider.businessName}
                    </h2>

                    <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-[#33415c] sm:text-sm">
                      <Briefcase className="h-3.5 w-3.5 text-[#1282a2]" />
                      <span>
                        {provider.experienceYears ?? 0} years of experience
                      </span>
                    </p>
                  </div>
                </div>

                <BookingStatusBadge status={formattedVerificationStatus} />
              </div>

              {/* Business Description */}
              <div className="mt-7 border-t border-[#e2e8f0] pt-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#64748b]">
                  <FileText className="h-3.5 w-3.5 text-[#1282a2]" />
                  <span>Business Description</span>
                </div>

                <p className="mt-3 whitespace-pre-line rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-4 text-sm font-medium leading-7 text-[#33415c]">
                  {provider.description || "No description provided."}
                </p>
              </div>

              {/* Service Areas */}
              <div className="mt-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#64748b]">
                  <MapPin className="h-3.5 w-3.5 text-[#1282a2]" />
                  <span>Service Areas</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {provider.serviceAreas?.map((area, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#d8e2eb] bg-[#f4f7fa] px-3.5 py-1.5 text-xs font-bold text-[#0a1128]"
                    >
                      <MapPin className="h-3.5 w-3.5 text-[#1282a2]" />
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
              <section className="flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-white text-amber-700">
                  <Clock className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-amber-950 sm:text-lg">
                    Awaiting Admin Verification
                  </h3>

                  <p className="mt-1.5 text-sm font-medium leading-6 text-amber-900">
                    Your application has been submitted successfully. An
                    administrator will review your information shortly.
                  </p>
                </div>
              </section>
            )}

            {provider.verificationStatus === "approved" && (
              <section className="flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-white text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <h3 className="text-base font-extrabold text-emerald-950 sm:text-lg">
                    Application Approved
                  </h3>

                  <p className="mt-1.5 text-sm font-medium leading-6 text-emerald-900">
                    Your application has been approved. You can now access
                    provider features once your account session reflects the
                    provider role.
                  </p>

                  {user?.role === "provider" && (
                    <Link
                      to="/provider/dashboard"
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-xs transition-colors hover:bg-emerald-700"
                    >
                      <span>Go to Provider Dashboard</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  )}

                  {user?.role === "customer" && (
                    <p className="mt-3 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-xs font-semibold text-emerald-900 sm:text-sm">
                      If your account was just approved, log out and log in
                      again to refresh your account role.
                    </p>
                  )}
                </div>
              </section>
            )}

            {provider.verificationStatus === "rejected" && (
              <section className="flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50 p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-white text-red-700">
                  <XCircle className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <h3 className="text-base font-extrabold text-red-950 sm:text-lg">
                    Application Rejected
                  </h3>

                  <p className="mt-1.5 text-sm font-medium text-red-900">
                    Your application was not approved by the verification team.
                  </p>

                  {provider.rejectionReason && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-red-700">
                        Rejection Reason
                      </p>

                      <p className="mt-1.5 text-sm font-semibold text-red-900">
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
                className="inline-flex items-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-6 py-3 text-sm font-bold text-[#0a1128] shadow-xs transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078]"
              >
                <ArrowLeft className="h-4 w-4 text-[#1282a2]" />
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
