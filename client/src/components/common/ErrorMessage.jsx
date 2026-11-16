import { AlertCircle, RotateCcw } from "lucide-react";

const ErrorMessage = ({ message, onRetry, className = "" }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`rounded-2xl border border-red-200/80 bg-red-50/80 p-4 text-sm text-red-700 shadow-sm backdrop-blur-md sm:px-5 sm:py-4 ${className}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100/90 text-red-600 ring-1 ring-inset ring-red-200/60">
            <AlertCircle aria-hidden="true" className="h-4 w-4" />
          </div>

          <p className="font-medium leading-relaxed text-red-700">{message}</p>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white/80 px-4 py-2 text-xs font-bold text-red-700 shadow-xs transition-all hover:bg-red-100/80 hover:text-red-900 active:scale-[0.98] sm:w-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
