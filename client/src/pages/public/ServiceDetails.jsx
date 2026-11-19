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
      <div className="min-h-screen bg-[#fefcfb] px-4 py-10 sm:px-6 lg:px-8">
        <div
          role="status"
          className="mx-auto max-w-7xl space-y-6 animate-pulse"
        >
          <div className="h-6 w-56 rounded bg-[#e2e8f0]" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="h-80 rounded-2xl border border-[#d8e2eb] bg-white" />
              <div className="h-64 rounded-2xl border border-[#d8e2eb] bg-white" />
            </div>
            <div className="h-80 rounded-2xl border border-[#d8e2eb] bg-white" />
          </div>
          <span className="sr-only">Loading service details...</span>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-[#fefcfb] px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-[#d8e2eb] bg-white p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-600">
            <AlertCircle className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-2xl font-extrabold text-[#0a1128]">
            Service Unavailable
          </h1>

          <p role="alert" className="mt-3 text-sm font-medium text-[#33415c]">
            {error || "This service could not be found."}
          </p>

          <Link
            to="/services"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#034078] px-6 py-3 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#001f54]"
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
    <div className="min-h-screen bg-[#fefcfb] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 inline-flex flex-wrap items-center gap-1.5 rounded-xl border border-[#d8e2eb] bg-white px-4 py-2 text-xs font-semibold text-[#33415c] shadow-xs sm:text-sm"
        >
          <Link to="/" className="transition-colors hover:text-[#034078]">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-[#64748b]" />
          <Link
            to="/services"
            className="transition-colors hover:text-[#034078]"
          >
            Services
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-[#64748b]" />
          <span className="font-bold text-[#0a1128]">{service.name}</span>
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-7 lg:col-span-2">
            {/* Service image */}
            <div className="overflow-hidden rounded-2xl border border-[#d8e2eb] bg-white shadow-xs">
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-64 w-full object-cover sm:h-96"
                />
              ) : (
                <div className="flex h-64 items-center justify-center bg-[#f4f7fa] sm:h-96">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d8e2eb] bg-white text-[#034078]">
                    <Wrench className="h-8 w-8" />
                  </div>
                </div>
              )}
            </div>

            {/* Service information */}
            <div className="rounded-2xl border border-[#d8e2eb] bg-white p-6 shadow-xs sm:p-8">
              <span className="inline-block rounded-lg border border-[#d8e2eb] bg-[#f4f7fa] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#034078]">
                {category?.name || "Home Service"}
              </span>

              <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[#0a1128] sm:text-3xl">
                {service.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-bold text-[#0a1128] sm:text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#d8e2eb] bg-[#f4f7fa] px-3.5 py-1.5">
                  <Clock className="h-4 w-4 text-[#1282a2]" />
                  <span>{service.durationMinutes} minutes</span>
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#d8e2eb] bg-[#f4f7fa] px-3.5 py-1.5">
                  <Tag className="h-4 w-4 text-[#034078]" />
                  <span>{formattedPrice}</span>
                </span>
              </div>

              <div className="mt-7 border-t border-[#e2e8f0] pt-6">
                <h2 className="text-lg font-extrabold text-[#0a1128] sm:text-xl">
                  About this Service
                </h2>

                <p className="mt-3.5 whitespace-pre-line text-sm font-medium leading-7 text-[#33415c] sm:text-base">
                  {service.description ||
                    "No additional description is available for this service."}
                </p>
              </div>
            </div>

            {/* Provider information */}
            {provider && (
              <div className="rounded-2xl border border-[#d8e2eb] bg-white p-6 shadow-xs sm:p-8">
                <h2 className="text-lg font-extrabold text-[#0a1128] sm:text-xl">
                  Service Provider
                </h2>

                <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#d8e2eb] bg-[#f4f7fa]">
                    {provider.profileImage ? (
                      <img
                        src={provider.profileImage}
                        alt={provider.businessName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Store className="h-8 w-8 text-[#034078]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-extrabold text-[#0a1128]">
                      {provider.businessName}
                    </h3>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-[#33415c] sm:text-sm">
                      {provider.userId?.name && (
                        <span className="inline-flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-[#1282a2]" />
                          <span>Managed by {provider.userId.name}</span>
                        </span>
                      )}

                      {provider.experienceYears != null && (
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5 text-[#1282a2]" />
                          <span>
                            {provider.experienceYears} years experience
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/providers/${provider._id}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#cbd5e1] bg-white px-5 py-2.5 text-xs font-bold text-[#0a1128] transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078] sm:text-sm"
                  >
                    <span>View Profile</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>

                {provider.serviceAreas?.length > 0 && (
                  <div className="mt-6 border-t border-[#e2e8f0] pt-5">
                    <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#64748b]">
                      <MapPin className="h-3.5 w-3.5 text-[#1282a2]" />
                      <span>Service Areas</span>
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {provider.serviceAreas.map((area, index) => (
                        <span
                          key={`${area.city}-${area.state}-${index}`}
                          className="rounded-lg border border-[#d8e2eb] bg-[#f4f7fa] px-3 py-1.5 text-xs font-bold text-[#0a1128]"
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
            <div className="rounded-2xl border border-[#d8e2eb] bg-white p-6 shadow-sm sm:p-7">
              <p className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
                Service Price
              </p>

              <p className="mt-2 text-3xl font-black tracking-tight text-[#0a1128]">
                {formattedPrice}
              </p>

              <div className="mt-6 space-y-3.5 border-t border-[#e2e8f0] pt-5 text-xs font-semibold sm:text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-[#33415c]">Duration</span>
                  <span className="font-bold text-[#0a1128]">
                    {service.durationMinutes} mins
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-[#33415c]">Category</span>
                  <span className="font-bold text-[#0a1128]">
                    {category?.name || "Service"}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-[#33415c]">Booking Type</span>
                  <span className="font-bold text-[#0a1128]">
                    Request-based
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBooking}
                disabled={isBookingDisabled}
                className="mt-7 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#034078] px-6 py-3.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#001f54] disabled:pointer-events-none disabled:bg-[#e2e8f0] disabled:text-[#64748b]"
              >
                {!isBookingDisabled && <CalendarCheck className="h-4 w-4" />}
                <span>
                  {service.pricingType === "on_request" || service.price == null
                    ? "Price Confirmation Required"
                    : user && user.role !== "customer"
                      ? "Customer Account Required"
                      : "Request Booking"}
                </span>
              </button>

              <p className="mt-3.5 text-center text-xs font-medium leading-5 text-[#64748b]">
                Your booking request will be sent to the provider for
                acceptance.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
