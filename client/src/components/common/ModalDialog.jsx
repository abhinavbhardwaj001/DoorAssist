import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const ModalDialog = ({
  open,
  onClose,
  title,
  titleId,
  icon: Icon,
  iconBadgeClass = "bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-[#7c56a8] ring-[#deabff]/60",
  disabled = false,
  onSubmit,
  footer,
  maxWidth = "max-w-md",
  children,
}) => {
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !disabled) {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, disabled, onClose]);

  if (!open) return null;

  const Wrapper = onSubmit ? "form" : "div";

  return createPortal(
    <div
      className="fixed inset-0 z-70 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !disabled) onClose?.();
      }}
    >
      <Wrapper
        {...(onSubmit && { onSubmit })}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative w-full ${maxWidth} overflow-hidden rounded-4xl border border-white/80 bg-white/95 p-6 shadow-[0_20px_60px_rgba(203,189,255,0.35)] backdrop-blur-2xl sm:p-7`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#bfcaff]/30 pb-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ring-1 ring-inset ${iconBadgeClass}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            )}

            <h2
              id={titleId}
              className="text-lg font-extrabold text-slate-900 sm:text-xl"
            >
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={disabled}
            aria-label="Close dialog"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#bfcaff]/50 bg-white/80 text-slate-500 transition-colors hover:border-[#deabff] hover:text-slate-900 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4">{children}</div>

        {footer && (
          <div className="mt-6 flex flex-col-reverse justify-end gap-3 border-t border-[#bfcaff]/30 pt-5 sm:flex-row">
            {footer}
          </div>
        )}
      </Wrapper>
    </div>,
    document.body,
  );
};

export default ModalDialog;
