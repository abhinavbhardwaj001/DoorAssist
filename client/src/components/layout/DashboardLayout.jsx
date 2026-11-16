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
    <div className="relative min-h-screen overflow-x-clip bg-linear-to-br from-[#f8f5ff] via-[#fbfaff] to-[#f2f8ff] text-slate-800 selection:bg-[#deabff]/40 selection:text-slate-900">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-1/4 top-16 -z-10 h-96 w-96 rounded-full bg-[#e4a5ff]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -right-24 bottom-12 -z-10 h-96 w-96 rounded-full bg-[#acdcff]/25 blur-3xl"
      />

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
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          />

          <aside className="relative h-full w-72 max-w-[85vw] shadow-[0_16px_50px_rgba(203,189,255,0.28)]">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
              className="absolute right-4 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-xl border border-[#bfcaff]/50 bg-white/80 text-slate-600 shadow-xs transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-900 active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>

            <Sidebar user={user} onNavigate={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Application Area */}
      <div className="lg:pl-64">
        {/* Frosted Dashboard Header */}
        <header className="sticky top-0 z-30 border-b border-white/70 bg-white/75 shadow-[0_4px_30px_rgba(203,189,255,0.12)] backdrop-blur-2xl">
          <div className="flex h-18 items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <button
                type="button"
                aria-label="Open navigation menu"
                onClick={() => setSidebarOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#bfcaff]/50 bg-white/75 text-slate-700 shadow-xs transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-900 active:scale-95 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-extrabold text-slate-800 sm:text-base">
                    {roleLabel} Portal
                  </p>
                  <span className="hidden h-2 w-2 shrink-0 rounded-full bg-linear-to-r from-[#e4a5ff] to-[#acdcff] sm:inline-block" />
                </div>

                <p className="truncate text-xs font-medium text-slate-500">
                  DoorAssist Dashboard
                </p>
              </div>
            </div>

            {/* Account Controls */}
            <div className="flex shrink-0 items-center gap-2.5 sm:gap-4">
              <Link
                to="/"
                className="hidden items-center gap-1.5 rounded-xl border border-[#bfcaff]/40 bg-white/60 px-3.5 py-2 text-xs font-bold text-slate-700 transition-all hover:border-[#deabff] hover:bg-white hover:text-slate-900 sm:inline-flex"
              >
                <span>Visit Website</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
              </Link>

              <Link
                to="/profile"
                title="View account profile"
                aria-label="View account profile"
                className="group flex items-center gap-2.5 rounded-full border border-[#bfcaff]/50 bg-white/70 p-1 pr-1 transition-all hover:border-[#deabff] hover:bg-white hover:shadow-xs md:pr-3.5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#e4a5ff]/60 via-[#cbbdff]/60 to-[#acdcff]/60 text-xs font-extrabold text-slate-900 shadow-inner transition-transform group-hover:scale-105">
                  {initial}
                </span>

                <div className="hidden text-left md:block">
                  <p className="max-w-32 truncate text-xs font-bold leading-tight text-slate-800">
                    {user?.name}
                  </p>

                  <p className="text-[11px] font-semibold capitalize leading-tight text-slate-500">
                    {user?.role}
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                aria-label={loggingOut ? "Logging out..." : "Logout"}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200/80 bg-red-50/70 px-3 py-2 text-xs font-bold text-red-600 transition-all hover:border-red-300 hover:bg-red-100/80 hover:text-red-700 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 sm:px-3.5 sm:text-sm"
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
