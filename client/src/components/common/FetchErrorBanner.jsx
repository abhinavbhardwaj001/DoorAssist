import { AlertCircle } from "lucide-react";

const FetchErrorBanner = ({ message, onRetry, className = "mt-6" }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`flex flex-col items-start justify-between gap-4 rounded-3xl border border-red-200 border-l-4 border-l-red-600 bg-red-50 p-5 text-sm text-red-900 shadow-2xs sm:flex-row sm:items-center ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-white text-red-600">
          <AlertCircle aria-hidden="true" className="h-4 w-4" />
        </div>
        <p className="pt-1 font-semibold leading-relaxed text-red-900">
          {message}
        </p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-bold text-[#0a1128] shadow-2xs transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078]"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default FetchErrorBanner;
