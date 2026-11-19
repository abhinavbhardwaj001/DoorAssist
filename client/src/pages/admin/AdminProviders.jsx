import { useEffect, useState } from "react";
import {
  RefreshCw,
  Store,
  Mail,
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  ClipboardList,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  getProviderApplications,
  approveProviderApplication,
  rejectProviderApplication,
} from "../../services/admin.api";
import { useNotification } from "../../context/NotificationContext";
import { formatDate } from "../../utils/formatters";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import FetchErrorBanner from "../../components/common/FetchErrorBanner";
import SearchBar from "../../components/common/SearchBar";
import StatusBadge from "../../components/common/BookingStatusBadge";
import ModalDialog from "../../components/common/ModalDialog";
import Pagination from "../../components/common/Pagination";

const AdminProviders = () => {
  const { showNotification } = useNotification();

  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
  });

  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [fetchError, setFetchError] = useState("");

  const [selectedProvider, setSelectedProvider] = useState(null);
  const [action, setAction] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    let active = true;

    const fetchApplications = async () => {
      setLoading(true);
      setFetchError("");

      try {
        const response = await getProviderApplications({
          page,
          limit: 10,
          ...(filter !== "all" && { status: filter }),
          ...(search && { search }),
        });

        if (!active) return;

        const result = response.data.data;

        setApplications(result.providers);

        const meta = result.pagination || {};

        setPagination({
          total:
            meta.totalApplications ?? meta.totalProviders ?? meta.total ?? 0,
          totalPages: Math.max(1, meta.totalPages ?? 1),
        });
      } catch (err) {
        if (active) {
          setFetchError(
            err.response?.data?.message ||
              "Unable to load provider applications.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchApplications();

    return () => {
      active = false;
    };
  }, [page, filter, search, reloadKey]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleRefresh = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
    setReloadKey((prev) => prev + 1);
  };

  const changeFilter = (value) => {
    setFilter(value);
    setPage(1);
  };

  const openDialog = (provider, selectedAction) => {
    setSelectedProvider(provider);
    setAction(selectedAction);
    setRejectionReason("");
  };

  const closeDialog = () => {
    if (processingId) return;

    setSelectedProvider(null);
    setAction("");
    setRejectionReason("");
  };

  const handleConfirm = async (e) => {
    e.preventDefault();

    if (!selectedProvider || processingId) return;

    const providerId = selectedProvider._id;
    const reason = rejectionReason.trim();

    if (action === "reject" && (reason.length < 3 || reason.length > 500)) {
      showNotification(
        "Rejection reason must be between 3 and 500 characters.",
        "error",
      );
      return;
    }

    setProcessingId(providerId);

    try {
      const response =
        action === "approve"
          ? await approveProviderApplication(providerId)
          : await rejectProviderApplication(providerId, reason);

      showNotification(
        response.data.message ||
          (action === "approve"
            ? "Provider application approved successfully."
            : "Provider application rejected."),
        "success",
      );

      setSelectedProvider(null);
      setAction("");
      setRejectionReason("");

      setReloadKey((prev) => prev + 1);
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Unable to update provider application.",
        "error",
      );
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fefcfb] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader
          title="Provider Applications"
          subtitle="Review business profiles and approve or reject provider applications."
          action={
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading || Boolean(processingId)}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-5 py-3 text-sm font-bold text-[#0a1128] shadow-xs transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078] disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
            >
              <RefreshCw
                className={`h-4 w-4 text-[#1282a2] ${loading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
          }
        />

        {/* Search & Filter Controls */}
        <div className="mt-7 space-y-4">
          <div className="rounded-2xl border border-[#d8e2eb] bg-white p-4 shadow-xs sm:p-5">
            <SearchBar
              value={searchInput}
              onChange={setSearchInput}
              onSubmit={handleSearch}
              placeholder="Search by business name, owner, or email..."
              ariaLabel="Search provider applications"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {["pending", "approved", "rejected", "all"].map((status) => {
                const isActive = filter === status;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => changeFilter(status)}
                    aria-pressed={isActive}
                    className={`cursor-pointer rounded-xl px-4 py-2 text-xs font-bold capitalize transition-colors sm:px-5 sm:text-sm ${
                      isActive
                        ? "bg-[#034078] text-white"
                        : "border border-[#d8e2eb] bg-white text-[#33415c] hover:border-[#034078] hover:text-[#0a1128]"
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>

            <span className="rounded-lg border border-[#d8e2eb] bg-white px-3.5 py-1.5 text-xs font-bold text-[#034078] shadow-xs">
              {loading
                ? "Loading..."
                : `${pagination.total} matching ${
                    pagination.total === 1 ? "application" : "applications"
                  }`}
            </span>
          </div>
        </div>

        <FetchErrorBanner
          message={fetchError}
          onRetry={() => setReloadKey((prev) => prev + 1)}
        />

        {/* Compact Application Cards */}
        {loading ? (
          <div role="status" className="mt-5 space-y-3.5 animate-pulse">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-44 rounded-2xl border border-[#d8e2eb] bg-white"
              />
            ))}
            <span className="sr-only">Loading provider applications...</span>
          </div>
        ) : applications.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-[#d8e2eb] bg-white px-6 py-14 text-center shadow-xs">
            <div className="mx-auto flex max-w-md flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]">
                <ClipboardList className="h-5 w-5" />
              </div>

              <h3 className="mt-3.5 text-base font-extrabold text-[#0a1128] sm:text-lg">
                No applications found
              </h3>

              <p className="mt-1.5 text-xs font-medium leading-relaxed text-[#33415c] sm:text-sm">
                No provider applications match your current filters.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-3.5">
            {applications.map((provider) => (
              <article
                key={provider._id}
                className="rounded-2xl border border-[#d8e2eb] bg-white p-4 shadow-xs transition-colors hover:border-[#1282a2] sm:p-5"
              >
                {/* Top Row: Avatar, Business Info, Metadata & Status */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-13 w-13 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#d8e2eb] bg-[#f4f7fa] sm:h-14 sm:w-14">
                      {provider.profileImage ? (
                        <img
                          src={provider.profileImage}
                          alt={provider.businessName}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Store className="h-6 w-6 text-[#034078]" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-extrabold tracking-tight text-[#0a1128] sm:text-lg">
                          {provider.businessName}
                        </h3>
                        <span className="text-xs font-semibold text-[#64748b]">
                          •
                        </span>
                        <span className="text-xs font-bold text-[#034078] sm:text-sm">
                          {provider.userId?.name || "Provider Applicant"}
                        </span>
                      </div>

                      {/* Inline Metadata Strip */}
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-[#33415c]">
                        {provider.userId?.email && (
                          <span className="inline-flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 shrink-0 text-[#1282a2]" />
                            <span className="truncate">
                              {provider.userId.email}
                            </span>
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5 shrink-0 text-[#1282a2]" />
                          <span>
                            {provider.experienceYears != null
                              ? `${provider.experienceYears} ${
                                  provider.experienceYears === 1 ? "yr" : "yrs"
                                } exp`
                              : "No exp listed"}
                          </span>
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 shrink-0 text-[#034078]" />
                          <span>Applied {formatDate(provider.createdAt)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <StatusBadge
                    status={provider.verificationStatus}
                    className="self-start"
                  />
                </div>

                {/* Compact Description */}
                {provider.description && (
                  <p className="mt-3 line-clamp-2 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3.5 py-2.5 text-xs font-medium leading-5 text-[#33415c] sm:text-sm">
                    {provider.description}
                  </p>
                )}

                {provider.rejectionReason && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-700">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600" />
                    <span>Rejection reason: {provider.rejectionReason}</span>
                  </div>
                )}

                {/* Bottom Row: Service Areas & Pending Actions */}
                <div className="mt-3.5 flex flex-col justify-between gap-3 border-t border-[#e2e8f0] pt-3.5 sm:flex-row sm:items-center">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {provider.serviceAreas?.length ? (
                      provider.serviceAreas.map((area, index) => (
                        <span
                          key={`${area.city}-${area.state}-${index}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#d8e2eb] bg-[#f4f7fa] px-2.5 py-1 text-[11px] font-bold text-[#0a1128]"
                        >
                          <MapPin className="h-3 w-3 text-[#1282a2]" />
                          <span>
                            {area.city}, {area.state}
                          </span>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs font-medium text-[#64748b]">
                        No service areas listed
                      </span>
                    )}
                  </div>

                  {provider.verificationStatus === "pending" && (
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openDialog(provider, "approve")}
                        disabled={Boolean(processingId)}
                        className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-emerald-700 disabled:pointer-events-none disabled:opacity-50 sm:flex-initial"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openDialog(provider, "reject")}
                        disabled={Boolean(processingId)}
                        className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-700 transition-colors hover:border-red-300 hover:bg-red-100 disabled:pointer-events-none disabled:opacity-50 sm:flex-initial"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && (
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
            loading={loading}
            className="mt-7 flex flex-wrap items-center justify-end gap-4"
          />
        )}
      </div>

      {/* Confirmation Modal */}
      <ModalDialog
        open={Boolean(selectedProvider)}
        onClose={closeDialog}
        onSubmit={handleConfirm}
        disabled={Boolean(processingId)}
        titleId="provider-dialog-title"
        title={action === "approve" ? "Approve Provider" : "Reject Provider"}
        icon={action === "approve" ? CheckCircle2 : XCircle}
        iconBadgeClass={
          action === "approve"
            ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border border-red-200 bg-red-50 text-red-700"
        }
        footer={
          <>
            <button
              type="button"
              onClick={closeDialog}
              disabled={Boolean(processingId)}
              className="cursor-pointer rounded-xl border border-[#cbd5e1] bg-white px-5 py-2.5 text-sm font-bold text-[#0a1128] transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={Boolean(processingId)}
              className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-xs transition-colors disabled:pointer-events-none disabled:opacity-55 ${
                action === "approve"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {processingId && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>
                {processingId
                  ? "Processing..."
                  : action === "approve"
                    ? "Confirm Approval"
                    : "Confirm Rejection"}
              </span>
            </button>
          </>
        }
      >
        <p className="text-sm font-medium leading-6 text-[#33415c]">
          {action === "approve"
            ? `Approve ${selectedProvider?.businessName} as a DoorAssist service provider?`
            : `Reject the application submitted by ${selectedProvider?.businessName}?`}
        </p>

        {action === "reject" && (
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="rejectionReason"
                className="text-xs font-bold uppercase tracking-wider text-[#0a1128]"
              >
                Rejection Reason <span className="text-red-600">*</span>
              </label>
              <span className="text-xs font-semibold text-[#64748b]">
                {rejectionReason.length}/500
              </span>
            </div>

            <textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Explain why the application is being rejected..."
              rows={4}
              minLength={3}
              maxLength={500}
              required
              className="mt-2 w-full rounded-xl border border-[#cbd5e1] bg-[#fefcfb] p-3.5 text-sm font-medium text-[#0a1128] placeholder:text-[#64748b] transition-all outline-none focus:border-red-500 focus:bg-white focus:ring-3 focus:ring-red-100"
            />
          </div>
        )}
      </ModalDialog>
    </div>
  );
};

export default AdminProviders;
