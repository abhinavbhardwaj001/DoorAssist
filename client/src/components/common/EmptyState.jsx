import { Link } from "react-router-dom";

const EmptyState = ({
  icon = "📭",
  title = "No results found",
  message = "Nothing to display right now.",
  actionLabel,
  actionLink,
  onAction,
}) => {
  const actionClass =
    "mt-8 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#034078] px-8 py-3.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#001f54]";

  return (
    <div className="rounded-3xl border border-[#d8e2eb] bg-white px-6 py-16 text-center shadow-xs">
      {/* Icon Container */}
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-[#d8e2eb] bg-[#f4f7fa]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#d8e2eb] bg-white text-3xl text-[#034078]">
          {icon}
        </div>
      </div>

      <h2 className="mt-6 text-xl font-extrabold tracking-tight text-[#0a1128]">
        {title}
      </h2>

      <p className="mx-auto mt-2.5 max-w-md text-sm font-medium leading-relaxed text-[#33415c]">
        {message}
      </p>

      {/* Action Link */}
      {actionLabel && actionLink && (
        <Link to={actionLink} className={actionClass}>
          {actionLabel}
        </Link>
      )}

      {/* Action Button */}
      {actionLabel && !actionLink && onAction && (
        <button type="button" onClick={onAction} className={actionClass}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
