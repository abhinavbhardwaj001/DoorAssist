import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ArrowUpRight,
  CalendarCheck,
  CheckCircle2,
  Briefcase,
  Layers,
  ShieldCheck,
  IndianRupee,
  Clock,
  Star,
  Wrench,
} from "lucide-react";
import { getActiveCategories } from "../../services/category.api";
import { getActiveServices } from "../../services/service.api";
import CategoryCard from "../../components/categories/CategoryCard";
import ServiceCard from "../../components/services/ServiceCard";
import FetchErrorBanner from "../../components/common/FetchErrorBanner";
import EmptyState from "../../components/common/EmptyState";

const STEPS = [
  {
    number: "01",
    title: "Explore services",
    description:
      "Browse verified local home services and compare upfront pricing across categories.",
    icon: Search,
  },
  {
    number: "02",
    title: "Request a booking",
    description:
      "Pick a date and time slot that fits your schedule, then send your request in seconds.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "Get it done",
    description:
      "Once your provider accepts, track your booking status until the work is complete.",
    icon: CheckCircle2,
  },
];

const TRUST_HIGHLIGHTS = [
  {
    title: "Verified Local Pros",
    description:
      "Every provider profile is reviewed before offering services on DoorAssist.",
    icon: ShieldCheck,
  },
  {
    title: "Transparent Pricing",
    description:
      "See fixed or starting rates upfront with zero hidden booking charges.",
    icon: IndianRupee,
  },
  {
    title: "Flexible Scheduling",
    description:
      "Choose time slots aligned with real provider availability windows.",
    icon: Clock,
  },
];

const FALLBACK_TAGS = ["Home Cleaning", "AC Repair", "Plumbing", "Electrical"];

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);

  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);

  const [categoriesError, setCategoriesError] = useState("");
  const [servicesError, setServicesError] = useState("");

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError("");

    try {
      const response = await getActiveCategories();
      setCategories(response.data.data.categories || []);
    } catch {
      setCategoriesError("Unable to load categories.");
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const fetchServices = useCallback(async () => {
    setServicesLoading(true);
    setServicesError("");

    try {
      const response = await getActiveServices({
        page: 1,
        limit: 6,
      });
      setServices(response.data.data.services || []);
    } catch {
      setServicesError("Unable to load services.");
    } finally {
      setServicesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, [fetchCategories, fetchServices]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = search.trim();

    if (!query) {
      navigate("/services");
      return;
    }

    navigate(`/services?search=${encodeURIComponent(query)}`);
  };

  const quickTags =
    categories.length > 0
      ? categories.slice(0, 4).map((cat) => ({
          label: cat.name,
          to: `/services?categoryId=${cat._id}`,
        }))
      : FALLBACK_TAGS.map((tag) => ({
          label: tag,
          to: `/services?search=${encodeURIComponent(tag)}`,
        }));

  return (
    <div className="bg-[#fefcfb] space-y-16 px-4 py-8 sm:space-y-22 sm:px-6 sm:py-12 lg:px-8">
      {/* 1. Hero Section */}
      <section className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-[#d8e2eb] bg-white p-7 shadow-sm sm:p-12 lg:p-14">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Column: Value Proposition & Search */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-lg border border-[#d8e2eb] bg-[#f4f7fa] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#034078]">
                <span className="h-2 w-2 rounded-full bg-[#1282a2]" />
                <span>Trusted Local Home Services</span>
              </div>

              <h1 className="mt-6 text-4xl font-extrabold leading-[1.12] tracking-tight text-[#0a1128] sm:text-5xl lg:text-6xl">
                Home Services,
                <span className="mt-1 block text-[#034078]">Made Simple.</span>
              </h1>

              <p className="mt-5 max-w-xl text-sm font-medium leading-7 text-[#33415c] sm:text-base">
                Discover verified local providers for repairs, maintenance,
                cleaning, and more. Compare services and request a booking in
                seconds.
              </p>

              {/* Search Bar */}
              <form
                onSubmit={handleSearch}
                role="search"
                className="mt-8 flex flex-col gap-2 rounded-2xl border-2 border-[#cbd5e1] bg-[#fefcfb] p-2 transition-colors focus-within:border-[#034078] focus-within:bg-white sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2.5 pl-3">
                  <Search className="h-4 w-4 shrink-0 text-[#034078]" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="What service are you looking for?"
                    aria-label="Search services"
                    className="min-w-0 flex-1 bg-transparent py-2.5 text-sm font-medium text-[#0a1128] outline-none placeholder:text-[#64748b]"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#034078] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#001f54]"
                >
                  <span>Search Services</span>
                </button>
              </form>

              {/* Quick Discovery Pills */}
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wide text-[#64748b]">
                  Popular:
                </span>
                {quickTags.map((tag) => (
                  <Link
                    key={tag.label}
                    to={tag.to}
                    className="rounded-lg border border-[#d8e2eb] bg-[#fefcfb] px-3 py-1 text-xs font-semibold text-[#0a1128] transition-colors hover:border-[#1282a2] hover:bg-[#1282a2]/10 hover:text-[#034078]"
                  >
                    {tag.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Column: Booking Experience Preview Card */}
            <div className="hidden lg:col-span-5 lg:block">
              <div className="rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-6">
                <div className="flex items-center justify-between border-b border-[#d8e2eb] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0a1128] text-white">
                      <Wrench className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#1282a2]">
                        Instant Request
                      </p>
                      <h2 className="text-base font-extrabold text-[#0a1128]">
                        Doorstep Home Care
                      </h2>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-[#d8e2eb] bg-white p-3.5">
                    <div>
                      <p className="text-xs font-semibold text-[#64748b]">
                        Transparent Rates
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-[#0a1128]">
                        Upfront ₹ Service Pricing
                      </p>
                    </div>
                    <span className="rounded-md bg-[#034078]/10 px-2.5 py-1 text-xs font-bold text-[#034078]">
                      No Hidden Fees
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-[#d8e2eb] bg-white p-3.5">
                    <div>
                      <p className="text-xs font-semibold text-[#64748b]">
                        Flexible Time Windows
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-[#0a1128]">
                        Book Slots That Fit You
                      </p>
                    </div>
                    <span className="rounded-md bg-[#1282a2]/10 px-2.5 py-1 text-xs font-bold text-[#1282a2]">
                      Real-Time Status
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-[#d8e2eb] bg-white p-3.5">
                    <div>
                      <p className="text-xs font-semibold text-[#64748b]">
                        Community Rated
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-[#0a1128]">
                        Verified Customer Reviews
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      Trusted Pros
                    </span>
                  </div>
                </div>

                <Link
                  to="/services"
                  className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#0a1128] px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-[#001f54]"
                >
                  <span>Explore All Available Services</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Categories */}
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#d8e2eb] pb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#1282a2]">
              Categories
            </p>
            <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-[#0a1128] sm:text-3xl">
              Services for every home
            </h2>
            <p className="mt-1 text-sm font-medium text-[#33415c]">
              Browse specialized categories to quickly find the right help.
            </p>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-1 rounded-xl border border-[#cbd5e1] bg-white px-4 py-2 text-xs font-bold text-[#0a1128] transition-colors hover:border-[#034078] hover:text-[#034078] sm:text-sm"
          >
            <span>View all categories</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-7">
          {categoriesLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 animate-pulse">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center rounded-2xl border border-[#d8e2eb] bg-white p-6 text-center"
                >
                  <div className="h-12 w-12 rounded-xl bg-[#e2e8f0]" />
                  <div className="mt-3 h-4 w-20 rounded bg-[#e2e8f0]" />
                </div>
              ))}
            </div>
          ) : categoriesError ? (
            <FetchErrorBanner
              message={categoriesError}
              onRetry={fetchCategories}
            />
          ) : categories.length === 0 ? (
            <EmptyState
              icon={<Layers className="h-7 w-7 text-[#034078]" />}
              title="No categories available right now"
              message="Check back soon as we add new service categories."
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {categories.slice(0, 6).map((category) => (
                <CategoryCard key={category._id} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. Featured Services */}
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#d8e2eb] pb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#1282a2]">
              Featured
            </p>
            <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-[#0a1128] sm:text-3xl">
              Explore Latest Services
            </h2>
            <p className="mt-1 text-sm font-medium text-[#33415c]">
              Recently listed services from verified local providers.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-1 rounded-xl border border-[#cbd5e1] bg-white px-4 py-2 text-xs font-bold text-[#0a1128] transition-colors hover:border-[#034078] hover:text-[#034078] sm:text-sm"
          >
            <span>View All Services</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-7">
          {servicesLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-88 rounded-2xl border border-[#d8e2eb] bg-white"
                />
              ))}
            </div>
          ) : servicesError ? (
            <FetchErrorBanner message={servicesError} onRetry={fetchServices} />
          ) : services.length === 0 ? (
            <EmptyState
              icon={<Briefcase className="h-7 w-7 text-[#034078]" />}
              title="No services available right now"
              message="New services from local providers will appear here soon."
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#1282a2]">
            Simple Process
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#0a1128] sm:text-3xl">
            How DoorAssist Works
          </h2>
          <p className="mt-2.5 text-sm font-medium text-[#33415c] sm:text-base">
            From finding a service to getting your booking accepted, everything
            takes just three simple steps.
          </p>
        </div>

        <div className="mt-9 grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="rounded-2xl border border-[#d8e2eb] bg-white p-7 shadow-xs transition-colors hover:border-[#1282a2]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#034078] text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="font-mono text-2xl font-extrabold text-[#cbd5e1]">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-extrabold text-[#0a1128]">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm font-medium leading-6 text-[#33415c]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Why DoorAssist (Trust & Safety Strip) */}
      <section className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-[#d8e2eb] bg-white p-7 sm:p-10">
          <div className="grid gap-8 md:grid-cols-3">
            {TRUST_HIGHLIGHTS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#0a1128]">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm font-medium leading-6 text-[#33415c]">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Unified Dual-Audience CTA (Customers + Providers) */}
      <section className="mx-auto max-w-7xl pb-4">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Customer Card (Dark Prussian Anchor) */}
          <div className="rounded-3xl bg-[#0a1128] p-8 text-white sm:p-10">
            <span className="inline-block rounded-md bg-[#1282a2] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              For Homeowners
            </span>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Need help around your home?
            </h2>
            <p className="mt-3 max-w-md text-sm font-medium leading-6 text-[#cbd5e1]">
              Explore trusted services on DoorAssist and book a verified local
              professional in minutes.
            </p>
            <Link
              to="/services"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#0a1128] transition-colors hover:bg-[#e2e8f0]"
            >
              <span>Explore Services</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Provider Card (Crisp White Contrast) */}
          <div className="rounded-3xl border border-[#d8e2eb] bg-white p-8 sm:p-10">
            <span className="inline-block rounded-md border border-[#d8e2eb] bg-[#f4f7fa] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#034078]">
              For Professionals
            </span>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-[#0a1128] sm:text-3xl">
              Are you a service provider?
            </h2>
            <p className="mt-3 max-w-md text-sm font-medium leading-6 text-[#33415c]">
              Apply to join DoorAssist, manage your schedule, and connect with
              customers in your service area.
            </p>
            <Link
              to="/become-provider"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#034078] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#001f54]"
            >
              <span>Become a Provider</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
