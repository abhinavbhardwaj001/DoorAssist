import { Sparkles } from "lucide-react";
import ServiceCard from "./ServiceCard";

const ServiceGrid = ({ services = [] }) => {
  if (services.length === 0) {
    return (
      <div className="relative mt-8 overflow-hidden rounded-3xl border border-white/75 bg-white/80 p-10 text-center shadow-[0_8px_35px_rgba(203,189,255,0.16)] backdrop-blur-2xl sm:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-14 -top-14 h-40 w-40 rounded-full bg-[#e4a5ff]/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-14 -right-14 h-40 w-40 rounded-full bg-[#acdcff]/25 blur-3xl"
        />

        <div className="relative z-10 mx-auto flex max-w-md flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 text-[#7c56a8] ring-1 ring-inset ring-[#deabff]/60">
            <Sparkles className="h-5 w-5" />
          </div>

          <h3 className="mt-4 text-base font-extrabold text-slate-900 sm:text-lg">
            No services available
          </h3>
          <p className="mt-1.5 text-sm font-medium leading-relaxed text-slate-500">
            Check back soon or adjust your filters to explore available
            offerings on DoorAssist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service._id} service={service} />
      ))}
    </div>
  );
};

export default ServiceGrid;
