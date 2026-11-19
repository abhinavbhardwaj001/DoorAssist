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
    <div className="group rounded-3xl border border-[#d8e2eb] border-l-4 border-l-[#034078] bg-white p-6 shadow-xs transition-colors hover:border-[#1282a2] hover:border-l-[#1282a2]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold tracking-tight text-[#0a1128]">
            {serviceName}
          </h3>
          <p className="mt-1 text-sm font-medium text-[#33415c]">
            {providerName}
          </p>
        </div>

        <BookingStatus status={booking.status} />
      </div>

      <div className="mt-6 grid gap-4 border-t border-[#e2e8f0] pt-5 sm:grid-cols-2">
        {/* Scheduled Date */}
        <div className="flex items-start gap-3 rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-3.5">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#d8e2eb] bg-white text-[#1282a2]">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
              Scheduled Date
            </p>
            <p className="mt-1 text-sm font-extrabold text-[#0a1128]">
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Service Price */}
        <div className="flex items-start gap-3 rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-3.5">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#d8e2eb] bg-white text-[#034078]">
            <IndianRupee className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
              Service Price
            </p>
            <p className="mt-1 text-sm font-extrabold text-[#0a1128]">
              {price}
            </p>
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-start gap-3 rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-3.5">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#d8e2eb] bg-white text-[#1282a2]">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
              Duration
            </p>
            <p className="mt-1 text-sm font-extrabold text-[#0a1128]">
              {booking.durationMinutes != null
                ? `${booking.durationMinutes} minutes`
                : "Not available"}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-3 rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] p-3.5">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#d8e2eb] bg-white text-[#1282a2]">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
              Location
            </p>
            <p className="mt-1 text-sm font-extrabold text-[#0a1128]">
              {[booking.address?.city, booking.address?.state]
                .filter(Boolean)
                .join(", ") || "Not available"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-[#e2e8f0] pt-5">
        <Link
          to={`/bookings/${booking._id}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#034078] px-5 py-3 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#001f54] sm:w-auto"
        >
          <span>View Details</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default BookingCard;
