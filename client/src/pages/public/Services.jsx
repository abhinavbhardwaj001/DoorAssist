import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
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
    <div className="min-h-screen bg-[#fefcfb] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <section className="rounded-3xl border border-[#d8e2eb] bg-white p-7 shadow-sm sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-lg border border-[#d8e2eb] bg-[#f4f7fa] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#034078]">
            <span className="h-2 w-2 rounded-full bg-[#1282a2]" />
            <span>Explore DoorAssist</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0a1128] sm:text-4xl">
            Find Home Services
          </h1>

          <p className="mt-2.5 max-w-2xl text-sm font-medium leading-6 text-[#33415c] sm:text-base">
            Browse available services from verified local providers and find the
            right help for your home.
          </p>
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
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#d8e2eb] pb-4">
            <h2 className="text-lg font-extrabold tracking-tight text-[#0a1128] sm:text-xl">
              Available Services
            </h2>

            {!loading && !error && (
              <span className="rounded-lg border border-[#d8e2eb] bg-white px-3.5 py-1 text-xs font-bold text-[#034078] shadow-xs">
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
                  className="overflow-hidden rounded-2xl border border-[#d8e2eb] bg-white"
                >
                  <div className="h-48 bg-[#e2e8f0]" />
                  <div className="space-y-3.5 p-6">
                    <div className="h-4 w-24 rounded bg-[#e2e8f0]" />
                    <div className="h-6 w-3/4 rounded bg-[#e2e8f0]" />
                    <div className="h-4 w-full rounded bg-[#f1f5f9]" />
                    <div className="h-4 w-1/2 rounded bg-[#f1f5f9]" />
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
                icon={<Search className="h-7 w-7 text-[#034078]" />}
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
