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
  Sparkles,
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
    "mt-2 w-full rounded-2xl border border-[#bfcaff]/50 bg-white/75 px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 shadow-xs backdrop-blur-md transition-all outline-none focus:border-[#a575bf] focus:bg-white focus:ring-4 focus:ring-[#cbbdff]/30 disabled:cursor-not-allowed disabled:opacity-60";

  if (pageLoading) {
    return (
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div
          role="status"
          className="mx-auto max-w-5xl space-y-6 animate-pulse"
        >
          <div className="h-5 w-36 rounded-full bg-white/75" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="h-96 rounded-4xl border border-white/70 bg-white/65 lg:col-span-2" />
            <div className="h-80 rounded-4xl border border-white/70 bg-white/65" />
          </div>
          <span className="sr-only">Loading booking details...</span>
        </div>
      </div>
    );
  }

  if (!service) {
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
            {fetchError || "This service could not be found."}
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

  const cannotBook =
    service.pricingType === "on_request" || service.price == null;

  const provider = service.providerId;

  const selectedAreaIndex = serviceAreas.findIndex(
    (area) => area.city === formData.city && area.state === formData.state,
  );

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          to={`/services/${serviceId}`}
          className="inline-flex items-center gap-2 rounded-full border border-[#bfcaff]/45 bg-white/70 px-4 py-2 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-md transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-900 sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4 text-[#7c56a8]" />
          <span>Back to Service</span>
        </Link>

        {/* Page Header */}
        <div className="mt-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bfcaff]/40 bg-white/70 px-3.5 py-1 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#a575bf]" />
            <span>Schedule Appointment</span>
          </div>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Request a Booking
          </h1>

          <p className="mt-1.5 text-sm font-medium text-slate-500">
            Choose a date, time, and service address to send your request to the
            provider.
          </p>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-3">
          {/* Booking Form */}
          <div className="relative overflow-hidden rounded-4xl border border-white/75 bg-white/80 p-6 shadow-[0_12px_45px_rgba(203,189,255,0.2)] backdrop-blur-2xl sm:p-8 lg:col-span-2">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#e4a5ff]/15 blur-3xl"
            />

            {cannotBook && (
              <div className="relative z-10 mb-6 flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/85 p-4 text-sm font-medium text-amber-900">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <span>
                  This service requires price confirmation before booking.
                  Online booking is not currently available.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="relative z-10 space-y-7">
              {/* 1. Date and Time */}
              <div>
                <div className="mb-4 flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-[#7c56a8] ring-1 ring-inset ring-[#deabff]/60">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    1. Booking Date & Time
                  </h2>
                </div>

                <label
                  htmlFor="scheduledAt"
                  className="text-xs font-bold uppercase tracking-wider text-slate-600"
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

                <p className="mt-2 text-xs font-medium text-slate-500">
                  All booking times are in Indian Standard Time. The provider
                  must be available for the entire service duration.
                </p>
              </div>

              {/* 2. Service Address */}
              <div className="border-t border-[#bfcaff]/30 pt-7">
                <div className="mb-5 flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-[#7c56a8] ring-1 ring-inset ring-[#deabff]/60">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    2. Service Address
                  </h2>
                </div>

                <div className="space-y-5">
                  {serviceAreas.length > 0 ? (
                    <div>
                      <label
                        htmlFor="serviceArea"
                        className="text-xs font-bold uppercase tracking-wider text-slate-600"
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
                          className="text-xs font-bold uppercase tracking-wider text-slate-600"
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
                          className="text-xs font-bold uppercase tracking-wider text-slate-600"
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
                      className="text-xs font-bold uppercase tracking-wider text-slate-600"
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
                      className="text-xs font-bold uppercase tracking-wider text-slate-600"
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
              <div className="border-t border-[#bfcaff]/30 pt-7">
                <div className="mb-4 flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-[#7c56a8] ring-1 ring-inset ring-[#deabff]/60">
                    <FileText className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    3. Additional Details
                  </h2>
                </div>

                <div className="flex items-center justify-between">
                  <label
                    htmlFor="customerNote"
                    className="text-xs font-bold uppercase tracking-wider text-slate-600"
                  >
                    Note for Provider (Optional)
                  </label>

                  <span className="text-xs font-semibold text-slate-400">
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
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-6 py-3.5 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:scale-[1.01] hover:brightness-105 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-55"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>
                  {submitting
                    ? "Submitting Request..."
                    : "Submit Booking Request"}
                </span>
              </button>

              <p className="text-center text-xs font-medium leading-5 text-slate-500">
                Your booking will remain pending until the provider accepts it.
              </p>
            </form>
          </div>

          {/* Service Summary Sidebar */}
          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-4xl border border-white/75 bg-white/80 shadow-[0_12px_45px_rgba(203,189,255,0.2)] backdrop-blur-2xl">
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center bg-linear-to-br from-[#f6ebff] via-[#f4f1ff] to-[#ebf6ff]">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/80 bg-white/75 text-[#8b7cc8] shadow-sm backdrop-blur-xl">
                    <Wrench className="h-8 w-8" />
                  </div>
                </div>
              )}

              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#7c56a8]">
                  Booking Summary
                </p>

                <h2 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900">
                  {service.name}
                </h2>

                <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 sm:text-sm">
                  <Store className="h-3.5 w-3.5 text-[#7c56a8]" />
                  <span>By {provider?.businessName || "Service Provider"}</span>
                </p>

                <div className="mt-6 space-y-3.5 border-t border-[#bfcaff]/30 pt-5 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 font-medium text-slate-500">
                      <IndianRupee className="h-3.5 w-3.5 text-[#7c56a8]" />
                      <span>Price</span>
                    </span>
                    <span className="font-extrabold text-slate-900">
                      {formatServicePrice(service)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 font-medium text-slate-500">
                      <Clock className="h-3.5 w-3.5 text-[#7c56a8]" />
                      <span>Duration</span>
                    </span>
                    <span className="font-extrabold text-slate-900">
                      {service.durationMinutes} mins
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-slate-500">Status</span>
                    <BookingStatusBadge
                      status="pending"
                      label="Pending approval"
                    />
                  </div>
                </div>

                <p className="mt-6 rounded-2xl border border-[#bfcaff]/40 bg-white/60 p-3.5 text-xs font-medium leading-5 text-slate-500">
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
