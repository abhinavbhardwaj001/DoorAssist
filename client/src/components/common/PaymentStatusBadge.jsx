import { formatLabel } from "../../utils/formatters";

const PAYMENT_STATUS_STYLES = {
  pending: {
    badge: "border-amber-200 bg-amber-50 text-amber-800",
    dot: "bg-amber-600",
  },
  success: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-600",
  },
  failed: {
    badge: "border-red-200 bg-red-50 text-red-700",
    dot: "bg-red-600",
  },
  refunded: {
    badge: "border-[#1282a2]/30 bg-[#1282a2]/10 text-[#001f54]",
    dot: "bg-[#1282a2]",
  },
};

const PaymentStatusBadge = ({ status, size = "sm" }) => {
  const active = PAYMENT_STATUS_STYLES[status] || {
    badge: "border-[#d8e2eb] bg-[#f8fafc] text-[#33415c]",
    dot: "bg-[#64748b]",
  };

  const sizeClass =
    size === "md" ? "px-4 py-1.5 text-xs sm:text-sm" : "px-3 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold shadow-2xs ${sizeClass} ${active.badge}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${active.dot}`} />
      <span>{formatLabel(status) || "Unknown"}</span>
    </span>
  );
};

export default PaymentStatusBadge;
