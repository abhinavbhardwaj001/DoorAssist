import { formatLabel } from "../../utils/formatters";

const BOOKING_STATUS_STYLES = {
  pending: {
    badge: "border-amber-200/80 bg-amber-50/90 text-amber-800",
    dot: "bg-amber-500",
  },
  accepted: {
    badge: "border-sky-200/80 bg-sky-50/90 text-sky-800",
    dot: "bg-sky-500",
  },
  payment_pending: {
    badge: "border-orange-200/80 bg-orange-50/90 text-orange-800",
    dot: "bg-orange-500",
  },
  confirmed: {
    badge: "border-teal-200/80 bg-teal-50/90 text-teal-800",
    dot: "bg-teal-500",
  },
  in_progress: {
    badge: "border-[#deabff]/80 bg-[#f6ebff]/90 text-[#7c56a8]",
    dot: "bg-[#a575bf]",
  },
  completed: {
    badge: "border-emerald-200/80 bg-emerald-50/90 text-emerald-800",
    dot: "bg-emerald-500",
  },
  rejected: {
    badge: "border-red-200/80 bg-red-50/90 text-red-700",
    dot: "bg-red-500",
  },
  cancelled: {
    badge: "border-slate-200/80 bg-slate-100/90 text-slate-600",
    dot: "bg-slate-400",
  },
};

const BookingStatusBadge = ({ status, size = "sm" }) => {
  const active = BOOKING_STATUS_STYLES[status] || {
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

export default BookingStatusBadge;
