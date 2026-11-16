import { useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  ShieldAlert,
  Loader2,
  XCircle,
} from "lucide-react";
import { initiatePayment, simulatePayment } from "../../services/payment.api";
import { useNotification } from "../../context/NotificationContext";

const BookingPayment = ({ booking, onPaymentUpdated }) => {
  const { showNotification } = useNotification();

  const [processing, setProcessing] = useState(false);
  const [paymentPending, setPaymentPending] = useState(
    booking.status === "payment_pending",
  );

  const handleInitiate = async () => {
    if (processing) return;

    setProcessing(true);

    try {
      await initiatePayment(booking._id);
      setPaymentPending(true);
      showNotification(
        "Payment initiated. Select a simulation outcome.",
        "info",
      );
      await onPaymentUpdated?.();
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Unable to initiate payment.",
        "error",
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleSimulate = async (outcome) => {
    if (processing) return;

    setProcessing(true);

    try {
      const response = await simulatePayment(booking._id, {
        outcome,
      });

      setPaymentPending(false);
      showNotification(
        response.data.message ||
          (outcome === "success"
            ? "Payment simulated successfully."
            : "Simulated payment failed."),
        outcome === "success" ? "success" : "error",
      );
      await onPaymentUpdated?.();
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Unable to process simulated payment.",
        "error",
      );
    } finally {
      setProcessing(false);
    }
  };

  const isPaid =
    booking.paymentStatus === "success" || booking.status === "confirmed";

  const canInitiate = booking.status === "accepted" && !isPaid;

  const isAwaitingPayment =
    booking.status === "payment_pending" || paymentPending;

  const amount = Number(booking.price);

  if (isPaid) {
    return (
      <section className="relative overflow-hidden rounded-4xl border border-emerald-200/80 bg-emerald-50/80 p-5 shadow-[0_8px_30px_rgba(16,185,129,0.12)] backdrop-blur-2xl sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 ring-1 ring-inset ring-emerald-200/80">
            <CheckCircle2 className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-emerald-900 sm:text-xl">
              Payment Successful
            </h2>
            <p className="mt-1 text-sm font-medium leading-relaxed text-emerald-700">
              Your simulated payment has been completed successfully.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!canInitiate && !isAwaitingPayment) return null;

  return (
    <section className="relative overflow-hidden rounded-4xl border border-white/70 bg-white/80 p-5 shadow-[0_8px_40px_rgba(203,189,255,0.18)] backdrop-blur-2xl sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#e4a5ff]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#acdcff]/25 blur-3xl"
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-slate-800 ring-1 ring-inset ring-[#deabff]/60">
            <CreditCard className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-slate-800 sm:text-xl">
              Booking Payment
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500 sm:text-sm">
              <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-[#9687c7]" />
              <span>
                This is a simulated payment. No real money will be charged.
              </span>
            </p>
          </div>
        </div>

        {/* Amount Card */}
        <div className="mt-6 flex flex-col justify-between gap-2 rounded-2xl border border-[#bfcaff]/40 bg-linear-to-r from-[#e4a5ff]/15 via-[#cbbdff]/15 to-[#acdcff]/15 p-5 sm:flex-row sm:items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Payable Amount
          </span>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {Number.isFinite(amount)
              ? `₹${amount.toLocaleString("en-IN")}`
              : "Unavailable"}
          </span>
        </div>

        {/* Initiate Payment Button */}
        {canInitiate && !paymentPending && (
          <button
            type="button"
            onClick={handleInitiate}
            disabled={processing || !(amount > 0)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-6 py-3.5 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:scale-[1.01] hover:brightness-105 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-55 sm:w-auto sm:px-8"
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : booking.paymentStatus === "failed" ? (
              "Retry Payment"
            ) : (
              "Initiate Payment"
            )}
          </button>
        )}

        {/* Simulation Outcome Controls */}
        {isAwaitingPayment && (
          <div className="mt-6 border-t border-[#bfcaff]/30 pt-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Select a simulation outcome
            </p>

            <div className="mt-3.5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                disabled={processing}
                onClick={() => handleSimulate("success")}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-600 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55 sm:w-auto"
              >
                {processing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                <span>Simulate Success</span>
              </button>

              <button
                type="button"
                disabled={processing}
                onClick={() => handleSimulate("failed")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200/90 bg-red-50/70 px-5 py-3 text-sm font-bold text-red-600 transition-all hover:border-red-300 hover:bg-red-100/80 hover:text-red-700 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55 sm:w-auto"
              >
                {processing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <span>Simulate Failure</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookingPayment;
