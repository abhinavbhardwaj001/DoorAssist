import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/services?categoryId=${category._id}`}
      className="group relative flex flex-col items-center rounded-3xl border border-white/60 bg-white/70 p-6 text-center shadow-[0_8px_30px_rgba(203,189,255,0.15)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#deabff]/60 hover:bg-white/90 hover:shadow-[0_12px_40px_rgba(203,189,255,0.25)]"
    >
      <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-[#b2d6ff]/40 via-[#cbbdff]/30 to-[#e4a5ff]/40 p-1 shadow-inner transition-transform duration-500 group-hover:scale-105">
        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-white/60 backdrop-blur-sm">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <Briefcase className="h-8 w-8 text-[#9687c7] transition-transform duration-300 group-hover:scale-110 group-hover:text-[#a575bf]" />
          )}
        </div>
      </div>

      <h3 className="mt-5 text-sm font-bold text-slate-800 transition-colors group-hover:text-[#4a2e5d]">
        {category.name}
      </h3>
    </Link>
  );
};

export default CategoryCard;
