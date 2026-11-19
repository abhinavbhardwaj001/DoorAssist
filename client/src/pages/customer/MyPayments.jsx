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
    <div className="min-h-screen bg-[#fefcfb] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Card */}
        <div className="rounded-3xl border border-[#d8e2eb] bg-white p-6 shadow-xs sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-[#d8e2eb] bg-[#f4f7fa] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#034078]">
                <span className="h-2 w-2 rounded-full bg-[#1282a2]" />
                <span>Customer Portal</span>
              </div>

              <h1 className="mt-3.5 text-2xl font-extrabold tracking-tight text-[#0a1128] sm:text-3xl">
                My Payments
              </h1>

              <p className="mt-1.5 text-sm font-medium text-[#33415c]">
                Track simulated payments and transaction receipts associated
                with your bookings.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchPayments}
              disabled={loading}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-5 py-3 text-sm font-bold text-[#0a1128] shadow-xs transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078] disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
            >
              <RefreshCw
                className={`h-4 w-4 text-[#1282a2] ${loading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
          </div>
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

        {/* Simulated Total Card */}
        <div className="mt-5 rounded-3xl border border-[#d8e2eb] border-l-4 border-l-[#1282a2] bg-white p-6 shadow-xs sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-[#d8e2eb] bg-[#f4f7fa] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#034078]">
                <Wallet className="h-3.5 w-3.5 text-[#1282a2]" />
                <span>Total Successful Payment Amount</span>
              </div>

              <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0a1128] sm:text-4xl">
                {loading ? "—" : formatCurrency(totalPaid, "INR", 2)}
              </p>

              <p className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-[#33415c]">
                <Info className="h-3.5 w-3.5 shrink-0 text-[#1282a2]" />
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
                className="h-44 rounded-3xl border border-[#d8e2eb] bg-white"
              />
            ))}
            <span className="sr-only">Loading payments...</span>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={<CreditCard className="h-7 w-7 text-[#034078]" />}
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
                  className="rounded-3xl border border-[#d8e2eb] bg-white p-6 shadow-xs transition-colors hover:border-[#1282a2] sm:p-7"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
                        Payment Amount
                      </p>

                      <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-[#0a1128] sm:text-3xl">
                        {formatCurrency(
                          payment.amount,
                          payment.currency || "INR",
                          2,
                        )}
                      </h2>

                      <p className="mt-1.5 font-mono text-xs font-semibold text-[#64748b]">
                        Payment ID: {payment._id}
                      </p>
                    </div>

                    <PaymentStatusBadge status={payment.status} size="md" />
                  </div>

                  <div className="mt-6 grid gap-4 border-t border-[#e2e8f0] pt-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-3.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#64748b]">
                        <CreditCard className="h-3.5 w-3.5 text-[#1282a2]" />
                        <span>Payment Method</span>
                      </div>
                      <p className="mt-1.5 text-sm font-extrabold capitalize text-[#0a1128]">
                        {payment.paymentMethod || "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-3.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#64748b]">
                        <Calendar className="h-3.5 w-3.5 text-[#1282a2]" />
                        <span>Payment Created</span>
                      </div>
                      <p className="mt-1.5 text-sm font-extrabold text-[#0a1128]">
                        {formatDateTime(payment.createdAt, "—")}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-3.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#64748b]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#1282a2]" />
                        <span>Paid At</span>
                      </div>
                      <p className="mt-1.5 text-sm font-extrabold text-[#0a1128]">
                        {formatDateTime(payment.paidAt, "—")}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-3.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#64748b]">
                        <Clock className="h-3.5 w-3.5 text-[#1282a2]" />
                        <span>Booking Date</span>
                      </div>
                      <p className="mt-1.5 text-sm font-extrabold text-[#0a1128]">
                        {formatDateTime(scheduledAt, "—")}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-3.5 sm:col-span-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#64748b]">
                        <Hash className="h-3.5 w-3.5 text-[#1282a2]" />
                        <span>Transaction ID</span>
                      </div>
                      <p className="mt-1.5 break-all font-mono text-xs font-bold text-[#0a1128] sm:text-sm">
                        {payment.transactionId || "Not generated"}
                      </p>
                    </div>
                  </div>

                  {bookingId && (
                    <div className="mt-6 border-t border-[#e2e8f0] pt-5">
                      <Link
                        to={`/bookings/${bookingId}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#034078] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#001f54] sm:text-sm"
                      >
                        <span>View Booking Details</span>
                        <ArrowUpRight className="h-4 w-4" />
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
