import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, FolderOpen, Layers, Sparkles } from "lucide-react";
import { getActiveCategories } from "../../services/category.api";
import FetchErrorBanner from "../../components/common/FetchErrorBanner";
import EmptyState from "../../components/common/EmptyState";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getActiveCategories();
      setCategories(response.data.data.categories || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load categories. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
              Service Categories
            </h1>

            <p className="mt-2.5 max-w-2xl text-sm font-medium leading-6 text-slate-500 sm:text-base">
              Browse home-service categories and discover verified local
              professionals ready to help.
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="mt-8">
          {loading ? (
            <div
              role="status"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-pulse"
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-4xl border border-white/70 bg-white/65"
                >
                  <div className="h-48 bg-white/80" />
                  <div className="space-y-3.5 p-6">
                    <div className="h-6 w-1/2 rounded-full bg-white/90" />
                    <div className="h-4 w-full rounded-full bg-white/80" />
                    <div className="h-4 w-3/4 rounded-full bg-white/80" />
                  </div>
                </div>
              ))}
              <span className="sr-only">Loading categories...</span>
            </div>
          ) : error ? (
            <FetchErrorBanner message={error} onRetry={fetchCategories} />
          ) : categories.length === 0 ? (
            <EmptyState
              icon={<FolderOpen className="h-7 w-7 text-[#7c56a8]" />}
              title="No categories available"
              message="Service categories will appear here once they are published."
              actionLabel="Browse All Services"
              actionLink="/services"
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/services?categoryId=${category._id}`}
                  className="group flex flex-col overflow-hidden rounded-4xl border border-white/75 bg-white/80 shadow-[0_8px_30px_rgba(203,189,255,0.16)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#deabff]/75 hover:bg-white/95 hover:shadow-[0_14px_38px_rgba(203,189,255,0.26)]"
                >
                  {/* Category Image */}
                  <div className="relative h-48 overflow-hidden bg-linear-to-br from-[#f6ebff] via-[#f4f1ff] to-[#ebf6ff]">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/85 bg-white/80 text-[#8b7cc8] shadow-sm backdrop-blur-xl transition-transform duration-300 group-hover:scale-105">
                          <Layers className="h-8 w-8" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Category Details */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <h2 className="text-lg font-extrabold tracking-tight text-slate-900 transition-colors group-hover:text-[#7c56a8] sm:text-xl">
                        {category.name}
                      </h2>

                      <p className="mt-2.5 line-clamp-2 min-h-10 text-xs font-medium leading-5 text-slate-500 sm:text-sm">
                        {category.description ||
                          "Explore available services in this category."}
                      </p>
                    </div>

                    <div className="mt-5 border-t border-[#bfcaff]/25 pt-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7c56a8] sm:text-sm">
                        <span>Explore Services</span>
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Categories;
