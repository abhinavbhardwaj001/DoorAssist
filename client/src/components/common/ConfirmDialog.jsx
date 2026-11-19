import Modal from "./Modal";
import { Loader2 } from "lucide-react";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  variant = "danger",
}) => {
  const confirmStyles = {
    danger: "bg-red-600 text-white hover:bg-red-700",
    primary: "bg-[#034078] text-white hover:bg-[#001f54]",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={loading ? () => {} : onClose}
      title={title}
      closeOnBackdrop={!loading}
    >
      <p className="text-sm font-medium leading-relaxed text-[#33415c]">
        {message}
      </p>

      <div className="mt-7 flex flex-col-reverse gap-3 sm:mt-8 sm:flex-row sm:justify-end sm:gap-3.5">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="w-full cursor-pointer rounded-xl border border-[#cbd5e1] bg-white px-5 py-2.5 text-sm font-bold text-[#0a1128] shadow-2xs transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078] disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
        >
          {cancelText}
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold shadow-xs transition-colors disabled:pointer-events-none disabled:opacity-70 sm:w-auto ${
            confirmStyles[variant] || confirmStyles.danger
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            confirmText
          )}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
