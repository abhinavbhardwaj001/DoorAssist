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
      className="relative overflow-hidden border-t border-white/70 bg-white/85 px-4 py-6 shadow-[0_16px_40px_rgba(203,189,255,0.22)] backdrop-blur-2xl md:hidden"
    >
      <div className="pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full bg-[#e4a5ff] opacity-25 blur-2xl"></div>
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-[#acdcff] opacity-30 blur-2xl"></div>

      <div className="relative z-10 flex flex-col gap-2">
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

              return `${externalClass} flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-all ${
                isActive
                  ? "bg-linear-to-r from-[#e4a5ff]/30 via-[#cbbdff]/30 to-[#acdcff]/30 font-bold text-slate-900 ring-1 ring-inset ring-[#deabff]/60"
                  : "font-semibold text-slate-700 hover:bg-white/70 hover:text-slate-900"
              }`;
            }}
          >
            <span>{link.label}</span>
          </NavLink>
        ))}

        <div className="my-2 border-t border-[#bfcaff]/30" />

        {user ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-2xl border border-[#bfcaff]/30 bg-white/60 px-4 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#e4a5ff]/40 to-[#acdcff]/40 text-slate-800">
                <User className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-500">
                  Signed in as
                </p>
                <p className="truncate text-sm font-bold text-slate-800">
                  {user.name}
                </p>
              </div>
            </div>

            <Link
              to={dashboardPath}
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#bfcaff]/50 bg-white/75 px-4 py-3 text-sm font-bold text-slate-800 shadow-xs transition-all hover:border-[#deabff] hover:bg-linear-to-r hover:from-[#e4a5ff]/15 hover:to-[#acdcff]/15 active:scale-[0.98]"
            >
              <LayoutDashboard className="h-4 w-4 text-slate-600" />
              <span>Dashboard</span>
            </Link>

            <button
              type="button"
              onClick={onLogout}
              disabled={loggingOut}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-4 py-3.5 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:brightness-105 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
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
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#bfcaff]/50 bg-white/75 px-4 py-3 text-sm font-bold text-slate-800 shadow-xs transition-all hover:border-[#deabff] hover:bg-white active:scale-[0.98]"
            >
              <LogIn className="h-4 w-4 text-slate-600" />
              <span>Login</span>
            </Link>

            <Link
              to="/register"
              onClick={onClose}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e4a5ff] via-[#cbbdff] to-[#acdcff] px-4 py-3.5 text-sm font-bold text-slate-900 shadow-lg shadow-[#cbbdff]/30 transition-all hover:brightness-105 active:scale-[0.98]"
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
