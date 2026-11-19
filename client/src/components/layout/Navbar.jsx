import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const dashboardPath =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "provider"
        ? "/provider/dashboard"
        : "/dashboard";

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Services", path: "/services" },
    { label: "Categories", path: "/categories" },
  ];

  const desktopLinkClass = ({ isActive }) =>
    `group relative py-2 text-sm transition-colors ${
      isActive
        ? "font-extrabold text-[#034078]"
        : "font-semibold text-[#33415c] hover:text-[#0a1128]"
    }`;

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    setError("");

    try {
      await logout();
      setMenuOpen(false);
      navigate("/login", { replace: true });
    } catch {
      setError("Logout request failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#d8e2eb] bg-white shadow-2xs">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight text-[#0a1128] transition-colors hover:text-[#034078]"
        >
          <span>DoorAssist</span>
          <span className="h-2 w-2 rounded-full bg-[#1282a2]" />
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-8 md:flex"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={desktopLinkClass}
            >
              {({ isActive }) => (
                <>
                  <span>{link.label}</span>
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 h-[2.5px] origin-left rounded-full bg-[#1282a2] transition-transform duration-300 ease-out ${
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Auth Controls */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="max-w-36 truncate rounded-full border border-[#d8e2eb] bg-[#f8fafc] px-3.5 py-1.5 text-xs font-bold text-[#0a1128]">
                Hi, {user.name?.split(" ")[0]}
              </span>

              <Link
                to={dashboardPath}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#cbd5e1] bg-white px-4 py-2 text-sm font-bold text-[#0a1128] shadow-2xs transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078]"
              >
                <LayoutDashboard className="h-4 w-4 text-[#1282a2]" />
                <span>Dashboard</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition-colors hover:border-red-300 hover:bg-red-100 hover:text-red-800 disabled:pointer-events-none disabled:opacity-60"
              >
                <LogOut className="h-4 w-4" />
                <span>{loggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl border border-[#cbd5e1] bg-white px-4 py-2 text-sm font-bold text-[#0a1128] shadow-2xs transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078]"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="group inline-flex items-center gap-1.5 rounded-xl bg-[#034078] px-5 py-2.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#001f54]"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-[#0a1128] shadow-2xs transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078] md:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <MobileMenu
        menuOpen={menuOpen}
        navLinks={navLinks}
        user={user}
        dashboardPath={dashboardPath}
        onClose={() => setMenuOpen(false)}
        onLogout={handleLogout}
        loggingOut={loggingOut}
      />

      {/* Error Banner */}
      {error && (
        <div
          role="alert"
          className="flex items-center justify-center gap-2 border-t border-red-200 bg-red-50 px-4 py-2.5 text-center text-xs font-bold text-red-900 sm:text-sm"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}
    </header>
  );
};

export default Navbar;
