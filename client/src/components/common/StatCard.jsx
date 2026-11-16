import { formatNumber } from "../../utils/formatters";

const VARIANT_CLASSES = {
  brand:
    "bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-[#7c56a8] ring-[#deabff]/60",
  amber: "bg-amber-100/80 text-amber-600 ring-amber-200/80",
  sky: "bg-sky-100/80 text-sky-600 ring-sky-200/80",
  emerald: "bg-emerald-100/80 text-emerald-600 ring-emerald-200/80",
  rose: "bg-rose-100/80 text-rose-600 ring-rose-200/80",
  violet: "bg-[#f6ebff] text-[#8b5cf6] ring-[#deabff]/70",
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
    <div className="flex items-center justify-between rounded-3xl border border-white/75 bg-white/80 p-6 shadow-[0_8px_30px_rgba(203,189,255,0.14)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#deabff]/60">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {label}
        </p>

        <p className="mt-2.5 text-3xl font-extrabold tracking-tight text-slate-900">
          {displayValue}
        </p>
      </div>

      {Icon && (
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ring-inset ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      )}
    </div>
  );
};

export default StatCard;
