const FilterTabs = ({ options, value, onChange, className = "" }) => {
  return (
    <div
      className={`rounded-3xl border border-[#d8e2eb] bg-white p-3 shadow-xs sm:p-4 ${className}`}
    >
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const item =
            typeof option === "string"
              ? { label: option, value: option }
              : option;
          const isActive = value === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              aria-pressed={isActive}
              className={`cursor-pointer rounded-xl px-3.5 py-2 text-xs font-bold capitalize transition-colors sm:px-4 sm:text-sm ${
                isActive
                  ? "bg-[#034078] text-white shadow-2xs hover:bg-[#001f54]"
                  : "border border-[#cbd5e1] bg-[#f8fafc] text-[#33415c] hover:border-[#1282a2] hover:bg-[#f4f7fa] hover:text-[#0a1128]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterTabs;
