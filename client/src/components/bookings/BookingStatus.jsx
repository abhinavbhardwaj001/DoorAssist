const statusStyles = {
  pending: {
    badge: "border-amber-200 bg-amber-50 text-amber-800",
    dot: "bg-amber-600",
  },
  accepted: {
    badge: "border-[#034078]/25 bg-[#f4f7fa] text-[#034078]",
    dot: "bg-[#034078]",
  },
  rejected: {
    badge: "border-red-200 bg-red-50 text-red-700",
    dot: "bg-red-600",
  },
  in_progress: {
    badge: "border-[#1282a2]/30 bg-[#1282a2]/10 text-[#001f54]",
    dot: "bg-[#1282a2]",
  },
  completed: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-600",
  },
  cancelled: {
    badge: "border-[#d8e2eb] bg-[#f8fafc] text-[#33415c]",
    dot: "bg-[#64748b]",
  },
  payment_pending: {
    badge: "border-orange-200 bg-orange-50 text-orange-800",
    dot: "bg-orange-600",
  },
  confirmed: {
    badge: "border-[#001f54]/25 bg-[#001f54]/10 text-[#001f54]",
    dot: "bg-[#001f54]",
  },
};

const defaultStatusStyle = {
  badge: "border-[#d8e2eb] bg-[#f8fafc] text-[#33415c]",
  dot: "bg-[#64748b]",
};

const BookingStatus = ({ status }) => {
  const label = status?.replaceAll("_", " ") || "Unknown";
  const style = statusStyles[status] || defaultStatusStyle;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold capitalize ${style.badge}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
      <span>{label}</span>
    </span>
  );
};

export default BookingStatus;