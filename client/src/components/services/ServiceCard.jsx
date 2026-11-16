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
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/75 bg-white/80 shadow-[0_8px_30px_rgba(203,189,255,0.14)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#deabff]/70 hover:shadow-[0_14px_40px_rgba(203,189,255,0.28)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -bottom-12 h-36 w-36 rounded-full bg-[#acdcff]/20 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Image Wrapper with Floating Category Pill */}
      <div className="relative">
        <ServiceImage
          src={service.image}
          alt={service.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span className="absolute left-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/85 px-3 py-1 text-xs font-bold text-slate-800 shadow-xs backdrop-blur-xl">
          <Sparkles className="h-3 w-3 text-[#a575bf]" />
          <span>{category?.name || "Service"}</span>
        </span>
      </div>

      {/* Card Body */}
      <div className="relative z-10 flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="line-clamp-1 text-lg font-extrabold tracking-tight text-slate-900 transition-colors group-hover:text-[#7c56a8]">
          {service.name}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm font-medium leading-relaxed text-slate-500">
          {service.description || "Explore this service on DoorAssist."}
        </p>

        {/* Provider Row */}
        <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-600 sm:text-sm">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-[#e4a5ff]/30 via-[#cbbdff]/30 to-[#acdcff]/30 text-[#7c56a8] ring-1 ring-inset ring-[#deabff]/50">
            <Store className="h-3.5 w-3.5" />
          </div>
          <span className="truncate">
            By{" "}
            <strong className="font-bold text-slate-800">
              {provider?.businessName || "Service Provider"}
            </strong>
          </span>
        </div>

        {/* Footer: Price, Duration & CTA */}
        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between gap-3 border-t border-[#bfcaff]/30 pt-4">
            <div>
              <p className="text-base font-extrabold tracking-tight text-slate-900">
                {getPriceLabel()}
              </p>

              {service.durationMinutes != null && (
                <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                  <Clock className="h-3.5 w-3.5 text-[#7195c2]" />
                  <span>{service.durationMinutes} mins</span>
                </p>
              )}
            </div>

            <span className="inline-flex items-center gap-1 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-3.5 py-2 text-xs font-bold text-slate-900 shadow-sm shadow-[#cbbdff]/30 transition-all group-hover:brightness-105">
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
