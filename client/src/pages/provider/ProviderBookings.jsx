import { useCallback, useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  IndianRupee,
  MapPin,
  User,
  RefreshCw,
  Check,
  X,
  Play,
  CheckCircle2,
  ClipboardList,
  MessageSquare,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  getProviderBookings,
  acceptBooking,
  rejectBooking,
  startBooking,
  completeBooking,
} from "../../services/booking.api";
import { useNotification } from "../../context/NotificationContext";
import {
  formatCurrency,
  formatDateTime,
  formatLabel,
} from "../../utils/formatters";
import FilterTabs from "../../components/common/FilterTabs";
import BookingStatusBadge from "../../components/common/BookingStatusBadge";
import EmptyState from "../../components/common/EmptyState";
import FetchErrorBanner from "../../components/common/FetchErrorBanner";

const FILTERS = [
  "all",
  "pending",
  "accepted",
  "payment_pending",
  "confirmed",
  "in_progress",
  "completed",
  "rejected",
  "cancelled",
];

const ProviderBookings = () => {
  const { showNotification } = useNotification();

  const [bookings, setBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [fetchError, setFetchError] = useState("");

  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setFetchError("");

    try {
      const response = await getProviderBookings();
      setBookings(response.data.data.bookings || []);
    } catch (err) {
      setFetchError(
        err.response?.data?.message || "Unable to load provider bookings.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleAction = async (bookingId, action, reason = "") => {
    if (actionId) return;

    setActionId(bookingId);

    try {
      let response;

      switch (action) {
        case "accept":
          response = await acceptBooking(bookingId);
          break;
        case "reject":
          response = await rejectBooking(bookingId, reason);
          break;
        case "start":
          response = await startBooking(bookingId);
          break;
        case "complete":
          response = await completeBooking(bookingId);
          break;
        default:
          return;
      }

      if (response.data?.data?.booking) {
        const updatedBooking = response.data.data.booking;

        setBookings((prev) =>
          prev.map((booking) =>
            booking._id === bookingId
              ? { ...booking, ...updatedBooking }
              : booking,
          ),
        );
      }

      await fetchBookings();

      showNotification(
        response.data?.message || "Booking updated successfully.",
        "success",
      );

      setRejectingId(null);
      setRejectionReason("");
    } catch (err) {
      showNotification(
        err.response?.data?.message ||
          "Unable to update booking. Please try again.",
        "error",
      );
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();

    const reason = rejectionReason.trim();

    if (!reason) {
      showNotification("Please provide a rejection reason.", "error");
      return;
    }

    await handleAction(rejectingId, "reject", reason);
  };

  const filteredBookings =
    activeFilter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === activeFilter);

  const filterOptions = FILTERS.map((status) => {
    const count =
      status === "all"
        ? bookings.length
        : bookings.filter((b) => b.status === status).length;

    return {
      value: status,
      label: `${formatLabel(status)} (${count})`,
    };
  });

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bfcaff]/40 bg-white/70 px-3.5 py-1 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#a575bf]" />
              <span>Provider Portal</span>
            </div>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Manage Bookings
            </h1>

            <p className="mt-1.5 text-sm font-medium text-slate-500">
              Review customer requests and manage service appointments.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchBookings}
            disabled={loading || Boolean(actionId)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#bfcaff]/55 bg-white/80 px-5 py-2.5 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-md transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-900 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 sm:text-sm"
          >
            <RefreshCw
              className={`h-4 w-4 text-[#7c56a8] ${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>

        {/* Status Filters */}
        <FilterTabs
          options={filterOptions}
          value={activeFilter}
          onChange={setActiveFilter}
          className="mt-7"
        />

        {/* Bookings List */}
        {loading ? (
          <div role="status" className="mt-6 space-y-4 animate-pulse">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-44 rounded-3xl border border-white/70 bg-white/65"
              />
            ))}
            <span className="sr-only">Loading provider bookings...</span>
          </div>
        ) : fetchError ? (
          <FetchErrorBanner
            message={fetchError}
            onRetry={fetchBookings}
            className="mt-6"
          />
        ) : filteredBookings.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={<ClipboardList className="h-7 w-7 text-[#7c56a8]" />}
              title="No bookings found"
              message={
                activeFilter === "all"
                  ? "Customer booking requests will appear here."
                  : `No ${formatLabel(activeFilter).toLowerCase()} bookings available.`
              }
              actionLabel={
                activeFilter !== "all" ? "Show All Bookings" : undefined
              }
              onAction={
                activeFilter !== "all"
                  ? () => setActiveFilter("all")
                  : undefined
              }
            />
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filteredBookings.map((booking) => {
              const busy = actionId === booking._id;
              const formattedAddress =
                [
                  booking.address?.addressLine,
                  booking.address?.city,
                  booking.address?.state,
                  booking.address?.pincode,
                ]
                  .filter(Boolean)
                  .join(", ") || "Address not available";

              const hasActions = [
                "pending",
                "accepted",
                "confirmed",
                "in_progress",
              ].includes(booking.status);

              return (
                <article
                  key={booking._id}
                  className="rounded-3xl border border-white/75 bg-white/80 p-5 shadow-[0_8px_30px_rgba(203,189,255,0.14)] backdrop-blur-2xl transition-all hover:border-[#deabff]/60 sm:p-6"
                >
                  {/* Top Row: Title, ID, Status & Action Buttons */}
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h2 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                          {booking.serviceName ||
                            booking.serviceId?.name ||
                            "Home Service"}
                        </h2>

                        <BookingStatusBadge status={booking.status} />
                      </div>

                      <p className="mt-1 font-mono text-[11px] font-semibold text-slate-400">
                        ID: {booking._id}
                      </p>
                    </div>

                    {/* Inline Action Controls */}
                    {hasActions && (
                      <div className="flex flex-wrap items-center gap-2">
                        {booking.status === "pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                handleAction(booking._id, "accept")
                              }
                              disabled={Boolean(actionId)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
                            >
                              {busy ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Check className="h-3.5 w-3.5" />
                              )}
                              <span>{busy ? "Processing..." : "Accept"}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setRejectingId(booking._id);
                                setRejectionReason("");
                              }}
                              disabled={Boolean(actionId)}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200/90 bg-red-50/75 px-4 py-2 text-xs font-bold text-red-600 transition-all hover:border-red-300 hover:bg-red-100/80 active:scale-95 disabled:opacity-50"
                            >
                              <X className="h-3.5 w-3.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}

                        {["accepted", "confirmed"].includes(booking.status) && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleAction(booking._id, "start")}
                              disabled={Boolean(actionId)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-4 py-2 text-xs font-bold text-slate-900 shadow-sm shadow-[#cbbdff]/30 transition-all hover:brightness-105 active:scale-95 disabled:opacity-50"
                            >
                              {busy ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Play className="h-3.5 w-3.5" />
                              )}
                              <span>
                                {busy ? "Processing..." : "Start Service"}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleAction(booking._id, "complete")
                              }
                              disabled={Boolean(actionId)}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200/90 bg-emerald-50/75 px-4 py-2 text-xs font-bold text-emerald-700 transition-all hover:border-emerald-300 hover:bg-emerald-100/80 active:scale-95 disabled:opacity-50"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Complete</span>
                            </button>
                          </>
                        )}

                        {booking.status === "in_progress" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleAction(booking._id, "complete")
                            }
                            disabled={Boolean(actionId)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
                          >
                            {busy ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            )}
                            <span>
                              {busy ? "Processing..." : "Mark Completed"}
                            </span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Compact Metadata Strip */}
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#bfcaff]/25 pt-4 text-xs font-semibold text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-[#7c56a8]" />
                      <span className="font-bold text-slate-800">
                        {booking.customerId?.name || "Customer"}
                      </span>
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[#7c56a8]" />
                      <span>{formatDateTime(booking.scheduledAt)}</span>
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <IndianRupee className="h-3.5 w-3.5 text-[#7c56a8]" />
                      <span className="font-bold text-slate-800">
                        {booking.price != null
                          ? formatCurrency(booking.price)
                          : "N/A"}
                      </span>
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#7c56a8]" />
                      <span>{booking.durationMinutes} mins</span>
                    </span>
                  </div>

                  {/* Address Line */}
                  <p className="mt-2.5 flex items-start gap-1.5 text-xs font-medium text-slate-600">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#7c56a8]" />
                    <span>{formattedAddress}</span>
                  </p>

                  {/* Customer Note */}
                  {booking.customerNote && (
                    <div className="mt-3 flex items-start gap-2 rounded-2xl border border-[#bfcaff]/40 bg-white/65 px-3.5 py-2.5 text-xs font-medium text-slate-700">
                      <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#7c56a8]" />
                      <p className="whitespace-pre-line leading-5">
                        <span className="font-bold text-slate-800">Note: </span>
                        {booking.customerNote}
                      </p>
                    </div>
                  )}

                  {/* Rejection / Cancellation Reasons */}
                  {booking.rejectionReason && (
                    <p className="mt-3 rounded-xl border border-red-200/70 bg-red-50/70 px-3.5 py-2 text-xs font-semibold text-red-700">
                      Rejection reason: {booking.rejectionReason}
                    </p>
                  )}

                  {booking.cancellationReason && (
                    <p className="mt-3 rounded-xl border border-slate-200/80 bg-slate-100/75 px-3.5 py-2 text-xs font-semibold text-slate-600">
                      Cancellation reason: {booking.cancellationReason}
                    </p>
                  )}

                  {/* Inline Reject Form */}
                  {rejectingId === booking._id && (
                    <form
                      onSubmit={handleReject}
                      className="mt-4 rounded-2xl border border-red-200/80 bg-red-50/70 p-4 backdrop-blur-md"
                    >
                      <label
                        htmlFor={`reject-${booking._id}`}
                        className="block text-xs font-extrabold uppercase tracking-wider text-red-900"
                      >
                        Reason for rejection
                      </label>

                      <textarea
                        id={`reject-${booking._id}`}
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Explain why you cannot accept this booking..."
                        rows={2}
                        required
                        className="mt-2 w-full rounded-xl border border-red-200/90 bg-white/90 p-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 sm:text-sm"
                      />

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="submit"
                          disabled={Boolean(actionId)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-red-600/20 hover:bg-red-700 disabled:opacity-50"
                        >
                          {busy && (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          )}
                          <span>
                            {busy ? "Rejecting..." : "Confirm Rejection"}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setRejectingId(null);
                            setRejectionReason("");
                          }}
                          disabled={Boolean(actionId)}
                          className="rounded-xl border border-[#bfcaff]/50 bg-white/85 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderBookings;
