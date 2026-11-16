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
    <aside className="relative flex h-full w-full flex-col overflow-hidden border-r border-white/60 bg-white/80 backdrop-blur-2xl">
      <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-[#e4a5ff] opacity-20 blur-3xl"></div>
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-[#acdcff] opacity-25 blur-3xl"></div>

      {/* Brand Header */}
      <div className="relative z-10 border-b border-[#bfcaff]/30 px-6 py-6">
        <Link
          to="/"
          onClick={onNavigate}
          className="inline-block text-2xl font-extrabold tracking-tight text-slate-800 transition-colors hover:text-slate-600"
        >
          DoorAssist
        </Link>

        <div className="mt-1.5 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-linear-to-r from-[#e4a5ff] to-[#acdcff]"></span>
          <p className="text-xs font-semibold tracking-wide text-slate-400">
            Service Management
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav
        aria-label="Dashboard navigation"
        className="relative z-10 flex-1 space-y-1.5 overflow-y-auto px-4 py-6"
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
                `group flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm transition-all ${
                  isActive
                    ? "bg-linear-to-r from-[#e4a5ff]/35 via-[#cbbdff]/35 to-[#acdcff]/35 font-bold text-slate-900 shadow-[0_4px_15px_rgba(203,189,255,0.2)] ring-1 ring-inset ring-[#deabff]/60"
                    : "font-semibold text-slate-600 hover:bg-white/70 hover:text-slate-900 hover:shadow-xs"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${
                      isActive
                        ? "bg-white/80 text-slate-900 shadow-xs"
                        : "bg-slate-100/70 text-slate-500 group-hover:bg-[#cbbdff]/25 group-hover:text-slate-800"
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
      <div className="relative z-10 border-t border-[#bfcaff]/30 p-4">
        <Link
          to="/"
          onClick={onNavigate}
          className="group flex items-center gap-3 rounded-xl border border-[#bfcaff]/40 bg-white/60 px-4 py-3 text-sm font-bold text-slate-700 shadow-xs transition-all hover:border-[#deabff] hover:bg-linear-to-r hover:from-[#e4a5ff]/15 hover:to-[#acdcff]/15 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4 text-slate-500 transition-transform group-hover:-translate-x-1 group-hover:text-slate-800" />
          <span>Back to Website</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
