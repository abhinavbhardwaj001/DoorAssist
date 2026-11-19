import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  loading = false,
  className = "mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4",
}) => {
  if (totalPages <= 1) return null;

  const buttonClass =
    "group inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[#cbd5e1] bg-white px-3.5 py-2 text-sm font-bold text-[#0a1128] shadow-2xs transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078] disabled:pointer-events-none disabled:opacity-45 sm:px-5 sm:py-2.5";

  return (
    <nav aria-label="Pagination" className={className}>
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={loading || currentPage <= 1}
        className={buttonClass}
      >
        <ChevronLeft className="h-4 w-4 text-[#1282a2] transition-transform group-hover:-translate-x-0.5 group-hover:text-[#034078]" />
        <span>Previous</span>
      </button>

      <div className="flex items-center rounded-xl border border-[#d8e2eb] bg-[#f8fafc] px-4 py-2 text-xs font-semibold text-[#33415c] shadow-2xs sm:px-5 sm:py-2.5 sm:text-sm">
        <span>
          Page{" "}
          <strong className="font-extrabold text-[#0a1128]">
            {currentPage}
          </strong>{" "}
          of{" "}
          <strong className="font-extrabold text-[#0a1128]">
            {totalPages}
          </strong>
        </span>
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={loading || currentPage >= totalPages}
        className={buttonClass}
      >
        <span>Next</span>
        <ChevronRight className="h-4 w-4 text-[#1282a2] transition-transform group-hover:translate-x-0.5 group-hover:text-[#034078]" />
      </button>
    </nav>
  );
};

export default Pagination;
