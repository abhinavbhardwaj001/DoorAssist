import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SmartServiceAssistant from "../ai/SmartServiceAssistant";

const PublicLayout = () => {
  const { pathname } = useLocation();

  const showAiAssistant =
    pathname === "/" ||
    pathname === "/categories" ||
    pathname === "/services" ||
    pathname.startsWith("/services/") ||
    pathname.startsWith("/providers/");

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-clip bg-linear-to-br from-[#f8f5ff] via-[#fbfaff] to-[#f2f8ff] text-slate-800 selection:bg-[#deabff]/40 selection:text-slate-900">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -left-32 top-20 -z-10 h-96 w-96 rounded-full bg-[#e4a5ff]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -right-32 top-1/2 -z-10 h-96 w-96 rounded-full bg-[#acdcff]/25 blur-3xl"
      />

      <Navbar />

      <main className="relative z-0 flex-1">
        <Outlet />
      </main>

      <Footer />

      {showAiAssistant && <SmartServiceAssistant />}
    </div>
  );
};

export default PublicLayout;
