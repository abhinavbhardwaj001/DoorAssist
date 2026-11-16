import {
  Search,
  MapPin,
  LayoutGrid,
  ChevronDown,
  SlidersHorizontal,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

const ServiceFilters = ({
  searchInput,
  setSearchInput,
  cityInput,
  setCityInput,
  categoryId,
  categories,
  categoriesError,
  handleSearch,
  handleCategoryChange,
  handleClearFilters,
}) => {
  return (
    <div className="relative overflow-hidden rounded-4xl border border-white/75 bg-white/80 p-5 shadow-[0_8px_40px_rgba(203,189,255,0.18)] backdrop-blur-2xl sm:p-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-[#e4a5ff]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -right-16 h-44 w-44 rounded-full bg-[#acdcff]/25 blur-3xl"
      />

      <form
        onSubmit={handleSearch}
        className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5"
      >
        {/* Search */}
        <div>
          <label
            htmlFor="service-search"
            className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600"
          >
            Search Services
          </label>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9687c7]" />

            <input
              id="service-search"
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="e.g. AC Repair"
              className="w-full rounded-2xl border border-[#bfcaff]/50 bg-white/75 py-3 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 shadow-xs backdrop-blur-md transition-all outline-none focus:border-[#a575bf] focus:bg-white focus:ring-4 focus:ring-[#cbbdff]/30"
            />
          </div>
        </div>

        {/* City */}
        <div>
          <label
            htmlFor="service-city"
            className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600"
          >
            City
          </label>

          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7195c2]" />

            <input
              id="service-city"
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="e.g. Saharanpur"
              className="w-full rounded-2xl border border-[#bfcaff]/50 bg-white/75 py-3 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 shadow-xs backdrop-blur-md transition-all outline-none focus:border-[#a575bf] focus:bg-white focus:ring-4 focus:ring-[#cbbdff]/30"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="service-category"
            className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600"
          >
            Category
          </label>

          <div className="relative">
            <LayoutGrid className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9687c7]" />

            <select
              id="service-category"
              value={categoryId}
              onChange={handleCategoryChange}
              className="w-full appearance-none rounded-2xl border border-[#bfcaff]/50 bg-white/75 py-3 pl-10 pr-10 text-sm font-medium text-slate-800 shadow-xs backdrop-blur-md transition-all outline-none focus:border-[#a575bf] focus:bg-white focus:ring-4 focus:ring-[#cbbdff]/30"
            >
              <option value="">All Categories</option>

              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-1 flex flex-col gap-3 border-t border-[#bfcaff]/30 pt-4 sm:flex-row sm:flex-wrap md:col-span-3">
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-7 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:scale-[1.01] hover:brightness-105 active:scale-[0.99] sm:w-auto"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Apply Filters</span>
          </button>

          <button
            type="button"
            onClick={handleClearFilters}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#bfcaff]/50 bg-white/75 px-6 py-3 text-sm font-bold text-slate-700 shadow-xs backdrop-blur-md transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-900 active:scale-[0.99] sm:w-auto"
          >
            <RotateCcw className="h-4 w-4 text-slate-500" />
            <span>Clear Filters</span>
          </button>
        </div>
      </form>

      {categoriesError && (
        <div
          role="alert"
          className="relative z-10 mt-4 flex items-center gap-2 rounded-2xl border border-red-200/80 bg-red-50/85 px-4 py-3 text-xs font-semibold text-red-700 backdrop-blur-md sm:text-sm"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{categoriesError}</span>
        </div>
      )}
    </div>
  );
};

export default ServiceFilters;
