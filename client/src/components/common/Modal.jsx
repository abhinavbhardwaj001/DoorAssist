import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-md",
  closeOnBackdrop = true,
}) => {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm transition-opacity"
      onMouseDown={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative my-auto max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-4xl border border-white/80 bg-white/90 p-5 shadow-[0_16px_50px_rgba(203,189,255,0.28)] backdrop-blur-2xl sm:p-8`}
      >
        <div className="mb-5 flex items-center justify-between gap-4 border-b border-[#bfcaff]/30 pb-4">
          <h2
            id={titleId}
            className="text-lg font-extrabold tracking-tight text-slate-800 sm:text-xl"
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#bfcaff]/40 bg-white/70 text-slate-500 transition-all hover:border-[#deabff] hover:bg-[#e4a5ff]/15 hover:text-slate-800 active:scale-95"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="text-slate-700">{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
