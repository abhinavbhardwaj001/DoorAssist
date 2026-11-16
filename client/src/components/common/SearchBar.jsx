import { Search } from "lucide-react";

const SearchBar = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Search...",
  ariaLabel = "Search",
  maxLength = 100,
}) => (
  <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
    <div className="relative min-w-0 flex-1">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9687c7]" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="w-full rounded-2xl border border-[#bfcaff]/50 bg-white/75 py-3 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 shadow-xs backdrop-blur-md transition-all outline-none focus:border-[#a575bf] focus:bg-white focus:ring-4 focus:ring-[#cbbdff]/30"
      />
    </div>

    <button
      type="submit"
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-6 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:brightness-105 active:scale-[0.98]"
    >
      <Search className="h-4 w-4" />
      <span>Search</span>
    </button>
  </form>
);

export default SearchBar;
