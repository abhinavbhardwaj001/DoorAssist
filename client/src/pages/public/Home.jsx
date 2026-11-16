import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Sparkles,
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
    <div className="space-y-16 px-4 py-8 sm:space-y-22 sm:px-6 sm:py-12 lg:px-8">
      {/* 1. Hero Section */}
      <section className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-4xl border border-white/75 bg-white/70 p-7 shadow-[0_16px_55px_rgba(203,189,255,0.22)] backdrop-blur-2xl sm:p-12 lg:p-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#e4a5ff]/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 right-10 h-72 w-72 rounded-full bg-[#acdcff]/30 blur-3xl"
          />

          <div className="relative z-10 grid items-center gap-12 lg:grid-cols-12">
            {/* Left Column: Value Proposition & Search */}
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#bfcaff]/50 bg-white/85 px-4 py-1.5 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-[#a575bf]" />
                <span>Your everyday home-service companion</span>
              </span>

              <h1 className="mt-6 text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Home Services,
                <span className="mt-1 block bg-linear-to-r from-[#8e54b5] via-[#6669c7] to-[#3b82b8] bg-clip-text text-transparent">
                  Made Simple.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm font-medium leading-7 text-slate-600 sm:text-base">
                Discover verified local providers for repairs, maintenance,
                cleaning, and more. Compare services and request a booking in
                seconds.
              </p>

              {/* Search Bar */}
              <form
                onSubmit={handleSearch}
                role="search"
                className="mt-8 flex flex-col gap-2.5 rounded-2xl border border-[#bfcaff]/60 bg-white/90 p-2.5 shadow-[0_10px_35px_rgba(203,189,255,0.24)] backdrop-blur-xl sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2.5 pl-3">
                  <Search className="h-4 w-4 shrink-0 text-[#7c56a8]" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="What service are you looking for?"
                    aria-label="Search services"
                    className="min-w-0 flex-1 bg-transparent py-2.5 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-6 py-3 text-sm font-bold text-slate-900 shadow-md shadow-[#cbbdff]/30 transition-all hover:scale-[1.01] hover:brightness-105 active:scale-[0.99]"
                >
                  <span>Search Services</span>
                </button>
              </form>

              {/* Quick Discovery Pills */}
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400">
                  Popular:
                </span>
                {quickTags.map((tag) => (
                  <Link
                    key={tag.label}
                    to={tag.to}
                    className="rounded-full border border-[#bfcaff]/45 bg-white/75 px-3 py-1 text-xs font-bold text-slate-700 transition-all hover:border-[#deabff] hover:bg-white hover:text-[#7c56a8]"
                  >
                    {tag.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Column: Booking Experience Preview Card */}
            <div className="relative hidden lg:col-span-5 lg:block">
              <div className="rounded-3xl border border-white/85 bg-white/80 p-6 shadow-[0_14px_45px_rgba(203,189,255,0.24)] backdrop-blur-2xl">
                <div className="flex items-center justify-between border-b border-[#bfcaff]/30 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-[#e4a5ff]/40 via-[#cbbdff]/40 to-[#acdcff]/40 text-[#7c56a8] ring-1 ring-inset ring-[#deabff]/60">
                      <Wrench className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wider text-[#7c56a8]">
                        Instant Request
                      </p>
                      <h2 className="text-base font-extrabold text-slate-900">
                        Doorstep Home Care
                      </h2>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between rounded-2xl border border-[#bfcaff]/40 bg-white/85 p-3.5">
                    <div>
                      <p className="text-xs font-semibold text-slate-400">
                        Transparent Rates
                      </p>
                      <p className="mt-0.5 text-sm font-extrabold text-slate-900">
                        Upfront ₹ Service Pricing
                      </p>
                    </div>
                    <span className="rounded-xl bg-[#f6ebff] px-3 py-1 text-xs font-extrabold text-[#7c56a8]">
                      No Hidden Fees
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-[#bfcaff]/40 bg-white/85 p-3.5">
                    <div>
                      <p className="text-xs font-semibold text-slate-400">
                        Flexible Time Windows
                      </p>
                      <p className="mt-0.5 text-sm font-extrabold text-slate-900">
                        Book Slots That Fit You
                      </p>
                    </div>
                    <span className="rounded-xl bg-[#ebf6ff] px-3 py-1 text-xs font-extrabold text-[#3b82b8]">
                      Real-Time Status
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-[#bfcaff]/40 bg-white/85 p-3.5">
                    <div>
                      <p className="text-xs font-semibold text-slate-400">
                        Community Rated
                      </p>
                      <p className="mt-0.5 text-sm font-extrabold text-slate-900">
                        Verified Customer Reviews
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-700">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      Trusted Pros
                    </span>
                  </div>
                </div>

                <Link
                  to="/services"
                  className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white transition hover:bg-slate-800"
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
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#7c56a8]">
              Categories
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Services for every home
            </h2>
            <p className="mt-1.5 text-sm font-medium text-slate-500">
              Browse specialized categories to quickly find the right help.
            </p>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-1 rounded-xl border border-[#bfcaff]/55 bg-white/80 px-4 py-2 text-xs font-bold text-[#7c56a8] shadow-xs backdrop-blur-md transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-900 sm:text-sm"
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
                  className="flex flex-col items-center justify-center rounded-3xl border border-white/75 bg-white/70 p-6 text-center"
                >
                  <div className="h-12 w-12 rounded-2xl bg-white/90" />
                  <div className="mt-3 h-4 w-20 rounded-full bg-white/90" />
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
              icon={<Layers className="h-7 w-7 text-[#7c56a8]" />}
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
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#7c56a8]">
              Featured
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Explore Latest Services
            </h2>
            <p className="mt-1.5 text-sm font-medium text-slate-500">
              Recently listed services from verified local providers.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-1 rounded-xl border border-[#bfcaff]/55 bg-white/80 px-4 py-2 text-xs font-bold text-[#7c56a8] shadow-xs backdrop-blur-md transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-900 sm:text-sm"
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
                  className="h-88 rounded-4xl border border-white/75 bg-white/70"
                />
              ))}
            </div>
          ) : servicesError ? (
            <FetchErrorBanner message={servicesError} onRetry={fetchServices} />
          ) : services.length === 0 ? (
            <EmptyState
              icon={<Briefcase className="h-7 w-7 text-[#7c56a8]" />}
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
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#7c56a8]">
            Simple Process
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            How DoorAssist Works
          </h2>
          <p className="mt-2.5 text-sm font-medium text-slate-500 sm:text-base">
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
                className="relative overflow-hidden rounded-4xl border border-white/75 bg-white/80 p-7 shadow-[0_8px_30px_rgba(203,189,255,0.16)] backdrop-blur-2xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-[#7c56a8] ring-1 ring-inset ring-[#deabff]/60">
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="bg-linear-to-r from-[#d1b7ff] to-[#acdcff] bg-clip-text text-3xl font-black text-transparent">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-extrabold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Why DoorAssist (Trust & Safety Strip) */}
      <section className="mx-auto max-w-7xl">
        <div className="rounded-4xl border border-white/75 bg-white/65 p-7 shadow-[0_12px_45px_rgba(203,189,255,0.16)] backdrop-blur-2xl sm:p-10">
          <div className="grid gap-8 md:grid-cols-3">
            {TRUST_HIGHLIGHTS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-[#7c56a8] ring-1 ring-inset ring-[#deabff]/60">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm font-medium leading-6 text-slate-500">
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
          {/* Customer Card */}
          <div className="relative overflow-hidden rounded-4xl border border-white/80 bg-linear-to-br from-[#e4a5ff]/45 via-[#cbbdff]/45 to-[#acdcff]/45 p-8 shadow-[0_14px_45px_rgba(203,189,255,0.24)] backdrop-blur-2xl sm:p-10">
            <span className="inline-block rounded-full bg-white/80 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#7c56a8]">
              For Homeowners
            </span>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Need help around your home?
            </h2>
            <p className="mt-3 max-w-md text-sm font-medium leading-6 text-slate-700">
              Explore trusted services on DoorAssist and book a verified local
              professional in minutes.
            </p>
            <Link
              to="/services"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition-all hover:scale-[1.02] hover:bg-slate-800 active:scale-[0.99]"
            >
              <span>Explore Services</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Provider Card */}
          <div className="relative overflow-hidden rounded-4xl border border-white/75 bg-white/80 p-8 shadow-[0_12px_40px_rgba(203,189,255,0.18)] backdrop-blur-2xl sm:p-10">
            <span className="inline-block rounded-full border border-[#deabff]/60 bg-[#f6ebff]/80 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#7c56a8]">
              For Professionals
            </span>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Are you a service provider?
            </h2>
            <p className="mt-3 max-w-md text-sm font-medium leading-6 text-slate-500">
              Apply to join DoorAssist, manage your schedule, and connect with
              customers in your service area.
            </p>
            <Link
              to="/become-provider"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-6 py-3 text-sm font-bold text-slate-900 shadow-md shadow-[#cbbdff]/30 transition-all hover:scale-[1.02] hover:brightness-105 active:scale-[0.99]"
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
