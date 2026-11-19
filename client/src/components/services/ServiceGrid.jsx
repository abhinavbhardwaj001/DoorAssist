import { Sparkles } from "lucide-react";
import ServiceCard from "./ServiceCard";

const ServiceGrid = ({ services = [] }) => {
  if (services.length === 0) {
    return (
      <div className="mt-8 rounded-3xl border border-[#d8e2eb] bg-white p-10 text-center shadow-xs sm:p-12">
        <div className="mx-auto flex max-w-md flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d8e2eb] bg-[#f4f7fa] text-[#034078]">
            <Sparkles className="h-5 w-5" />
          </div>

          <h3 className="mt-4 text-base font-extrabold tracking-tight text-[#0a1128] sm:text-lg">
            No services available
          </h3>
          <p className="mt-1.5 text-sm font-medium leading-relaxed text-[#33415c]">
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
