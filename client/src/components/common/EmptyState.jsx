import { Link } from "react-router-dom";

const EmptyState = ({
  icon = "📭",
  title = "No results found",
  message = "Nothing to display right now.",
  actionLabel,
  actionLink,
  onAction,
}) => {
  return (
    <div className="relative overflow-hidden rounded-4xl border border-white/60 bg-white/70 px-6 py-16 text-center shadow-[0_8px_40px_rgba(203,189,255,0.15)] backdrop-blur-2xl">
      {/* Decorative background glow for the empty state */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-br from-[#e4a5ff] to-[#acdcff] opacity-10 blur-[60px]"></div>

      {/* Icon Container */}
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-[#b2d6ff]/40 via-[#cbbdff]/30 to-[#e4a5ff]/40 p-1 shadow-inner">
        <div className="flex h-full w-full items-center justify-center rounded-full bg-white/60 text-4xl backdrop-blur-sm">
          {icon}
        </div>
      </div>

      <h2 className="mt-6 text-xl font-extrabold text-slate-800">{title}</h2>

      <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-relaxed text-slate-500">
        {message}
      </p>

      {/* Action Link */}
      {actionLabel && actionLink && (
        <Link
          to={actionLink}
          className="group mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-8 py-3.5 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:scale-[1.02] hover:shadow-[#cbbdff]/50 hover:brightness-105"
        >
          {actionLabel}
        </Link>
      )}

      {/* Action Button */}
      {actionLabel && !actionLink && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="group mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-8 py-3.5 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:scale-[1.02] hover:shadow-[#cbbdff]/50 hover:brightness-105"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
