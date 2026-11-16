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
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-red-500/20",
    primary:
      "bg-gradient-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] text-slate-900 shadow-[#cbbdff]/30 hover:brightness-105",
    success:
      "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={loading ? () => {} : onClose}
      title={title}
      closeOnBackdrop={!loading}
    >
      <p className="text-sm font-medium leading-relaxed text-slate-600">
        {message}
      </p>

      <div className="mt-7 flex flex-col-reverse gap-3 sm:mt-8 sm:flex-row sm:justify-end sm:gap-3.5">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="w-full rounded-xl border-2 border-[#bfcaff]/40 bg-white/60 px-5 py-2.5 text-sm font-bold text-slate-600 transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-800 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
        >
          {cancelText}
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={`group flex w-full items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70 sm:w-auto ${
            confirmStyles[variant] || confirmStyles.danger
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
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
