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
      <div className="min-h-screen bg-[#fefcfb] px-4 py-10 sm:px-6 lg:px-8">
        <div
          role="status"
          className="mx-auto max-w-4xl space-y-6 animate-pulse"
        >
          <div className="h-9 w-44 rounded-xl bg-[#e2e8f0]" />
          <div className="h-96 rounded-3xl border border-[#d8e2eb] bg-white" />
          <span className="sr-only">Loading booking details...</span>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#fefcfb] px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-[#d8e2eb] bg-white p-8 text-center shadow-xs sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-600">
            <AlertCircle className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-2xl font-extrabold text-[#0a1128]">
            Booking Unavailable
          </h1>

          <p role="alert" className="mt-3 text-sm font-medium text-[#33415c]">
            {error || "Booking not found."}
          </p>

          <Link
            to="/bookings"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#034078] px-6 py-3 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#001f54]"
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
    <div className="min-h-screen bg-[#fefcfb] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/bookings"
          className="inline-flex items-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-4 py-2.5 text-xs font-bold text-[#0a1128] shadow-xs transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078] sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4 text-[#1282a2]" />
          <span>Back to My Bookings</span>
        </Link>

        {/* Main Details Card */}
        <div className="mt-6 rounded-3xl border border-[#d8e2eb] bg-white p-6 shadow-xs sm:p-9">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#d8e2eb] bg-[#f4f7fa] px-3 py-1 font-mono text-xs font-bold text-[#034078]">
                <Receipt className="h-3.5 w-3.5 text-[#1282a2]" />
                <span>ID: {booking._id}</span>
              </div>

              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[#0a1128] sm:text-3xl">
                {booking.serviceName ||
                  booking.serviceId?.name ||
                  "Service Booking"}
              </h1>
            </div>

            <BookingStatusBadge status={booking.status} size="md" />
          </div>

          {/* Booking Information Grid */}
          <div className="mt-8 grid gap-4 border-t border-[#e2e8f0] pt-7 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#64748b]">
                <Calendar className="h-3.5 w-3.5 text-[#1282a2]" />
                <span>Scheduled Date & Time</span>
              </div>
              <p className="mt-2 text-sm font-extrabold text-[#0a1128] sm:text-base">
                {formatDateTime(booking.scheduledAt)}
              </p>
            </div>

            <div className="rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#64748b]">
                <IndianRupee className="h-3.5 w-3.5 text-[#1282a2]" />
                <span>Service Price</span>
              </div>
              <p className="mt-2 text-sm font-extrabold text-[#0a1128] sm:text-base">
                {booking.price != null
                  ? formatCurrency(booking.price)
                  : "Not available"}
              </p>
            </div>

            <div className="rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#64748b]">
                <Clock className="h-3.5 w-3.5 text-[#1282a2]" />
                <span>Service Duration</span>
              </div>
              <p className="mt-2 text-sm font-extrabold text-[#0a1128] sm:text-base">
                {booking.durationMinutes != null
                  ? `${booking.durationMinutes} minutes`
                  : "Not available"}
              </p>
            </div>

            <div className="rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#64748b]">
                <Calendar className="h-3.5 w-3.5 text-[#1282a2]" />
                <span>Booking Created</span>
              </div>
              <p className="mt-2 text-sm font-extrabold text-[#0a1128] sm:text-base">
                {formatDateTime(booking.createdAt)}
              </p>
            </div>
          </div>

          {/* Service Address */}
          <div className="mt-8 border-t border-[#e2e8f0] pt-7">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]">
                <MapPin className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-extrabold text-[#0a1128]">
                Service Address
              </h2>
            </div>

            <div className="mt-4 rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-4 text-sm font-medium leading-7 text-[#33415c]">
              <p className="font-semibold text-[#0a1128]">
                {address?.addressLine || "Address unavailable"}
              </p>
              <p>
                {[address?.city, address?.state].filter(Boolean).join(", ")}
              </p>
              {address?.pincode && (
                <p className="mt-0.5 font-mono text-xs font-bold text-[#034078]">
                  PIN: {address.pincode}
                </p>
              )}
            </div>
          </div>

          {/* Customer Note */}
          {booking.customerNote && (
            <div className="mt-8 border-t border-[#e2e8f0] pt-7">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]">
                  <FileText className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-extrabold text-[#0a1128]">
                  Additional Instructions
                </h2>
              </div>

              <p className="mt-4 whitespace-pre-line rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-4 text-sm font-medium leading-7 text-[#33415c]">
                {booking.customerNote}
              </p>
            </div>
          )}

          {/* Cancellation Details */}
          {booking.status === "cancelled" && booking.cancellationReason && (
            <div className="mt-8 border-t border-[#e2e8f0] pt-7">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-700">
                  <XCircle className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-extrabold text-[#0a1128]">
                  Cancellation Reason
                </h2>
              </div>

              <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium leading-7 text-red-800">
                {booking.cancellationReason}
              </p>
            </div>
          )}

          {/* Cancel Booking */}
          {canCancel && (
            <div className="mt-8 border-t border-[#e2e8f0] pt-7">
              {!showCancelForm ? (
                <button
                  type="button"
                  onClick={() => setShowCancelForm(true)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-700 transition-colors hover:border-red-300 hover:bg-red-100"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Cancel Booking</span>
                </button>
              ) : (
                <form
                  onSubmit={handleCancel}
                  className="rounded-2xl border border-red-200 bg-red-50 p-5 sm:p-6"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-white text-red-600">
                      <XCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#0a1128] sm:text-lg">
                        Cancel This Booking?
                      </h3>
                      <p className="mt-1 text-xs font-medium text-[#33415c] sm:text-sm">
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
                    className="mt-4 w-full rounded-xl border border-red-200 bg-white p-3.5 text-sm font-medium text-[#0a1128] placeholder:text-[#64748b] outline-none transition-all focus:border-red-500 focus:ring-3 focus:ring-red-100"
                  />

                  <p className="mt-1.5 text-right text-xs font-semibold text-[#64748b]">
                    {cancellationReason.length}/500
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={cancelling}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-red-700 disabled:pointer-events-none disabled:opacity-60"
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
                      className="cursor-pointer rounded-xl border border-[#cbd5e1] bg-white px-5 py-2.5 text-sm font-bold text-[#0a1128] transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] disabled:opacity-50"
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
