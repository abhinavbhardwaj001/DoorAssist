import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  FileText,
  AlertCircle,
  AlertTriangle,
  Wrench,
  IndianRupee,
  Loader2,
  Store,
} from "lucide-react";
import { getServiceById } from "../../services/service.api";
import { createBooking } from "../../services/booking.api";
import { useNotification } from "../../context/NotificationContext";
import { formatServicePrice } from "../../utils/formatters";
import BookingStatusBadge from "../../components/common/BookingStatusBadge";

const RequestBooking = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [service, setService] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const [formData, setFormData] = useState({
    scheduledAt: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    customerNote: "",
  });

  useEffect(() => {
    let active = true;

    const fetchService = async () => {
      try {
        const response = await getServiceById(serviceId);

        if (active) {
          setService(response.data.data.service);
        }
      } catch (err) {
        if (active) {
          setFetchError(
            err.response?.data?.message || "Unable to load service details.",
          );
        }
      } finally {
        if (active) setPageLoading(false);
      }
    };

    fetchService();

    return () => {
      active = false;
    };
  }, [serviceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const serviceAreas = service?.providerId?.serviceAreas || [];

  const handleServiceAreaChange = (e) => {
    const index = Number(e.target.value);
    const area = serviceAreas[index];

    setFormData((prev) => ({
      ...prev,
      city: area?.city || "",
      state: area?.state || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting || !service) return;

    if (!formData.city || !formData.state) {
      showNotification("Please select a service area.", "error");
      return;
    }

    if (!formData.scheduledAt) {
      showNotification("Please select a booking date and time.", "error");
      return;
    }

    const scheduledDate = new Date(`${formData.scheduledAt}:00+05:30`);

    if (Number.isNaN(scheduledDate.getTime()) || scheduledDate <= new Date()) {
      showNotification("Please select a valid future date and time.", "error");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        serviceId,
        scheduledAt: scheduledDate.toISOString(),
        address: {
          addressLine: formData.addressLine.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        },
        customerNote: formData.customerNote.trim(),
      };

      await createBooking(payload);
      showNotification("Booking request submitted successfully!", "success");
      navigate("/bookings", { replace: true });
    } catch (err) {
      showNotification(
        err.response?.data?.message ||
          "Unable to create booking. Please try again.",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#cbd5e1] bg-[#fefcfb] px-4 py-3 text-sm font-medium text-[#0a1128] placeholder:text-[#64748b] transition-all outline-none focus:border-[#1282a2] focus:bg-white focus:ring-3 focus:ring-[#1282a2]/20 disabled:cursor-not-allowed disabled:opacity-60";

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-[#fefcfb] px-4 py-10 sm:px-6 lg:px-8">
        <div
          role="status"
          className="mx-auto max-w-5xl space-y-6 animate-pulse"
        >
          <div className="h-9 w-40 rounded-xl bg-[#e2e8f0]" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="h-96 rounded-3xl border border-[#d8e2eb] bg-white lg:col-span-2" />
            <div className="h-80 rounded-3xl border border-[#d8e2eb] bg-white" />
          </div>
          <span className="sr-only">Loading booking details...</span>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#fefcfb] px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-[#d8e2eb] bg-white p-8 text-center shadow-xs sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-600">
            <AlertCircle className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-2xl font-extrabold text-[#0a1128]">
            Service Unavailable
          </h1>

          <p role="alert" className="mt-3 text-sm font-medium text-[#33415c]">
            {fetchError || "This service could not be found."}
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

  const cannotBook =
    service.pricingType === "on_request" || service.price == null;

  const provider = service.providerId;

  const selectedAreaIndex = serviceAreas.findIndex(
    (area) => area.city === formData.city && area.state === formData.state,
  );

  return (
    <div className="min-h-screen bg-[#fefcfb] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          to={`/services/${serviceId}`}
          className="inline-flex items-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-4 py-2.5 text-xs font-bold text-[#0a1128] shadow-xs transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078] sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4 text-[#1282a2]" />
          <span>Back to Service</span>
        </Link>

        {/* Page Header Card */}
        <div className="mt-6 rounded-3xl border border-[#d8e2eb] bg-white p-6 shadow-xs sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-lg border border-[#d8e2eb] bg-[#f4f7fa] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#034078]">
            <span className="h-2 w-2 rounded-full bg-[#1282a2]" />
            <span>Schedule Appointment</span>
          </div>

          <h1 className="mt-3.5 text-2xl font-extrabold tracking-tight text-[#0a1128] sm:text-3xl">
            Request a Booking
          </h1>

          <p className="mt-1.5 text-sm font-medium text-[#33415c]">
            Choose a date, time, and service address to send your request to the
            provider.
          </p>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-3">
          {/* Booking Form */}
          <div className="rounded-3xl border border-[#d8e2eb] bg-white p-6 shadow-xs sm:p-8 lg:col-span-2">
            {cannotBook && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                <span>
                  This service requires price confirmation before booking.
                  Online booking is not currently available.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-7">
              {/* 1. Date and Time */}
              <div>
                <div className="mb-4 flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]">
                    <Calendar className="h-4 w-4 text-[#1282a2]" />
                  </div>
                  <h2 className="text-lg font-extrabold text-[#0a1128]">
                    1. Booking Date & Time
                  </h2>
                </div>

                <label
                  htmlFor="scheduledAt"
                  className="text-xs font-bold uppercase tracking-wider text-[#0a1128]"
                >
                  Preferred Date & Time (IST)
                </label>

                <input
                  id="scheduledAt"
                  type="datetime-local"
                  name="scheduledAt"
                  value={formData.scheduledAt}
                  onChange={handleChange}
                  required
                  disabled={cannotBook}
                  className={inputClass}
                />

                <p className="mt-2 text-xs font-medium text-[#64748b]">
                  All booking times are in Indian Standard Time. The provider
                  must be available for the entire service duration.
                </p>
              </div>

              {/* 2. Service Address */}
              <div className="border-t border-[#e2e8f0] pt-7">
                <div className="mb-5 flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]">
                    <MapPin className="h-4 w-4 text-[#1282a2]" />
                  </div>
                  <h2 className="text-lg font-extrabold text-[#0a1128]">
                    2. Service Address
                  </h2>
                </div>

                <div className="space-y-5">
                  {serviceAreas.length > 0 ? (
                    <div>
                      <label
                        htmlFor="serviceArea"
                        className="text-xs font-bold uppercase tracking-wider text-[#0a1128]"
                      >
                        Service Area
                      </label>

                      <select
                        id="serviceArea"
                        value={
                          selectedAreaIndex >= 0
                            ? String(selectedAreaIndex)
                            : ""
                        }
                        onChange={handleServiceAreaChange}
                        required
                        disabled={cannotBook}
                        className={inputClass}
                      >
                        <option value="">Select your service area</option>

                        {serviceAreas.map((area, index) => (
                          <option
                            key={`${area.city}-${area.state}-${index}`}
                            value={index}
                          >
                            {area.city}, {area.state}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="city"
                          className="text-xs font-bold uppercase tracking-wider text-[#0a1128]"
                        >
                          City
                        </label>

                        <input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          minLength={2}
                          maxLength={100}
                          placeholder="Enter city"
                          disabled={cannotBook}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="state"
                          className="text-xs font-bold uppercase tracking-wider text-[#0a1128]"
                        >
                          State
                        </label>

                        <input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                          minLength={2}
                          maxLength={100}
                          placeholder="Enter state"
                          disabled={cannotBook}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="addressLine"
                      className="text-xs font-bold uppercase tracking-wider text-[#0a1128]"
                    >
                      Full Address
                    </label>

                    <textarea
                      id="addressLine"
                      name="addressLine"
                      value={formData.addressLine}
                      onChange={handleChange}
                      placeholder="House number, street, locality, landmark"
                      rows={3}
                      minLength={5}
                      maxLength={200}
                      required
                      disabled={cannotBook}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="pincode"
                      className="text-xs font-bold uppercase tracking-wider text-[#0a1128]"
                    >
                      Pincode
                    </label>

                    <input
                      id="pincode"
                      type="text"
                      inputMode="numeric"
                      name="pincode"
                      value={formData.pincode}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6);

                        setFormData((prev) => ({
                          ...prev,
                          pincode: value,
                        }));
                      }}
                      placeholder="6-digit pincode"
                      pattern="[1-9][0-9]{5}"
                      maxLength={6}
                      required
                      disabled={cannotBook}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* 3. Additional Details */}
              <div className="border-t border-[#e2e8f0] pt-7">
                <div className="mb-4 flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]">
                    <FileText className="h-4 w-4 text-[#1282a2]" />
                  </div>
                  <h2 className="text-lg font-extrabold text-[#0a1128]">
                    3. Additional Details
                  </h2>
                </div>

                <div className="flex items-center justify-between">
                  <label
                    htmlFor="customerNote"
                    className="text-xs font-bold uppercase tracking-wider text-[#0a1128]"
                  >
                    Note for Provider (Optional)
                  </label>

                  <span className="text-xs font-semibold text-[#64748b]">
                    {formData.customerNote.length}/500
                  </span>
                </div>

                <textarea
                  id="customerNote"
                  name="customerNote"
                  value={formData.customerNote}
                  onChange={handleChange}
                  placeholder="Anything the provider should know?"
                  maxLength={500}
                  rows={4}
                  disabled={cannotBook}
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={submitting || cannotBook}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#034078] px-6 py-3.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#001f54] disabled:pointer-events-none disabled:opacity-55"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>
                  {submitting
                    ? "Submitting Request..."
                    : "Submit Booking Request"}
                </span>
              </button>

              <p className="text-center text-xs font-medium leading-5 text-[#64748b]">
                Your booking will remain pending until the provider accepts it.
              </p>
            </form>
          </div>

          {/* Service Summary Sidebar */}
          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-3xl border border-[#d8e2eb] bg-white shadow-xs">
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center border-b border-[#e2e8f0] bg-[#f4f7fa]">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d8e2eb] bg-white text-[#034078] shadow-xs">
                    <Wrench className="h-8 w-8" />
                  </div>
                </div>
              )}

              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#1282a2]">
                  Booking Summary
                </p>

                <h2 className="mt-2 text-xl font-extrabold tracking-tight text-[#0a1128]">
                  {service.name}
                </h2>

                <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#33415c] sm:text-sm">
                  <Store className="h-3.5 w-3.5 text-[#1282a2]" />
                  <span>By {provider?.businessName || "Service Provider"}</span>
                </p>

                <div className="mt-6 space-y-3.5 border-t border-[#e2e8f0] pt-5 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 font-medium text-[#33415c]">
                      <IndianRupee className="h-3.5 w-3.5 text-[#1282a2]" />
                      <span>Price</span>
                    </span>
                    <span className="font-extrabold text-[#0a1128]">
                      {formatServicePrice(service)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 font-medium text-[#33415c]">
                      <Clock className="h-3.5 w-3.5 text-[#1282a2]" />
                      <span>Duration</span>
                    </span>
                    <span className="font-extrabold text-[#0a1128]">
                      {service.durationMinutes} mins
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-[#33415c]">Status</span>
                    <BookingStatusBadge
                      status="pending"
                      label="Pending approval"
                    />
                  </div>
                </div>

                <p className="mt-6 rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-3.5 text-xs font-medium leading-5 text-[#33415c]">
                  Service prices are determined by the provider. Submitting a
                  request does not guarantee acceptance until confirmed.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default RequestBooking;
