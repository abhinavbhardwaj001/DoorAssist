import { ShieldCheck } from "lucide-react";

const AdminPageHeader = ({
  badge = "Administration",
  title,
  subtitle,
  action,
}) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bfcaff]/40 bg-white/70 px-3.5 py-1 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-md">
        <ShieldCheck className="h-3.5 w-3.5 text-[#a575bf]" />
        <span>{badge}</span>
      </div>

      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-1.5 text-sm font-medium text-slate-500">{subtitle}</p>
      )}
    </div>

    {action && <div className="w-full sm:w-auto">{action}</div>}
  </div>
);

export default AdminPageHeader;
