import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  Search,
  Sparkles,
  FileCheck2,
  Briefcase,
  ClipboardList,
  Clock,
  Store,
  Users,
  UserCheck,
  FolderKanban,
  ArrowLeft,
} from "lucide-react";

const navigation = {
  customer: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "My Bookings", path: "/bookings", icon: CalendarCheck },
    { label: "My Payments", path: "/payments", icon: CreditCard },
    { label: "Explore Services", path: "/services", icon: Search },
    { label: "Become a Provider", path: "/become-provider", icon: Sparkles },
    {
      label: "Application Status",
      path: "/provider-application",
      icon: FileCheck2,
    },
  ],
  provider: [
    { label: "Dashboard", path: "/provider/dashboard", icon: LayoutDashboard },
    { label: "My Services", path: "/provider/services", icon: Briefcase },
    { label: "Bookings", path: "/provider/bookings", icon: ClipboardList },
    { label: "Availability", path: "/provider/availability", icon: Clock },
    { label: "Business Profile", path: "/provider/profile", icon: Store },
  ],
  admin: [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Users", path: "/admin/users", icon: Users },
    {
      label: "Provider Applications",
      path: "/admin/providers",
      icon: UserCheck,
    },
    { label: "Categories", path: "/admin/categories", icon: FolderKanban },
  ],
};

const Sidebar = ({ user, onNavigate }) => {
  const links = navigation[user?.role] || [];

  return (
    <aside className="flex h-full w-full flex-col border-r border-[#d8e2eb] bg-white">
      {/* Brand Header */}
      <div className="border-b border-[#e2e8f0] px-6 py-6">
        <Link
          to="/"
          onClick={onNavigate}
          className="inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight text-[#0a1128] transition-colors hover:text-[#034078]"
        >
          <span>DoorAssist</span>
          <span className="h-2 w-2 rounded-full bg-[#1282a2]" />
        </Link>

        <div className="mt-1.5 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#1282a2]" />
          <p className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
            Service Management
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav
        aria-label="Dashboard navigation"
        className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6"
      >
        {links.map((link) => {
          const IconComponent = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={
                link.path === "/dashboard" ||
                link.path === "/admin" ||
                link.path === "/provider/dashboard"
              }
              onClick={onNavigate}
              className={({ isActive }) =>
                `group flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm transition-colors ${
                  isActive
                    ? "bg-[#034078] font-bold text-white shadow-2xs"
                    : "font-semibold text-[#33415c] hover:bg-[#f4f7fa] hover:text-[#0a1128]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                      isActive
                        ? "border-white/20 bg-[#001f54] text-white"
                        : "border-[#d8e2eb] bg-[#f8fafc] text-[#1282a2] group-hover:border-[#1282a2]/40 group-hover:bg-white group-hover:text-[#034078]"
                    }`}
                  >
                    <IconComponent aria-hidden="true" className="h-4 w-4" />
                  </div>

                  <span className="truncate">{link.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Link */}
      <div className="border-t border-[#e2e8f0] p-4">
        <Link
          to="/"
          onClick={onNavigate}
          className="group flex items-center gap-3 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-sm font-bold text-[#0a1128] shadow-2xs transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078]"
        >
          <ArrowLeft className="h-4 w-4 text-[#1282a2] transition-transform group-hover:-translate-x-1 group-hover:text-[#034078]" />
          <span>Back to Website</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
