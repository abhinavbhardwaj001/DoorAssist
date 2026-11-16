import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  CalendarCheck,
  ChevronRight,
  Clock,
  MapPin,
  Store,
  Tag,
  User,
  Wrench,
} from "lucide-react";
import { getServiceById } from "../../services/service.api";
import useAuth from "../../hooks/useAuth";
import { formatServicePrice } from "../../utils/formatters";

const ServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchService = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getServiceById(serviceId);
      setService(response.data.data.service);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load service details.",
      );
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  const handleBooking = () => {
    const bookingPath = `/services/${serviceId}/book`;

    if (!user) {
      navigate("/login", {
        state: {
          from: { pathname: bookingPath },
        },
      });
      return;
    }

    if (user.role !== "customer") {
      return;
    }

    navigate(bookingPath);
  };

  if (loading) {
    return (
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div
          role="status"
          className="mx-auto max-w-7xl space-y-6 animate-pulse"
        >
          <div className="h-6 w-56 rounded-full bg-white/75" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="h-80 rounded-4xl border border-white/70 bg-white/65" />
              <div className="h-64 rounded-4xl border border-white/70 bg-white/65" />
            </div>
            <div className="h-80 rounded-4xl border border-white/70 bg-white/65" />
          </div>
          <span className="sr-only">Loading service details...</span>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-4xl border border-white/75 bg-white/80 p-8 text-center shadow-[0_12px_45px_rgba(203,189,255,0.2)] backdrop-blur-2xl sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100/80 text-rose-600 ring-1 ring-inset ring-rose-200/80">
            <AlertCircle className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-2xl font-extrabold text-slate-900">
            Service Unavailable
          </h1>

          <p role="alert" className="mt-3 text-sm font-medium text-slate-500">
            {error || "This service could not be found."}
          </p>

          <Link
            to="/services"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-6 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:brightness-105"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Browse Services</span>
          </Link>
        </div>
      </div>
    );
  }

  const provider = service.providerId;
  const category = service.categoryId;
  const formattedPrice = formatServicePrice(service);

  const isBookingDisabled =
    Boolean(user && user.role !== "customer") ||
    service.pricingType === "on_request" ||
    service.price == null;

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 inline-flex flex-wrap items-center gap-1.5 rounded-full border border-[#bfcaff]/45 bg-white/70 px-4 py-2 text-xs font-bold text-slate-500 shadow-xs backdrop-blur-md sm:text-sm"
        >
          <Link to="/" className="transition-colors hover:text-[#7c56a8]">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <Link
            to="/services"
            className="transition-colors hover:text-[#7c56a8]"
          >
            Services
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-slate-900">{service.name}</span>
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-7 lg:col-span-2">
            {/* Service image */}
            <div className="overflow-hidden rounded-4xl border border-white/75 bg-white/80 shadow-[0_12px_45px_rgba(203,189,255,0.18)] backdrop-blur-2xl">
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-64 w-full object-cover sm:h-96"
                />
              ) : (
                <div className="flex h-64 items-center justify-center bg-linear-to-br from-[#f6ebff] via-[#f4f1ff] to-[#ebf6ff] sm:h-96">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/85 bg-white/80 text-[#8b7cc8] shadow-sm backdrop-blur-xl">
                    <Wrench className="h-10 w-10" />
                  </div>
                </div>
              )}
            </div>

            {/* Service information */}
            <div className="rounded-4xl border border-white/75 bg-white/80 p-6 shadow-[0_12px_45px_rgba(203,189,255,0.18)] backdrop-blur-2xl sm:p-8">
              <span className="inline-block rounded-full border border-[#deabff]/65 bg-linear-to-r from-[#f6ebff]/90 via-[#f4f1ff]/90 to-[#ebf6ff]/90 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-800 shadow-xs">
                {category?.name || "Home Service"}
              </span>

              <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {service.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600 sm:text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#bfcaff]/45 bg-white/75 px-3 py-1.5">
                  <Clock className="h-4 w-4 text-[#7c56a8]" />
                  <span>{service.durationMinutes} minutes</span>
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#bfcaff]/45 bg-white/75 px-3 py-1.5">
                  <Tag className="h-4 w-4 text-[#7c56a8]" />
                  <span>{formattedPrice}</span>
                </span>
              </div>

              <div className="mt-7 border-t border-[#bfcaff]/30 pt-6">
                <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                  About this Service
                </h2>

                <p className="mt-3.5 whitespace-pre-line text-sm font-medium leading-7 text-slate-600 sm:text-base">
                  {service.description ||
                    "No additional description is available for this service."}
                </p>
              </div>
            </div>

            {/* Provider information */}
            {provider && (
              <div className="rounded-4xl border border-white/75 bg-white/80 p-6 shadow-[0_12px_45px_rgba(203,189,255,0.18)] backdrop-blur-2xl sm:p-8">
                <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                  Service Provider
                </h2>

                <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/85 bg-linear-to-br from-[#f6ebff] via-[#f4f1ff] to-[#ebf6ff] shadow-xs">
                    {provider.profileImage ? (
                      <img
                        src={provider.profileImage}
                        alt={provider.businessName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Store className="h-8 w-8 text-[#7c56a8]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {provider.businessName}
                    </h3>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-500 sm:text-sm">
                      {provider.userId?.name && (
                        <span className="inline-flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-[#7c56a8]" />
                          <span>Managed by {provider.userId.name}</span>
                        </span>
                      )}

                      {provider.experienceYears != null && (
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5 text-[#7c56a8]" />
                          <span>
                            {provider.experienceYears} years experience
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/providers/${provider._id}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#bfcaff]/60 bg-white/85 px-5 py-2.5 text-xs font-bold text-[#7c56a8] shadow-xs transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-900 active:scale-95 sm:text-sm"
                  >
                    <span>View Profile</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>

                {provider.serviceAreas?.length > 0 && (
                  <div className="mt-6 border-t border-[#bfcaff]/30 pt-5">
                    <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <MapPin className="h-3.5 w-3.5 text-[#7c56a8]" />
                      <span>Service Areas</span>
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {provider.serviceAreas.map((area, index) => (
                        <span
                          key={`${area.city}-${area.state}-${index}`}
                          className="rounded-xl border border-[#deabff]/55 bg-linear-to-r from-[#f6ebff]/85 via-[#f4f1ff]/85 to-[#ebf6ff]/85 px-3 py-1.5 text-xs font-bold text-slate-700"
                        >
                          {area.city}, {area.state}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Booking panel */}
          <aside className="lg:sticky lg:top-24">
            <div className="relative overflow-hidden rounded-4xl border border-white/80 bg-white/85 p-6 shadow-[0_14px_45px_rgba(203,189,255,0.22)] backdrop-blur-2xl sm:p-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-[#e4a5ff]/20 blur-3xl"
              />

              <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Service Price
                </p>

                <p className="mt-2 bg-linear-to-r from-[#8e54b5] via-[#6669c7] to-[#3b82b8] bg-clip-text text-3xl font-black tracking-tight text-transparent">
                  {formattedPrice}
                </p>

                <div className="mt-6 space-y-3.5 border-t border-[#bfcaff]/30 pt-5 text-xs font-semibold sm:text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Duration</span>
                    <span className="font-bold text-slate-900">
                      {service.durationMinutes} mins
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Category</span>
                    <span className="font-bold text-slate-900">
                      {category?.name || "Service"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Booking Type</span>
                    <span className="font-bold text-slate-900">
                      Request-based
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBooking}
                  disabled={isBookingDisabled}
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-6 py-3.5 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/35 transition-all hover:scale-[1.01] hover:brightness-105 active:scale-[0.99] disabled:pointer-events-none disabled:bg-slate-200 disabled:bg-none disabled:text-slate-500 disabled:shadow-none"
                >
                  {!isBookingDisabled && <CalendarCheck className="h-4 w-4" />}
                  <span>
                    {service.pricingType === "on_request" ||
                    service.price == null
                      ? "Price Confirmation Required"
                      : user && user.role !== "customer"
                        ? "Customer Account Required"
                        : "Request Booking"}
                  </span>
                </button>

                <p className="mt-3.5 text-center text-xs font-medium leading-5 text-slate-500">
                  Your booking request will be sent to the provider for
                  acceptance.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
