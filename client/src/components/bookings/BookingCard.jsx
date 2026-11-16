import { Link } from "react-router-dom";
import {
  Calendar,
  IndianRupee,
  Clock,
  MapPin,
  ChevronRight,
} from "lucide-react";
import BookingStatus from "./BookingStatus";

const BookingCard = ({ booking }) => {
  const serviceName =
    booking.serviceName || booking.serviceId?.name || "Service";

  const providerName = booking.providerId?.businessName || "Service Provider";

  const formattedDate = booking.scheduledAt
    ? new Date(booking.scheduledAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "Not available";

  const price =
    booking.price == null
      ? "Not available"
      : `₹${Number(booking.price).toLocaleString("en-IN")}`;

  return (
    <div className="group rounded-3xl border border-white/60 bg-white/70 p-6 shadow-[0_8px_30px_rgba(203,189,255,0.15)] backdrop-blur-xl transition-all hover:shadow-[0_8px_40px_rgba(203,189,255,0.25)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-800">
            {serviceName}
          </h3>
          <p className="mt-1 font-medium text-slate-500">{providerName}</p>
        </div>

        <BookingStatus status={booking.status} />
      </div>

      <div className="mt-6 grid gap-5 border-t border-[#bfcaff]/30 pt-5 sm:grid-cols-2">
        {/* Scheduled Date */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#b2d6ff]/30 text-[#7195c2]">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">
              Scheduled Date
            </p>
            <p className="mt-1 text-sm font-bold text-slate-800">
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Service Price */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e4a5ff]/20 text-[#a575bf]">
            <IndianRupee className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">
              Service Price
            </p>
            <p className="mt-1 text-sm font-bold text-slate-800">{price}</p>
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#cbbdff]/20 text-[#9687c7]">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Duration</p>
            <p className="mt-1 text-sm font-bold text-slate-800">
              {booking.durationMinutes != null
                ? `${booking.durationMinutes} minutes`
                : "Not available"}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#acdcff]/30 text-[#729dbd]">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Location</p>
            <p className="mt-1 text-sm font-bold text-slate-800">
              {[booking.address?.city, booking.address?.state]
                .filter(Boolean)
                .join(", ") || "Not available"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-[#bfcaff]/30 pt-5">
        <Link
          to={`/bookings/${booking._id}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/50 px-5 py-3 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-inset ring-[#bfcaff]/50 transition-all hover:bg-linear-to-r hover:from-[#e4a5ff]/20 hover:to-[#acdcff]/20 hover:text-slate-900 hover:ring-[#deabff] sm:w-auto"
        >
          View Details
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default BookingCard;
