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
  const inputClass =
    "w-full rounded-xl border border-[#cbd5e1] bg-white py-3 pl-10 text-sm font-medium text-[#0a1128] placeholder:text-[#64748b] shadow-2xs transition-colors outline-none focus:border-[#1282a2] focus:ring-3 focus:ring-[#1282a2]/20";

  return (
    <div className="rounded-3xl border border-[#d8e2eb] bg-white p-5 shadow-xs sm:p-7">
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5"
      >
        {/* Search */}
        <div>
          <label
            htmlFor="service-search"
            className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748b]"
          >
            Search Services
          </label>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1282a2]" />

            <input
              id="service-search"
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="e.g. AC Repair"
              className={`${inputClass} pr-4`}
            />
          </div>
        </div>

        {/* City */}
        <div>
          <label
            htmlFor="service-city"
            className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748b]"
          >
            City
          </label>

          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1282a2]" />

            <input
              id="service-city"
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="e.g. Saharanpur"
              className={`${inputClass} pr-4`}
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="service-category"
            className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748b]"
          >
            Category
          </label>

          <div className="relative">
            <LayoutGrid className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1282a2]" />

            <select
              id="service-category"
              value={categoryId}
              onChange={handleCategoryChange}
              className={`${inputClass} appearance-none pr-10`}
            >
              <option value="">All Categories</option>

              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#33415c]" />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-1 flex flex-col gap-3 border-t border-[#e2e8f0] pt-4 sm:flex-row sm:flex-wrap md:col-span-3">
          <button
            type="submit"
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#034078] px-7 py-3 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#001f54] sm:w-auto"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Apply Filters</span>
          </button>

          <button
            type="button"
            onClick={handleClearFilters}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-6 py-3 text-sm font-bold text-[#0a1128] shadow-2xs transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078] sm:w-auto"
          >
            <RotateCcw className="h-4 w-4 text-[#1282a2]" />
            <span>Clear Filters</span>
          </button>
        </div>
      </form>

      {categoriesError && (
        <div
          role="alert"
          className="mt-4 flex items-center gap-2 rounded-2xl border border-red-200 border-l-4 border-l-red-600 bg-red-50 px-4 py-3 text-xs font-semibold text-red-900 sm:text-sm"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{categoriesError}</span>
        </div>
      )}
    </div>
  );
};

export default ServiceFilters;
