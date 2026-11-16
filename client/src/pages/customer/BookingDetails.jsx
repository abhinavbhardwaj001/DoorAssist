import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  IndianRupee,
  MapPin,
  FileText,
  AlertCircle,
  XCircle,
  Loader2,
  Receipt,
} from "lucide-react";
import ReviewForm from "../../components/reviews/ReviewForm";
import BookingPayment from "../../components/payments/BookingPayment";
import BookingStatusBadge from "../../components/common/BookingStatusBadge";
import { getBookingById, cancelBooking } from "../../services/booking.api";
import { useNotification } from "../../context/NotificationContext";
import { formatCurrency, formatDateTime } from "../../utils/formatters";

const BookingDetails = () => {
  const { bookingId } = useParams();
  const { showNotification } = useNotification();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchBooking = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getBookingById(bookingId);

        if (active) {
          setBooking(response.data.data.booking);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message || "Unable to fetch booking details.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchBooking();

    return () => {
      active = false;
    };
  }, [bookingId]);

  const refreshBooking = async () => {
    const response = await getBookingById(bookingId);
    setBooking(response.data.data.booking);
  };

  const handleCancel = async (e) => {
    e.preventDefault();

    const reason = cancellationReason.trim();

    if (reason.length < 5 || reason.length > 500) {
      showNotification(
        "Cancellation reason must be between 5 and 500 characters.",
        "error",
      );
      return;
    }

    if (cancelling) return;

    setCancelling(true);

    try {
      const response = await cancelBooking(bookingId, reason);

      setBooking(response.data.data.booking);
      showNotification("Booking cancelled successfully.", "success");
      setShowCancelForm(false);
      setCancellationReason("");
    } catch (err) {
      showNotification(
        err.response?.data?.message ||
          "Unable to cancel booking. Please try again.",
        "error",
      );
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div
          role="status"
          className="mx-auto max-w-4xl space-y-6 animate-pulse"
        >
          <div className="h-5 w-36 rounded-full bg-white/75" />
          <div className="h-96 rounded-4xl border border-white/70 bg-white/70" />
          <span className="sr-only">Loading booking details...</span>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-4xl border border-white/75 bg-white/80 p-8 text-center shadow-[0_12px_45px_rgba(203,189,255,0.2)] backdrop-blur-2xl sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100/80 text-rose-600 ring-1 ring-inset ring-rose-200/80">
            <AlertCircle className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-2xl font-extrabold text-slate-900">
            Booking Unavailable
          </h1>

          <p role="alert" className="mt-3 text-sm font-medium text-slate-500">
            {error || "Booking not found."}
          </p>

          <Link
            to="/bookings"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-6 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:brightness-105"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to My Bookings</span>
          </Link>
        </div>
      </div>
    );
  }

  const canCancel = ["pending", "accepted"].includes(booking.status);
  const address = booking.address;

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/bookings"
          className="inline-flex items-center gap-2 rounded-full border border-[#bfcaff]/45 bg-white/70 px-4 py-2 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-md transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-900 sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4 text-[#7c56a8]" />
          <span>Back to My Bookings</span>
        </Link>

        {/* Main Details Card */}
        <div className="relative mt-6 overflow-hidden rounded-4xl border border-white/75 bg-white/80 p-6 shadow-[0_12px_45px_rgba(203,189,255,0.2)] backdrop-blur-2xl sm:p-9">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#e4a5ff]/15 blur-3xl"
          />

          {/* Header */}
          <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bfcaff]/45 bg-white/75 px-3 py-1 font-mono text-xs font-semibold text-slate-500">
                <Receipt className="h-3.5 w-3.5 text-[#7c56a8]" />
                <span>ID: {booking._id}</span>
              </div>

              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {booking.serviceName ||
                  booking.serviceId?.name ||
                  "Service Booking"}
              </h1>
            </div>

            <BookingStatusBadge status={booking.status} size="md" />
          </div>

          {/* Booking Information Grid */}
          <div className="relative z-10 mt-8 grid gap-4 border-t border-[#bfcaff]/30 pt-7 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#bfcaff]/40 bg-white/65 p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Calendar className="h-3.5 w-3.5 text-[#7c56a8]" />
                <span>Scheduled Date & Time</span>
              </div>
              <p className="mt-2 text-sm font-extrabold text-slate-900 sm:text-base">
                {formatDateTime(booking.scheduledAt)}
              </p>
            </div>

            <div className="rounded-2xl border border-[#bfcaff]/40 bg-white/65 p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <IndianRupee className="h-3.5 w-3.5 text-[#7c56a8]" />
                <span>Service Price</span>
              </div>
              <p className="mt-2 text-sm font-extrabold text-slate-900 sm:text-base">
                {booking.price != null
                  ? formatCurrency(booking.price)
                  : "Not available"}
              </p>
            </div>

            <div className="rounded-2xl border border-[#bfcaff]/40 bg-white/65 p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Clock className="h-3.5 w-3.5 text-[#7c56a8]" />
                <span>Service Duration</span>
              </div>
              <p className="mt-2 text-sm font-extrabold text-slate-900 sm:text-base">
                {booking.durationMinutes != null
                  ? `${booking.durationMinutes} minutes`
                  : "Not available"}
              </p>
            </div>

            <div className="rounded-2xl border border-[#bfcaff]/40 bg-white/65 p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Calendar className="h-3.5 w-3.5 text-[#7c56a8]" />
                <span>Booking Created</span>
              </div>
              <p className="mt-2 text-sm font-extrabold text-slate-900 sm:text-base">
                {formatDateTime(booking.createdAt)}
              </p>
            </div>
          </div>

          {/* Service Address */}
          <div className="relative z-10 mt-8 border-t border-[#bfcaff]/30 pt-7">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-[#7c56a8] ring-1 ring-inset ring-[#deabff]/60">
                <MapPin className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Service Address
              </h2>
            </div>

            <div className="mt-4 rounded-2xl border border-[#bfcaff]/40 bg-white/65 p-4 text-sm font-medium leading-7 text-slate-700">
              <p>{address?.addressLine || "Address unavailable"}</p>
              <p>
                {[address?.city, address?.state].filter(Boolean).join(", ")}
              </p>
              {address?.pincode && (
                <p className="font-mono text-xs font-bold text-slate-500">
                  PIN: {address.pincode}
                </p>
              )}
            </div>
          </div>

          {/* Customer Note */}
          {booking.customerNote && (
            <div className="relative z-10 mt-8 border-t border-[#bfcaff]/30 pt-7">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-[#7c56a8] ring-1 ring-inset ring-[#deabff]/60">
                  <FileText className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Additional Instructions
                </h2>
              </div>

              <p className="mt-4 whitespace-pre-line rounded-2xl border border-[#bfcaff]/40 bg-white/65 p-4 text-sm font-medium leading-7 text-slate-700">
                {booking.customerNote}
              </p>
            </div>
          )}

          {/* Cancellation Details */}
          {booking.status === "cancelled" && booking.cancellationReason && (
            <div className="relative z-10 mt-8 border-t border-[#bfcaff]/30 pt-7">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100/80 text-red-600 ring-1 ring-inset ring-red-200/80">
                  <XCircle className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Cancellation Reason
                </h2>
              </div>

              <p className="mt-4 rounded-2xl border border-red-200/70 bg-red-50/60 p-4 text-sm font-medium leading-7 text-red-800">
                {booking.cancellationReason}
              </p>
            </div>
          )}

          {/* Cancel Booking */}
          {canCancel && (
            <div className="relative z-10 mt-8 border-t border-[#bfcaff]/30 pt-7">
              {!showCancelForm ? (
                <button
                  type="button"
                  onClick={() => setShowCancelForm(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200/90 bg-red-50/75 px-5 py-3 text-sm font-bold text-red-600 shadow-xs transition-all hover:border-red-300 hover:bg-red-100/80 hover:text-red-700 active:scale-[0.98]"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Cancel Booking</span>
                </button>
              ) : (
                <form
                  onSubmit={handleCancel}
                  className="rounded-3xl border border-red-200/80 bg-red-50/65 p-5 shadow-xs backdrop-blur-md sm:p-6"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                      <XCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 sm:text-lg">
                        Cancel This Booking?
                      </h3>
                      <p className="mt-1 text-xs font-medium text-slate-600 sm:text-sm">
                        Please provide a reason for cancellation (5–500
                        characters).
                      </p>
                    </div>
                  </div>

                  <textarea
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    minLength={5}
                    maxLength={500}
                    rows={4}
                    required
                    placeholder="Enter cancellation reason..."
                    className="mt-4 w-full rounded-2xl border border-red-200/90 bg-white/90 p-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 shadow-xs outline-none transition-all focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100"
                  />

                  <p className="mt-1.5 text-right text-xs font-semibold text-slate-500">
                    {cancellationReason.length}/500
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={cancelling}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-red-600/20 transition-all hover:bg-red-700 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
                    >
                      {cancelling && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      <span>
                        {cancelling ? "Cancelling..." : "Confirm Cancellation"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowCancelForm(false);
                        setCancellationReason("");
                      }}
                      disabled={cancelling}
                      className="rounded-xl border border-[#bfcaff]/50 bg-white/85 px-5 py-2.5 text-sm font-bold text-slate-700 transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-900 disabled:opacity-50"
                    >
                      Keep Booking
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Booking Payment */}
        {[
          "accepted",
          "payment_pending",
          "confirmed",
          "in_progress",
          "completed",
        ].includes(booking.status) && (
          <div className="mt-8">
            <BookingPayment
              key={booking._id}
              booking={booking}
              onPaymentUpdated={refreshBooking}
            />
          </div>
        )}

        {/* Customer Review */}
        {booking.status === "completed" && (
          <div className="mt-8">
            <ReviewForm key={booking._id} bookingId={booking._id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetails;
