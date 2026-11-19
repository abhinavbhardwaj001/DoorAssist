import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/services?categoryId=${category._id}`}
      className="group relative flex flex-col items-center rounded-3xl border border-[#d8e2eb] bg-white p-6 text-center shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1282a2] hover:shadow-md"
    >
      <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#d8e2eb] bg-[#f4f7fa] p-1 transition-transform duration-300 group-hover:scale-105">
        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-white">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <Briefcase className="h-8 w-8 text-[#1282a2] transition-transform duration-300 group-hover:scale-105 group-hover:text-[#034078]" />
          )}
        </div>
      </div>

      <h3 className="mt-5 text-sm font-extrabold text-[#0a1128] transition-colors group-hover:text-[#034078]">
        {category.name}
      </h3>
    </Link>
  );
};

export default CategoryCard;
