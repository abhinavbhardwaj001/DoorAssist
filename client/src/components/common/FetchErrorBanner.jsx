import { AlertCircle } from "lucide-react";

const FetchErrorBanner = ({ message, onRetry, className = "mt-6" }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`flex flex-col items-start justify-between gap-4 rounded-3xl border border-red-200/80 bg-red-50/85 p-5 text-sm text-red-800 backdrop-blur-md sm:flex-row sm:items-center ${className}`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
        <p className="font-semibold">{message}</p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-xl border border-red-200 bg-white/85 px-4 py-2 text-xs font-bold text-red-700 shadow-xs transition-colors hover:bg-white"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default FetchErrorBanner;
