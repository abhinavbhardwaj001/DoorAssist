import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  loading = false,
  className = "mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4",
}) => {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className={className}>
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={loading || currentPage <= 1}
        className="group inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/70 bg-white/75 px-3.5 py-2 text-sm font-bold text-slate-700 shadow-[0_4px_20px_rgba(203,189,255,0.15)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-[#deabff] hover:bg-linear-to-r hover:from-[#e4a5ff]/20 hover:to-[#acdcff]/20 hover:text-slate-900 hover:shadow-[0_6px_25px_rgba(203,189,255,0.28)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-45 sm:px-5 sm:py-2.5"
      >
        <ChevronLeft className="h-4 w-4 text-slate-500 transition-transform group-hover:-translate-x-0.5 group-hover:text-slate-800" />
        <span>Previous</span>
      </button>

      <div className="flex items-center rounded-xl border border-white/70 bg-white/65 px-4 py-2 text-xs font-semibold text-slate-500 shadow-[0_4px_20px_rgba(203,189,255,0.12)] backdrop-blur-xl sm:px-5 sm:py-2.5 sm:text-sm">
        <span>
          Page{" "}
          <strong className="font-extrabold text-slate-800">
            {currentPage}
          </strong>{" "}
          of{" "}
          <strong className="font-extrabold text-slate-800">
            {totalPages}
          </strong>
        </span>
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={loading || currentPage >= totalPages}
        className="group inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/70 bg-white/75 px-3.5 py-2 text-sm font-bold text-slate-700 shadow-[0_4px_20px_rgba(203,189,255,0.15)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-[#deabff] hover:bg-linear-to-r hover:from-[#e4a5ff]/20 hover:to-[#acdcff]/20 hover:text-slate-900 hover:shadow-[0_6px_25px_rgba(203,189,255,0.28)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-45 sm:px-5 sm:py-2.5"
      >
        <span>Next</span>
        <ChevronRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-800" />
      </button>
    </nav>
  );
};

export default Pagination;
