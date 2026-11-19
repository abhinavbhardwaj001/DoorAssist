import { formatNumber } from "../../utils/formatters";

const VARIANT_CLASSES = {
  brand: "border-[#034078]/20 bg-[#f4f7fa] text-[#034078]",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  sky: "border-[#1282a2]/25 bg-[#1282a2]/10 text-[#1282a2]",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rose: "border-red-200 bg-red-50 text-red-700",
  violet: "border-[#001f54]/20 bg-[#001f54]/10 text-[#001f54]",
};

const StatCard = ({
  label,
  value,
  icon: Icon,
  variant = "brand",
  loading = false,
  format = true,
}) => {
  const iconClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.brand;
  const displayValue = loading
    ? "—"
    : format && typeof value === "number"
      ? formatNumber(value)
      : value;

  return (
    <div className="flex items-center justify-between rounded-3xl border border-[#d8e2eb] bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1282a2] hover:shadow-md">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
          {label}
        </p>

        <p className="mt-2.5 text-3xl font-extrabold tracking-tight text-[#0a1128]">
          {displayValue}
        </p>
      </div>

      {Icon && (
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      )}
    </div>
  );
};

export default StatCard;
