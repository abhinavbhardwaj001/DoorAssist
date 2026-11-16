const FilterTabs = ({ options, value, onChange, className = "" }) => {
  return (
    <div
      className={`rounded-3xl border border-white/75 bg-white/75 p-3 shadow-[0_4px_25px_rgba(203,189,255,0.12)] backdrop-blur-xl sm:p-4 ${className}`}
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
              className={`rounded-xl px-3.5 py-2 text-xs font-bold capitalize transition-all active:scale-95 sm:px-4 sm:text-sm ${
                isActive
                  ? "bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] text-slate-900 shadow-sm shadow-[#cbbdff]/30"
                  : "border border-[#bfcaff]/40 bg-white/70 text-slate-600 hover:border-[#deabff] hover:bg-white hover:text-slate-900"
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
