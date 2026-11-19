import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, Sparkles, Store } from "lucide-react";
import ServiceImage from "./ServiceImage";

const ServiceCard = ({ service }) => {
  const provider = service.providerId;
  const category = service.categoryId;

  const getPriceLabel = () => {
    if (service.pricingType === "on_request") {
      return "Price on request";
    }

    const price = Number(service.price);

    if (!Number.isFinite(price)) {
      return "Price unavailable";
    }

    const formattedPrice = `₹${price.toLocaleString("en-IN")}`;

    return service.pricingType === "starting_from"
      ? `From ${formattedPrice}`
      : formattedPrice;
  };

  return (
    <Link
      to={`/services/${service._id}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-[#d8e2eb] bg-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1282a2] hover:shadow-md"
    >
      {/* Image Wrapper with Category Pill */}
      <div className="relative overflow-hidden border-b border-[#e2e8f0] bg-[#f8fafc]">
        <ServiceImage
          src={service.image}
          alt={service.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <span className="absolute left-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-full border border-[#d8e2eb] bg-white px-3 py-1 text-xs font-bold text-[#034078] shadow-2xs">
          <Sparkles className="h-3 w-3 text-[#1282a2]" />
          <span>{category?.name || "Service"}</span>
        </span>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="line-clamp-1 text-lg font-extrabold tracking-tight text-[#0a1128] transition-colors group-hover:text-[#034078]">
          {service.name}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm font-medium leading-relaxed text-[#33415c]">
          {service.description || "Explore this service on DoorAssist."}
        </p>

        {/* Provider Row */}
        <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#64748b] sm:text-sm">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]">
            <Store className="h-3.5 w-3.5" />
          </div>
          <span className="truncate">
            By{" "}
            <strong className="font-bold text-[#0a1128]">
              {provider?.businessName || "Service Provider"}
            </strong>
          </span>
        </div>

        {/* Footer: Price, Duration & CTA */}
        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between gap-3 border-t border-[#e2e8f0] pt-4">
            <div>
              <p className="text-base font-extrabold tracking-tight text-[#0a1128]">
                {getPriceLabel()}
              </p>

              {service.durationMinutes != null && (
                <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#64748b]">
                  <Clock className="h-3.5 w-3.5 text-[#1282a2]" />
                  <span>{service.durationMinutes} mins</span>
                </p>
              )}
            </div>

            <span className="inline-flex items-center gap-1 rounded-xl bg-[#034078] px-3.5 py-2 text-xs font-bold text-white shadow-2xs transition-colors group-hover:bg-[#001f54]">
              <span>Details</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
