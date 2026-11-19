import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const ModalDialog = ({
  open,
  onClose,
  title,
  titleId,
  icon: Icon,
  iconBadgeClass = "border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]",
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
      className="fixed inset-0 z-70 flex items-center justify-center bg-[#0a1128]/55 p-4"
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
        className={`relative w-full ${maxWidth} overflow-hidden rounded-3xl border border-[#d8e2eb] bg-white p-6 shadow-xl sm:p-7`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#e2e8f0] pb-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${iconBadgeClass}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            )}

            <h2
              id={titleId}
              className="text-lg font-extrabold tracking-tight text-[#0a1128] sm:text-xl"
            >
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={disabled}
            aria-label="Close dialog"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-[#33415c] transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078] disabled:pointer-events-none disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 text-[#33415c]">{children}</div>

        {footer && (
          <div className="mt-6 flex flex-col-reverse justify-end gap-3 border-t border-[#e2e8f0] pt-5 sm:flex-row">
            {footer}
          </div>
        )}
      </Wrapper>
    </div>,
    document.body,
  );
};

export default ModalDialog;
