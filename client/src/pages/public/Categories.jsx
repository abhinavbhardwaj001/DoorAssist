import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, FolderOpen, Layers } from "lucide-react";
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
    <div className="min-h-screen bg-[#fefcfb] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <section className="rounded-3xl border border-[#d8e2eb] bg-white p-7 shadow-sm sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-lg border border-[#d8e2eb] bg-[#f4f7fa] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#034078]">
            <span className="h-2 w-2 rounded-full bg-[#1282a2]" />
            <span>Explore DoorAssist</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0a1128] sm:text-4xl">
            Service Categories
          </h1>

          <p className="mt-2.5 max-w-2xl text-sm font-medium leading-6 text-[#33415c] sm:text-base">
            Browse home-service categories and discover verified local
            professionals ready to help.
          </p>
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
                  className="overflow-hidden rounded-2xl border border-[#d8e2eb] bg-white"
                >
                  <div className="h-48 bg-[#e2e8f0]" />
                  <div className="space-y-3.5 p-6">
                    <div className="h-6 w-1/2 rounded bg-[#e2e8f0]" />
                    <div className="h-4 w-full rounded bg-[#f1f5f9]" />
                    <div className="h-4 w-3/4 rounded bg-[#f1f5f9]" />
                  </div>
                </div>
              ))}
              <span className="sr-only">Loading categories...</span>
            </div>
          ) : error ? (
            <FetchErrorBanner message={error} onRetry={fetchCategories} />
          ) : categories.length === 0 ? (
            <EmptyState
              icon={<FolderOpen className="h-7 w-7 text-[#034078]" />}
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
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#d8e2eb] bg-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1282a2] hover:shadow-md"
                >
                  {/* Category Image */}
                  <div className="relative h-48 overflow-hidden border-b border-[#d8e2eb] bg-[#f4f7fa]">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#d8e2eb] bg-white text-[#034078] transition-colors group-hover:border-[#1282a2] group-hover:bg-[#034078] group-hover:text-white">
                          <Layers className="h-7 w-7" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Category Details */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <h2 className="text-lg font-extrabold tracking-tight text-[#0a1128] transition-colors group-hover:text-[#034078] sm:text-xl">
                        {category.name}
                      </h2>

                      <p className="mt-2 line-clamp-2 min-h-10 text-xs font-medium leading-5 text-[#33415c] sm:text-sm">
                        {category.description ||
                          "Explore available services in this category."}
                      </p>
                    </div>

                    <div className="mt-5 border-t border-[#e2e8f0] pt-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#034078] transition-colors group-hover:text-[#1282a2] sm:text-sm">
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
