import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Receipt,
  CheckCircle2,
  Clock,
  RefreshCw,
  ArrowUpRight,
  Calendar,
  Hash,
  Wallet,
  Info,
  Sparkles,
} from "lucide-react";
import { useNotification } from "../../context/NotificationContext";
import { getMyPayments } from "../../services/payment.api";
import { formatCurrency, formatDateTime } from "../../utils/formatters";
import StatCard from "../../components/common/StatCard";
import FilterTabs from "../../components/common/FilterTabs";
import PaymentStatusBadge from "../../components/common/PaymentStatusBadge";
import EmptyState from "../../components/common/EmptyState";
import FetchErrorBanner from "../../components/common/FetchErrorBanner";

const STATUS_FILTERS = ["all", "pending", "success", "failed", "refunded"];

const MyPayments = () => {
  const { showNotification } = useNotification();
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getMyPayments();

      setPayments(response.data.data.payments || []);
    } catch (err) {
      const message =
        err.response?.data?.message || "Unable to load payment history.";
      setError(message);
      showNotification(message, "error");
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const filteredPayments =
    filter === "all"
      ? payments
      : payments.filter((payment) => payment.status === filter);

  const successfulPayments = payments.filter(
    (payment) => payment.status === "success",
  );

  const totalPaid = successfulPayments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0,
  );

  const pendingCount = payments.filter(
    (payment) => payment.status === "pending",
  ).length;

  const summaryCards = [
    {
      label: "Total Payment Records",
      value: payments.length,
      icon: Receipt,
      variant: "brand",
    },
    {
      label: "Successful Payments",
      value: successfulPayments.length,
      icon: CheckCircle2,
      variant: "emerald",
    },
    {
      label: "Pending Payments",
      value: pendingCount,
      icon: Clock,
      variant: "amber",
    },
  ];

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bfcaff]/40 bg-white/70 px-3.5 py-1 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#a575bf]" />
              <span>Customer Portal</span>
            </div>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              My Payments
            </h1>

            <p className="mt-1.5 text-sm font-medium text-slate-500">
              Track simulated payments and transaction receipts associated with
              your bookings.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchPayments}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#bfcaff]/55 bg-white/80 px-5 py-3 text-sm font-bold text-slate-700 shadow-xs backdrop-blur-md transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-900 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
          >
            <RefreshCw
              className={`h-4 w-4 text-[#7c56a8] ${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>

        {error && (
          <FetchErrorBanner
            message={error}
            onRetry={fetchPayments}
            className="mt-6"
          />
        )}

        {/* Summary Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {summaryCards.map((card) => (
            <StatCard
              key={card.label}
              label={card.label}
              value={card.value}
              icon={card.icon}
              variant={card.variant}
              loading={loading}
            />
          ))}
        </div>

        {/* Simulated Total Banner */}
        <div className="relative mt-5 overflow-hidden rounded-4xl border border-white/75 bg-linear-to-r from-[#f6ebff]/90 via-[#f4f1ff]/90 to-[#ebf6ff]/90 p-6 shadow-[0_10px_35px_rgba(203,189,255,0.2)] backdrop-blur-2xl sm:p-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#e4a5ff]/25 blur-3xl"
          />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7c56a8]">
                <Wallet className="h-4 w-4" />
                <span>Total Successful Payment Amount</span>
              </div>

              <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {loading ? "—" : formatCurrency(totalPaid, "INR", 2)}
              </p>

              <p className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <Info className="h-3.5 w-3.5 shrink-0 text-[#7c56a8]" />
                <span>
                  Simulation only — no real money was transferred. This total
                  excludes failed, pending, and refunded payments.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Status Filters */}
        <FilterTabs
          options={STATUS_FILTERS}
          value={filter}
          onChange={setFilter}
          className="mt-8"
        />

        {/* Payment History */}
        {loading ? (
          <div role="status" className="mt-6 space-y-4 animate-pulse">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-44 rounded-3xl border border-white/70 bg-white/65"
              />
            ))}
            <span className="sr-only">Loading payments...</span>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={<CreditCard className="h-7 w-7 text-[#7c56a8]" />}
              title="No payments found"
              message={
                filter === "all"
                  ? "Your simulated payment history will appear here."
                  : `No ${filter} payments available.`
              }
              actionLabel="View My Bookings"
              actionLink="/bookings"
            />
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {filteredPayments.map((payment) => {
              const bookingId =
                typeof payment.bookingId === "object"
                  ? payment.bookingId?._id
                  : payment.bookingId;

              const scheduledAt =
                typeof payment.bookingId === "object"
                  ? payment.bookingId?.scheduledAt
                  : null;

              return (
                <article
                  key={payment._id}
                  className="rounded-4xl border border-white/75 bg-white/80 p-6 shadow-[0_10px_35px_rgba(203,189,255,0.16)] backdrop-blur-2xl transition-all duration-300 hover:border-[#deabff]/60 sm:p-7"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Payment Amount
                      </p>

                      <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                        {formatCurrency(
                          payment.amount,
                          payment.currency || "INR",
                          2,
                        )}
                      </h2>

                      <p className="mt-1.5 font-mono text-xs font-semibold text-slate-400">
                        Payment ID: {payment._id}
                      </p>
                    </div>

                    <PaymentStatusBadge status={payment.status} size="md" />
                  </div>

                  <div className="mt-6 grid gap-4 border-t border-[#bfcaff]/30 pt-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl border border-[#bfcaff]/40 bg-white/65 p-3.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <CreditCard className="h-3.5 w-3.5 text-[#7c56a8]" />
                        <span>Payment Method</span>
                      </div>
                      <p className="mt-1.5 text-sm font-extrabold capitalize text-slate-900">
                        {payment.paymentMethod || "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#bfcaff]/40 bg-white/65 p-3.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <Calendar className="h-3.5 w-3.5 text-[#7c56a8]" />
                        <span>Payment Created</span>
                      </div>
                      <p className="mt-1.5 text-sm font-extrabold text-slate-900">
                        {formatDateTime(payment.createdAt, "—")}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#bfcaff]/40 bg-white/65 p-3.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#7c56a8]" />
                        <span>Paid At</span>
                      </div>
                      <p className="mt-1.5 text-sm font-extrabold text-slate-900">
                        {formatDateTime(payment.paidAt, "—")}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#bfcaff]/40 bg-white/65 p-3.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <Clock className="h-3.5 w-3.5 text-[#7c56a8]" />
                        <span>Booking Date</span>
                      </div>
                      <p className="mt-1.5 text-sm font-extrabold text-slate-900">
                        {formatDateTime(scheduledAt, "—")}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#bfcaff]/40 bg-white/65 p-3.5 sm:col-span-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <Hash className="h-3.5 w-3.5 text-[#7c56a8]" />
                        <span>Transaction ID</span>
                      </div>
                      <p className="mt-1.5 break-all font-mono text-xs font-bold text-slate-800 sm:text-sm">
                        {payment.transactionId || "Not generated"}
                      </p>
                    </div>
                  </div>

                  {bookingId && (
                    <div className="mt-6 border-t border-[#bfcaff]/30 pt-5">
                      <Link
                        to={`/bookings/${bookingId}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#bfcaff]/55 bg-white/80 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition-all hover:border-[#deabff] hover:bg-linear-to-r hover:from-[#e4a5ff]/20 hover:to-[#acdcff]/20 hover:text-slate-900 sm:text-sm"
                      >
                        <span>View Booking Details</span>
                        <ArrowUpRight className="h-4 w-4 text-[#7c56a8]" />
                      </Link>
                    </div>
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

export default MyPayments;
