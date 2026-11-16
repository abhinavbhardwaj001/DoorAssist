import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Sparkles } from "lucide-react";
import { getActiveServices } from "../../services/service.api";
import { getActiveCategories } from "../../services/category.api";
import ServiceFilters from "../../components/services/ServiceFilters";
import ServiceGrid from "../../components/services/ServiceGrid";
import Pagination from "../../components/common/Pagination";
import FetchErrorBanner from "../../components/common/FetchErrorBanner";
import EmptyState from "../../components/common/EmptyState";

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read filters from URL
  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const city = searchParams.get("city") || "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [searchInput, setSearchInput] = useState(search);
  const [cityInput, setCityInput] = useState(city);

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoriesError, setCategoriesError] = useState("");

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 0,
  });

  // Sync inputs when URL changes
  useEffect(() => {
    setSearchInput(search);
    setCityInput(city);
  }, [search, city]);

  // Fetch categories once
  useEffect(() => {
    let active = true;

    const fetchCategories = async () => {
      try {
        const response = await getActiveCategories();

        if (active) {
          setCategories(response.data.data.categories || []);
        }
      } catch {
        if (active) {
          setCategoriesError("Unable to load categories.");
        }
      }
    };

    fetchCategories();

    return () => {
      active = false;
    };
  }, []);

  // Fetch services whenever filters change
  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getActiveServices({
        search,
        categoryId,
        city,
        page,
        limit: 9,
      });

      setServices(response.data.data.services || []);
      setPagination(
        response.data.data.pagination || {
          total: 0,
          page: 1,
          limit: 9,
          totalPages: 0,
        },
      );
    } catch (err) {
      setServices([]);
      setError(
        err.response?.data?.message ||
          "Unable to load services. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [search, categoryId, city, page]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Change URL filters
  const updateFilters = (updates) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset pagination when filtering
    params.delete("page");

    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    updateFilters({
      search: searchInput.trim(),
      city: cityInput.trim(),
    });
  };

  const handleCategoryChange = (e) => {
    updateFilters({
      categoryId: e.target.value,
    });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setCityInput("");
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);

    if (newPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(newPage));
    }

    setSearchParams(params);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const hasActiveFilters = Boolean(search || categoryId || city);

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <section className="relative overflow-hidden rounded-4xl border border-white/75 bg-white/75 p-7 shadow-[0_12px_45px_rgba(203,189,255,0.18)] backdrop-blur-2xl sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#e4a5ff]/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-[#acdcff]/25 blur-3xl"
          />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bfcaff]/45 bg-white/80 px-3.5 py-1 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#a575bf]" />
              <span>Explore DoorAssist</span>
            </div>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Find Home Services
            </h1>

            <p className="mt-2.5 max-w-2xl text-sm font-medium leading-6 text-slate-500 sm:text-base">
              Browse available services from verified local providers and find
              the right help for your home.
            </p>
          </div>
        </section>

        {/* Filters & Results */}
        <section className="mt-8">
          <ServiceFilters
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            cityInput={cityInput}
            setCityInput={setCityInput}
            categoryId={categoryId}
            categories={categories}
            categoriesError={categoriesError}
            handleSearch={handleSearch}
            handleCategoryChange={handleCategoryChange}
            handleClearFilters={handleClearFilters}
          />

          {/* Results Header */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
              Available Services
            </h2>

            {!loading && !error && (
              <span className="rounded-full border border-[#bfcaff]/45 bg-white/75 px-3.5 py-1 text-xs font-bold text-slate-600 shadow-xs backdrop-blur-md">
                {pagination.total}{" "}
                {pagination.total === 1 ? "service" : "services"} found
              </span>
            )}
          </div>

          {/* Services Grid / States */}
          {loading ? (
            <div
              role="status"
              className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-pulse"
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-4xl border border-white/70 bg-white/65"
                >
                  <div className="h-48 bg-white/80" />
                  <div className="space-y-3.5 p-6">
                    <div className="h-4 w-24 rounded-full bg-white/90" />
                    <div className="h-6 w-3/4 rounded-full bg-white/90" />
                    <div className="h-4 w-full rounded-full bg-white/80" />
                    <div className="h-4 w-1/2 rounded-full bg-white/80" />
                  </div>
                </div>
              ))}
              <span className="sr-only">Loading services...</span>
            </div>
          ) : error ? (
            <FetchErrorBanner
              message={error}
              onRetry={fetchServices}
              className="mt-6"
            />
          ) : services.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                icon={<Search className="h-7 w-7 text-[#7c56a8]" />}
                title="No services found"
                message="Try adjusting your search keywords, category, or city to discover more services."
                actionLabel={hasActiveFilters ? "Clear Filters" : undefined}
                onAction={hasActiveFilters ? handleClearFilters : undefined}
              />
            </div>
          ) : (
            <div className="mt-6">
              <ServiceGrid services={services} />
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && pagination.totalPages > 1 && (
            <div className="mt-10">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Services;
