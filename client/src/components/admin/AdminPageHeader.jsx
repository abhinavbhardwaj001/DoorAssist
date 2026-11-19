import { ShieldCheck } from "lucide-react";

const AdminPageHeader = ({
  badge = "Administration",
  title,
  subtitle,
  action,
}) => (
  <div className="rounded-3xl border border-[#d8e2eb] bg-white p-6 shadow-xs sm:p-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-[#d8e2eb] bg-[#f4f7fa] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#034078]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#1282a2]" />
          <span>{badge}</span>
        </div>

        <h1 className="mt-3.5 text-2xl font-extrabold tracking-tight text-[#0a1128] sm:text-3xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-1.5 text-sm font-medium text-[#33415c]">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="w-full sm:w-auto">{action}</div>}
    </div>
  </div>
);

export default AdminPageHeader;
