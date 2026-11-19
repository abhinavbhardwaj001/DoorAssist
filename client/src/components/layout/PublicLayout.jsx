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
    <div className="relative flex min-h-dvh flex-col overflow-x-clip bg-[#fefcfb] text-[#0a1128] selection:bg-[#1282a2]/20 selection:text-[#0a1128]">
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
