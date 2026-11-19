import { Link, NavLink } from "react-router-dom";
import { LayoutDashboard, LogOut, LogIn, ArrowRight, User } from "lucide-react";

const MobileMenu = ({
  menuOpen,
  navLinks,
  linkClass,
  user,
  dashboardPath,
  onClose,
  onLogout,
  loggingOut,
}) => {
  if (!menuOpen) return null;

  return (
    <nav
      id="mobile-navigation"
      className="border-t border-[#d8e2eb] bg-white px-4 py-6 shadow-lg md:hidden"
    >
      <div className="flex flex-col gap-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === "/"}
            onClick={onClose}
            className={({ isActive }) => {
              const externalClass =
                typeof linkClass === "function"
                  ? linkClass({ isActive })
                  : linkClass || "";

              return `${externalClass} flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-colors ${
                isActive
                  ? "border border-[#034078]/20 bg-[#f4f7fa] font-extrabold text-[#034078]"
                  : "font-semibold text-[#33415c] hover:bg-[#f8fafc] hover:text-[#0a1128]"
              }`;
            }}
          >
            <span>{link.label}</span>
          </NavLink>
        ))}

        <div className="my-2 border-t border-[#e2e8f0]" />

        {user ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-2xl border border-[#d8e2eb] bg-[#f8fafc] px-4 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#d8e2eb] bg-white text-[#1282a2]">
                <User className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-[#64748b]">
                  Signed in as
                </p>
                <p className="truncate text-sm font-extrabold text-[#0a1128]">
                  {user.name}
                </p>
              </div>
            </div>

            <Link
              to={dashboardPath}
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-4 py-3 text-sm font-bold text-[#0a1128] shadow-2xs transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078]"
            >
              <LayoutDashboard className="h-4 w-4 text-[#1282a2]" />
              <span>Dashboard</span>
            </Link>

            <button
              type="button"
              onClick={onLogout}
              disabled={loggingOut}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-bold text-red-700 transition-colors hover:border-red-300 hover:bg-red-100 hover:text-red-800 disabled:pointer-events-none disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" />
              <span>{loggingOut ? "Logging out..." : "Logout"}</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pt-1">
            <Link
              to="/login"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-4 py-3 text-sm font-bold text-[#0a1128] shadow-2xs transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078]"
            >
              <LogIn className="h-4 w-4 text-[#1282a2]" />
              <span>Login</span>
            </Link>

            <Link
              to="/register"
              onClick={onClose}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#034078] px-4 py-3.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#001f54]"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MobileMenu;
