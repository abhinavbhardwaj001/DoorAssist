import { formatLabel } from "../../utils/formatters";

const PAYMENT_STATUS_STYLES = {
  pending: {
    badge: "border-amber-200/80 bg-amber-50/90 text-amber-800",
    dot: "bg-amber-500",
  },
  success: {
    badge: "border-emerald-200/80 bg-emerald-50/90 text-emerald-800",
    dot: "bg-emerald-500",
  },
  failed: {
    badge: "border-red-200/80 bg-red-50/90 text-red-700",
    dot: "bg-red-500",
  },
  refunded: {
    badge: "border-[#deabff]/80 bg-[#f6ebff]/90 text-[#7c56a8]",
    dot: "bg-[#a575bf]",
  },
};

const PaymentStatusBadge = ({ status, size = "sm" }) => {
  const active = PAYMENT_STATUS_STYLES[status] || {
    badge: "border-slate-200/80 bg-slate-100/90 text-slate-600",
    dot: "bg-slate-400",
  };

  const sizeClass =
    size === "md" ? "px-4 py-1.5 text-xs sm:text-sm" : "px-3 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold shadow-xs ${sizeClass} ${active.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active.dot}`} />
      <span>{formatLabel(status) || "Unknown"}</span>
    </span>
  );
};

export default PaymentStatusBadge;
