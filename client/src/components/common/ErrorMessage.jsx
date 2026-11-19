import { AlertCircle, RotateCcw } from "lucide-react";

const ErrorMessage = ({ message, onRetry, className = "" }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`rounded-2xl border border-red-200 border-l-4 border-l-red-600 bg-red-50 p-4 text-sm text-red-900 shadow-2xs sm:px-5 sm:py-4 ${className}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
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
            className="inline-flex w-full shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-bold text-[#0a1128] shadow-2xs transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078] sm:w-auto"
          >
            <RotateCcw className="h-3.5 w-3.5 text-[#1282a2]" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
