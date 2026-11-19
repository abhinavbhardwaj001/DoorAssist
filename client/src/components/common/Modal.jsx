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
      className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-[#0a1128]/55 p-4 transition-opacity"
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
        className={`relative my-auto max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-3xl border border-[#d8e2eb] bg-white p-5 shadow-xl sm:p-8`}
      >
        <div className="mb-5 flex items-center justify-between gap-4 border-b border-[#e2e8f0] pb-4">
          <h2
            id={titleId}
            className="text-lg font-extrabold tracking-tight text-[#0a1128] sm:text-xl"
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-[#33415c] transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="text-[#33415c]">{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
