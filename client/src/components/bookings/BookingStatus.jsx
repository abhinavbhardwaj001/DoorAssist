const statusStyles = {
  pending: "bg-amber-100/80 text-amber-700 ring-amber-500/20",
  accepted: "bg-[#b2d6ff]/40 text-[#002855] ring-[#b2d6ff]/60",
  rejected: "bg-red-100/80 text-red-700 ring-red-500/20",
  in_progress: "bg-[#e4a5ff]/30 text-[#4a2e5d] ring-[#e4a5ff]/50",
  completed: "bg-emerald-100/80 text-emerald-700 ring-emerald-500/20",
  cancelled: "bg-slate-100/80 text-slate-600 ring-slate-500/20",
  payment_pending: "bg-orange-100/80 text-orange-700 ring-orange-500/20",
  confirmed: "bg-[#acdcff]/40 text-[#023e7d] ring-[#acdcff]/60",
};

const BookingStatus = ({ status }) => {
  const label = status?.replaceAll("_", " ") || "Unknown";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-bold capitalize ring-1 ring-inset ${
        statusStyles[status] ||
        "bg-slate-100/80 text-slate-600 ring-slate-500/20"
      }`}
    >
      {label}
    </span>
  );
};

export default BookingStatus;
