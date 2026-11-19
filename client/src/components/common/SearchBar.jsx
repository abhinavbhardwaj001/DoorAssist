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
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1282a2]" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="w-full rounded-xl border border-[#cbd5e1] bg-white py-3 pl-10 pr-4 text-sm font-medium text-[#0a1128] placeholder:text-[#64748b] shadow-2xs transition-colors outline-none focus:border-[#1282a2] focus:ring-3 focus:ring-[#1282a2]/20"
      />
    </div>

    <button
      type="submit"
      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#034078] px-6 py-3 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#001f54]"
    >
      <Search className="h-4 w-4" />
      <span>Search</span>
    </button>
  </form>
);

export default SearchBar;
