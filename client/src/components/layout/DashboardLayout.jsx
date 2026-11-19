import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, ExternalLink } from "lucide-react";

import Sidebar from "./Sidebar";
import useAuth from "../../hooks/useAuth";
import { useNotification } from "../../context/NotificationContext";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showNotification } = useNotification();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();

      setSidebarOpen(false);
      navigate("/login", { replace: true });
    } catch {
      showNotification("Unable to complete logout. Please try again.", "error");
    } finally {
      setLoggingOut(false);
    }
  };

  const roleLabel =
    user?.role === "admin"
      ? "Administrator"
      : user?.role === "provider"
        ? "Service Provider"
        : "Customer";

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#fefcfb] text-[#0a1128] selection:bg-[#1282a2]/20 selection:text-[#0a1128]">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <Sidebar user={user} />
      </aside>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 bg-[#0a1128]/55 transition-opacity"
          />

          <aside className="relative h-full w-72 max-w-[85vw] shadow-2xl">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
              className="absolute right-4 top-5 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[#cbd5e1] bg-white text-[#33415c] shadow-2xs transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078]"
            >
              <X className="h-4 w-4" />
            </button>

            <Sidebar user={user} onNavigate={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Application Area */}
      <div className="lg:pl-64">
        {/* Sticky Dashboard Header */}
        <header className="sticky top-0 z-30 border-b border-[#d8e2eb] bg-white shadow-2xs">
          <div className="flex h-18 items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <button
                type="button"
                aria-label="Open navigation menu"
                onClick={() => setSidebarOpen(true)}
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#cbd5e1] bg-[#f8fafc] text-[#0a1128] shadow-2xs transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078] lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-extrabold tracking-tight text-[#0a1128] sm:text-base">
                    {roleLabel} Portal
                  </p>
                  <span className="hidden h-2 w-2 shrink-0 rounded-full bg-[#1282a2] sm:inline-block" />
                </div>

                <p className="truncate text-xs font-medium text-[#33415c]">
                  DoorAssist Dashboard
                </p>
              </div>
            </div>

            {/* Account Controls */}
            <div className="flex shrink-0 items-center gap-2.5 sm:gap-3.5">
              <Link
                to="/"
                className="hidden items-center gap-1.5 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-3.5 py-2 text-xs font-bold text-[#0a1128] transition-colors hover:border-[#034078] hover:bg-[#f4f7fa] hover:text-[#034078] sm:inline-flex"
              >
                <span>Visit Website</span>
                <ExternalLink className="h-3.5 w-3.5 text-[#1282a2]" />
              </Link>

              <Link
                to="/profile"
                title="View account profile"
                aria-label="View account profile"
                className="group flex items-center gap-2.5 rounded-full border border-[#d8e2eb] bg-[#f8fafc] p-1 pr-1 transition-colors hover:border-[#1282a2] hover:bg-[#f4f7fa] md:pr-3.5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#034078] text-xs font-extrabold text-white transition-colors group-hover:bg-[#001f54]">
                  {initial}
                </span>

                <div className="hidden text-left md:block">
                  <p className="max-w-32 truncate text-xs font-bold leading-tight text-[#0a1128]">
                    {user?.name}
                  </p>

                  <p className="text-[11px] font-semibold capitalize leading-tight text-[#64748b]">
                    {user?.role}
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                aria-label={loggingOut ? "Logging out..." : "Logout"}
                className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition-colors hover:border-red-300 hover:bg-red-100 hover:text-red-800 disabled:pointer-events-none disabled:opacity-60 sm:px-3.5 sm:text-sm"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">
                  {loggingOut ? "Logging out..." : "Logout"}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Current Dashboard Page */}
        <main className="relative z-0 min-h-[calc(100vh-4.5rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
